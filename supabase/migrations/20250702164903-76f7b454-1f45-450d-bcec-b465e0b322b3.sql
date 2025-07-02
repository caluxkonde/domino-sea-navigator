-- Add job posting columns to blog_posts table for unified content management
ALTER TABLE public.blog_posts 
ADD COLUMN post_type TEXT DEFAULT 'article' CHECK (post_type IN ('article', 'job')),
ADD COLUMN company TEXT,
ADD COLUMN location TEXT,
ADD COLUMN salary_range TEXT,
ADD COLUMN application_deadline DATE,
ADD COLUMN requirements TEXT,
ADD COLUMN job_type TEXT DEFAULT 'full-time' CHECK (job_type IN ('full-time', 'part-time', 'contract', 'freelance')),
ADD COLUMN experience_level TEXT DEFAULT 'entry' CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead')),
ADD COLUMN contact_info TEXT;

-- Add cancelled status to contracts
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Update contract status check constraint to include cancelled
ALTER TABLE public.contracts DROP CONSTRAINT IF EXISTS contracts_status_check;
ALTER TABLE public.contracts 
ADD CONSTRAINT contracts_status_check 
CHECK (status IN ('pending', 'active', 'expired', 'cancelled'));

-- Create function to cancel contract
CREATE OR REPLACE FUNCTION public.cancel_contract(
  contract_id_param UUID,
  admin_id_param UUID,
  cancellation_reason_param TEXT DEFAULT NULL
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
    
    -- Update contract to cancelled status
    UPDATE public.contracts 
    SET 
        status = 'cancelled',
        cancellation_reason = cancellation_reason_param,
        reviewed_by = admin_id_param,
        reviewed_at = NOW(),
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
            FORMAT('Kontrak %s Anda telah dibatalkan. Alasan: %s. Silakan hubungi admin untuk informasi lebih lanjut.',
                   contract_row.contract_type,
                   COALESCE(cancellation_reason_param, 'Tidak ada alasan yang diberikan')
            )
        );
    END IF;
    
    -- Create notification for user
    INSERT INTO public.notifications (user_id, type, title, message, data)
    VALUES (
        contract_row.user_id,
        'contract_update',
        'Kontrak Dibatalkan',
        FORMAT('Kontrak %s Anda telah dibatalkan oleh admin. %s', 
               contract_row.contract_type,
               CASE WHEN cancellation_reason_param IS NOT NULL 
                    THEN FORMAT('Alasan: %s', cancellation_reason_param)
                    ELSE ''
               END),
        json_build_object(
            'contract_id', contract_id_param, 
            'contract_type', contract_row.contract_type,
            'cancellation_reason', cancellation_reason_param
        )
    );
    
    RETURN json_build_object('success', true, 'contract', row_to_json(contract_row));
END;
$$;

-- Add premium expiry notification trigger
CREATE OR REPLACE FUNCTION public.notify_premium_expiry()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only send notification when contract becomes active
    IF NEW.status = 'active' AND NEW.payment_status = 'verified' AND OLD.status != 'active' THEN
        -- Insert notification for user about premium activation
        INSERT INTO public.notifications (user_id, type, title, message, data)
        VALUES (
            NEW.user_id,
            'premium_activated',
            'Akun Premium Aktif',
            FORMAT('Selamat! Akun Premium Anda telah aktif hingga %s. Nikmati semua fitur premium Info Pelaut.',
                   to_char(NEW.end_date, 'DD-MM-YYYY')
            ),
            json_build_object(
                'contract_id', NEW.id,
                'contract_type', NEW.contract_type,
                'end_date', NEW.end_date,
                'subscription_type', NEW.subscription_type
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for premium activation notifications
DROP TRIGGER IF EXISTS trigger_notify_premium_expiry ON public.contracts;
CREATE TRIGGER trigger_notify_premium_expiry
    AFTER UPDATE ON public.contracts
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_premium_expiry();