
-- Create contracts table for worker subscriptions
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  contract_type TEXT NOT NULL CHECK (contract_type IN ('3_months', '6_months', '1_year')),
  price NUMERIC NOT NULL,
  duration_months INTEGER NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  payment_method TEXT CHECK (payment_method IN ('transfer', 'dana')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed')),
  payment_proof_url TEXT,
  whatsapp_number TEXT,
  notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contract_notifications table to track notifications
CREATE TABLE public.contract_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES public.contracts NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('reminder', 'expiry')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  whatsapp_number TEXT NOT NULL,
  message_sent BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for contracts
CREATE POLICY "Users can view their own contracts" ON public.contracts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contracts" ON public.contracts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contracts" ON public.contracts
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for contract_notifications
CREATE POLICY "Users can view notifications for their contracts" ON public.contract_notifications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.contracts WHERE contracts.id = contract_notifications.contract_id AND contracts.user_id = auth.uid())
  );

-- Function to automatically set end_date based on contract type
CREATE OR REPLACE FUNCTION public.set_contract_end_date()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  CASE NEW.contract_type
    WHEN '3_months' THEN
      NEW.end_date = NEW.start_date + INTERVAL '3 months';
      NEW.duration_months = 3;
      NEW.price = 50000;
    WHEN '6_months' THEN
      NEW.end_date = NEW.start_date + INTERVAL '6 months';
      NEW.duration_months = 6;
      NEW.price = 90000;
    WHEN '1_year' THEN
      NEW.end_date = NEW.start_date + INTERVAL '1 year';
      NEW.duration_months = 12;
      NEW.price = 150000;
  END CASE;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for setting contract end date
CREATE TRIGGER set_contract_end_date_trigger
  BEFORE INSERT OR UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.set_contract_end_date();

-- Function to check for contracts expiring in 7 days
CREATE OR REPLACE FUNCTION public.get_contracts_expiring_soon()
RETURNS TABLE(
  contract_id UUID,
  user_email TEXT,
  whatsapp_number TEXT,
  contract_type TEXT,
  end_date TIMESTAMP WITH TIME ZONE,
  days_until_expiry INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    p.email,
    c.whatsapp_number,
    c.contract_type,
    c.end_date,
    EXTRACT(DAY FROM (c.end_date - NOW()))::INTEGER as days_until_expiry
  FROM public.contracts c
  JOIN public.profiles p ON p.id = c.user_id
  WHERE c.status = 'active' 
    AND c.end_date <= NOW() + INTERVAL '7 days'
    AND c.end_date > NOW()
    AND c.notification_sent = FALSE;
END;
$$;
