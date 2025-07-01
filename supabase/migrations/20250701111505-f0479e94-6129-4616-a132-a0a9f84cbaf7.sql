
-- Create notifications table for real-time notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'role_change', 'contract_update', 'admin_message')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications" ON public.notifications
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Function to create purchase notification
CREATE OR REPLACE FUNCTION public.notify_purchase_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert notification for user
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (
    NEW.user_id,
    'purchase',
    'Pembelian CV Berhasil',
    FORMAT('Pembelian CV %s Anda sedang diproses. Silakan tunggu verifikasi admin.', NEW.cv_type),
    json_build_object('purchase_id', NEW.id, 'cv_type', NEW.cv_type, 'price', NEW.price)
  );
  
  -- Insert notification for all admins
  INSERT INTO public.notifications (user_id, type, title, message, data)
  SELECT 
    ur.user_id,
    'admin_message',
    'Pembelian CV Baru',
    FORMAT('Pembelian CV %s baru memerlukan verifikasi. Harga: Rp %s', NEW.cv_type, NEW.price),
    json_build_object('purchase_id', NEW.id, 'cv_type', NEW.cv_type, 'price', NEW.price, 'user_id', NEW.user_id)
  FROM public.user_roles ur
  WHERE ur.role = 'admin';
  
  RETURN NEW;
END;
$$;

-- Function to create contract notification  
CREATE OR REPLACE FUNCTION public.notify_contract_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert notification for user
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (
    NEW.user_id,
    'contract_update',
    'Kontrak Berhasil Dibuat',
    FORMAT('Kontrak %s Anda sedang diproses. Silakan tunggu verifikasi admin.', NEW.contract_type),
    json_build_object('contract_id', NEW.id, 'contract_type', NEW.contract_type, 'price', NEW.price)
  );
  
  -- Insert notification for all admins
  INSERT INTO public.notifications (user_id, type, title, message, data)
  SELECT 
    ur.user_id,
    'admin_message',
    'Kontrak Baru',
    FORMAT('Kontrak %s baru memerlukan verifikasi. Harga: Rp %s', NEW.contract_type, NEW.price),
    json_build_object('contract_id', NEW.id, 'contract_type', NEW.contract_type, 'price', NEW.price, 'user_id', NEW.user_id)
  FROM public.user_roles ur
  WHERE ur.role = 'admin';
  
  RETURN NEW;
END;
$$;

-- Function to notify role changes
CREATE OR REPLACE FUNCTION public.notify_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert notification for user when role is added
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications (user_id, type, title, message, data)
    VALUES (
      NEW.user_id,
      'role_change',
      'Role Berubah',
      FORMAT('Role Anda telah diubah menjadi %s', NEW.role),
      json_build_object('role', NEW.role, 'action', 'added')
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS notify_cv_purchase_trigger ON public.cv_purchases;
CREATE TRIGGER notify_cv_purchase_trigger
  AFTER INSERT ON public.cv_purchases
  FOR EACH ROW EXECUTE FUNCTION public.notify_purchase_created();

DROP TRIGGER IF EXISTS notify_contract_trigger ON public.contracts;
CREATE TRIGGER notify_contract_trigger
  AFTER INSERT ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.notify_contract_created();

DROP TRIGGER IF EXISTS notify_role_change_trigger ON public.user_roles;
CREATE TRIGGER notify_role_change_trigger
  AFTER INSERT ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.notify_role_change();
