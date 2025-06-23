
-- Add admin role to user_roles table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
        -- Create enum for roles
        CREATE TYPE public.app_role AS ENUM ('admin', 'user');
        
        -- Create user_roles table
        CREATE TABLE public.user_roles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            role app_role NOT NULL DEFAULT 'user',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE (user_id, role)
        );
        
        -- Enable RLS
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Users can view their own roles') THEN
        CREATE POLICY "Users can view their own roles" ON public.user_roles
          FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Admins can view all roles') THEN
        CREATE POLICY "Admins can view all roles" ON public.user_roles
          FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Admins can manage roles') THEN
        CREATE POLICY "Admins can manage roles" ON public.user_roles
          FOR ALL USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

-- Add admin status to contracts table
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- Create notifications table for WhatsApp notifications
CREATE TABLE IF NOT EXISTS public.whatsapp_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for notifications
ALTER TABLE public.whatsapp_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Admins can view all notifications" ON public.whatsapp_notifications
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert notifications" ON public.whatsapp_notifications
  FOR INSERT WITH CHECK (true);

-- Function to send WhatsApp notification when contract is created
CREATE OR REPLACE FUNCTION public.notify_contract_creation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert WhatsApp notification
    INSERT INTO public.whatsapp_notifications (contract_id, phone_number, message)
    VALUES (
        NEW.id,
        '081991191988',
        FORMAT('Kontrak baru dibuat oleh user %s. Tipe: %s, Harga: %s, Status pembayaran: %s. ID Kontrak: %s',
               NEW.user_id,
               NEW.contract_type,
               NEW.price,
               NEW.payment_status,
               NEW.id
        )
    );
    
    RETURN NEW;
END;
$$;

-- Create trigger for contract creation notifications
DROP TRIGGER IF EXISTS notify_contract_creation_trigger ON public.contracts;
CREATE TRIGGER notify_contract_creation_trigger
    AFTER INSERT ON public.contracts
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_contract_creation();

-- Function to update contract status and calculate dates when admin accepts
CREATE OR REPLACE FUNCTION public.accept_contract(
    contract_id_param UUID,
    admin_id_param UUID,
    admin_notes_param TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    contract_row public.contracts%ROWTYPE;
BEGIN
    -- Check if user is admin
    IF NOT public.has_role(admin_id_param, 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'Unauthorized: Admin access required');
    END IF;
    
    -- Update contract
    UPDATE public.contracts 
    SET 
        payment_status = 'verified',
        status = 'active',
        start_date = NOW(),
        reviewed_by = admin_id_param,
        reviewed_at = NOW(),
        admin_notes = admin_notes_param,
        updated_at = NOW()
    WHERE id = contract_id_param
    RETURNING * INTO contract_row;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Contract not found');
    END IF;
    
    -- Send notification to user's WhatsApp if provided
    IF contract_row.whatsapp_number IS NOT NULL THEN
        INSERT INTO public.whatsapp_notifications (contract_id, phone_number, message)
        VALUES (
            contract_id_param,
            contract_row.whatsapp_number,
            FORMAT('Selamat! Kontrak %s Anda telah disetujui dan aktif. Berlaku hingga %s.',
                   contract_row.contract_type,
                   to_char(contract_row.end_date, 'DD-MM-YYYY')
            )
        );
    END IF;
    
    RETURN json_build_object('success', true, 'contract', row_to_json(contract_row));
END;
$$;

-- Function to reject contract
CREATE OR REPLACE FUNCTION public.reject_contract(
    contract_id_param UUID,
    admin_id_param UUID,
    admin_notes_param TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    contract_row public.contracts%ROWTYPE;
BEGIN
    -- Check if user is admin
    IF NOT public.has_role(admin_id_param, 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'Unauthorized: Admin access required');
    END IF;
    
    -- Update contract
    UPDATE public.contracts 
    SET 
        payment_status = 'failed',
        status = 'cancelled',
        reviewed_by = admin_id_param,
        reviewed_at = NOW(),
        admin_notes = admin_notes_param,
        updated_at = NOW()
    WHERE id = contract_id_param
    RETURNING * INTO contract_row;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Contract not found');
    END IF;
    
    -- Send notification to user's WhatsApp if provided
    IF contract_row.whatsapp_number IS NOT NULL THEN
        INSERT INTO public.whatsapp_notifications (contract_id, phone_number, message)
        VALUES (
            contract_id_param,
            contract_row.whatsapp_number,
            FORMAT('Maaf, kontrak %s Anda ditolak. Alasan: %s. Silakan hubungi admin untuk informasi lebih lanjut.',
                   contract_row.contract_type,
                   COALESCE(admin_notes_param, 'Tidak ada catatan')
            )
        );
    END IF;
    
    RETURN json_build_object('success', true, 'contract', row_to_json(contract_row));
END;
$$;
