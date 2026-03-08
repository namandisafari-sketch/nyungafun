
-- Photocopying paper sizes and pricing configuration
CREATE TABLE public.photocopy_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paper_size TEXT NOT NULL DEFAULT 'A4',
  copy_type TEXT NOT NULL DEFAULT 'black_white',
  price_per_copy NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Photocopying transactions (POS-style)
CREATE TABLE public.photocopy_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT DEFAULT '',
  paper_size TEXT NOT NULL DEFAULT 'A4',
  copy_type TEXT NOT NULL DEFAULT 'black_white',
  num_copies INTEGER NOT NULL DEFAULT 1,
  price_per_copy NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  change_given NUMERIC NOT NULL DEFAULT 0,
  served_by UUID NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Daily shift reports for cash reconciliation
CREATE TABLE public.photocopy_shifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL,
  shift_date DATE NOT NULL DEFAULT CURRENT_DATE,
  opening_cash NUMERIC NOT NULL DEFAULT 0,
  closing_cash NUMERIC NOT NULL DEFAULT 0,
  expected_cash NUMERIC NOT NULL DEFAULT 0,
  discrepancy NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  notes TEXT DEFAULT '',
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Staff module permissions for custom per-module access
CREATE TABLE public.staff_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_key TEXT NOT NULL,
  can_access BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_key)
);

-- Enable RLS on all tables
ALTER TABLE public.photocopy_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photocopy_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photocopy_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_permissions ENABLE ROW LEVEL SECURITY;

-- Photocopy pricing policies
CREATE POLICY "Admins can manage pricing" ON public.photocopy_pricing FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated can view pricing" ON public.photocopy_pricing FOR SELECT USING (auth.uid() IS NOT NULL);

-- Photocopy transactions policies
CREATE POLICY "Admins can manage transactions" ON public.photocopy_transactions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Staff can insert own transactions" ON public.photocopy_transactions FOR INSERT WITH CHECK (auth.uid() = served_by);
CREATE POLICY "Staff can view own transactions" ON public.photocopy_transactions FOR SELECT USING (auth.uid() = served_by OR has_role(auth.uid(), 'admin'::app_role));

-- Photocopy shifts policies
CREATE POLICY "Admins can manage shifts" ON public.photocopy_shifts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Staff can manage own shifts" ON public.photocopy_shifts FOR ALL USING (auth.uid() = staff_id);

-- Staff permissions policies
CREATE POLICY "Admins can manage permissions" ON public.staff_permissions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own permissions" ON public.staff_permissions FOR SELECT USING (auth.uid() = user_id);

-- Insert default pricing
INSERT INTO public.photocopy_pricing (paper_size, copy_type, price_per_copy) VALUES
('A4', 'black_white', 200),
('A4', 'color', 500),
('A3', 'black_white', 500),
('A3', 'color', 1000),
('A5', 'black_white', 100),
('A5', 'color', 300);
