
-- Update contracts table pricing
UPDATE public.contracts 
SET price = CASE 
  WHEN contract_type = '3_months' THEN 200000
  WHEN contract_type = '6_months' THEN 300000
  WHEN contract_type = '1_year' THEN 500000
END;

-- Update trigger function for new contract pricing
CREATE OR REPLACE FUNCTION public.set_contract_end_date()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  CASE NEW.contract_type
    WHEN '3_months' THEN
      NEW.end_date = NEW.start_date + INTERVAL '3 months';
      NEW.duration_months = 3;
      NEW.price = 200000;
    WHEN '6_months' THEN
      NEW.end_date = NEW.start_date + INTERVAL '6 months';
      NEW.duration_months = 6;
      NEW.price = 300000;
    WHEN '1_year' THEN
      NEW.end_date = NEW.start_date + INTERVAL '1 year';
      NEW.duration_months = 12;
      NEW.price = 500000;
  END CASE;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add monthly subscription option
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS subscription_type TEXT CHECK (subscription_type IN ('monthly', 'quarterly', 'yearly'));

-- Update existing contracts to set subscription_type
UPDATE public.contracts 
SET subscription_type = CASE 
  WHEN contract_type = '3_months' THEN 'quarterly'
  WHEN contract_type = '6_months' THEN 'quarterly'
  WHEN contract_type = '1_year' THEN 'yearly'
END;

-- Add monthly option to contract_type
ALTER TABLE public.contracts 
DROP CONSTRAINT IF EXISTS contracts_contract_type_check;

ALTER TABLE public.contracts 
ADD CONSTRAINT contracts_contract_type_check 
CHECK (contract_type IN ('1_month', '3_months', '6_months', '1_year'));

-- Update trigger for monthly subscription
CREATE OR REPLACE FUNCTION public.set_contract_end_date()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  CASE NEW.contract_type
    WHEN '1_month' THEN
      NEW.end_date = NEW.start_date + INTERVAL '1 month';
      NEW.duration_months = 1;
      NEW.price = 100000;
      NEW.subscription_type = 'monthly';
    WHEN '3_months' THEN
      NEW.end_date = NEW.start_date + INTERVAL '3 months';
      NEW.duration_months = 3;
      NEW.price = 200000;
      NEW.subscription_type = 'quarterly';
    WHEN '6_months' THEN
      NEW.end_date = NEW.start_date + INTERVAL '6 months';
      NEW.duration_months = 6;
      NEW.price = 300000;
      NEW.subscription_type = 'quarterly';
    WHEN '1_year' THEN
      NEW.end_date = NEW.start_date + INTERVAL '1 year';
      NEW.duration_months = 12;
      NEW.price = 500000;
      NEW.subscription_type = 'yearly';
  END CASE;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create CV purchases table
CREATE TABLE IF NOT EXISTS public.cv_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cv_type TEXT NOT NULL CHECK (cv_type IN ('silver', 'gold', 'platinum')),
  price NUMERIC NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('transfer', 'dana')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed')),
  payment_proof_url TEXT,
  whatsapp_number TEXT,
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for CV purchases
ALTER TABLE public.cv_purchases ENABLE ROW LEVEL SECURITY;

-- RLS policies for CV purchases
CREATE POLICY "Users can view their own CV purchases" ON public.cv_purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CV purchases" ON public.cv_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CV purchases" ON public.cv_purchases
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all CV purchases" ON public.cv_purchases
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all CV purchases" ON public.cv_purchases
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Function to set CV purchase pricing
CREATE OR REPLACE FUNCTION public.set_cv_purchase_price()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  CASE NEW.cv_type
    WHEN 'silver' THEN
      NEW.price = 20000;
    WHEN 'gold' THEN
      NEW.price = 50000;
    WHEN 'platinum' THEN
      NEW.price = 100000;
  END CASE;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for CV purchase pricing
CREATE TRIGGER set_cv_purchase_price_trigger
  BEFORE INSERT OR UPDATE ON public.cv_purchases
  FOR EACH ROW EXECUTE FUNCTION public.set_cv_purchase_price();

-- Function to check if user has premium access
CREATE OR REPLACE FUNCTION public.has_premium_access(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.contracts
    WHERE user_id = _user_id
      AND status = 'active'
      AND payment_status = 'verified'
      AND end_date > NOW()
  )
$$;

-- Function to get user premium status
CREATE OR REPLACE FUNCTION public.get_user_premium_status(_user_id UUID)
RETURNS JSON
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    json_build_object(
      'is_premium', true,
      'subscription_type', subscription_type,
      'end_date', end_date,
      'contract_type', contract_type
    ),
    json_build_object('is_premium', false)
  )
  FROM public.contracts
  WHERE user_id = _user_id
    AND status = 'active'
    AND payment_status = 'verified'
    AND end_date > NOW()
  ORDER BY end_date DESC
  LIMIT 1
$$;
