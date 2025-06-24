
-- Update whatsapp_notifications table to include admin notifications
ALTER TABLE public.whatsapp_notifications 
ADD COLUMN IF NOT EXISTS notification_for TEXT DEFAULT 'user' CHECK (notification_for IN ('user', 'admin'));

-- Update the contract creation notification function
CREATE OR REPLACE FUNCTION public.notify_contract_creation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert WhatsApp notification for admin
    INSERT INTO public.whatsapp_notifications (contract_id, phone_number, message, notification_for)
    VALUES (
        NEW.id,
        '081991191988',
        FORMAT('ADMIN ALERT: Kontrak baru dibuat oleh user %s. Tipe: %s, Harga: %s, Status: %s. ID: %s. Mohon segera verifikasi.',
               NEW.user_id,
               NEW.contract_type,
               NEW.price,
               NEW.payment_status,
               NEW.id
        ),
        'admin'
    );
    
    RETURN NEW;
END;
$$;

-- Create email notifications table
CREATE TABLE IF NOT EXISTS public.email_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
    email_address TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for email notifications
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policy for email notifications
CREATE POLICY "Admins can view all email notifications" ON public.email_notifications
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Function to send email notification when contract is created
CREATE OR REPLACE FUNCTION public.notify_admin_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert email notification for admin
    INSERT INTO public.email_notifications (contract_id, email_address, subject, message)
    VALUES (
        NEW.id,
        'caluxkonde@gmail.com',
        'Kontrak Baru Nahkodaku - Perlu Verifikasi',
        FORMAT('Halo Admin,

Kontrak baru telah dibuat dan memerlukan verifikasi Anda:

- ID Kontrak: %s
- User ID: %s
- Tipe Kontrak: %s
- Harga: Rp %s
- Metode Pembayaran: %s
- Status: %s
- Tanggal: %s

Silakan login ke sistem admin untuk memverifikasi kontrak ini.

Terima kasih,
Sistem Nahkodaku',
               NEW.id,
               NEW.user_id,
               NEW.contract_type,
               NEW.price,
               COALESCE(NEW.payment_method, 'Belum dipilih'),
               NEW.payment_status,
               NEW.created_at
        )
    );
    
    RETURN NEW;
END;
$$;

-- Create trigger for email notifications
CREATE TRIGGER notify_admin_email_trigger
    AFTER INSERT ON public.contracts
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_admin_email();
