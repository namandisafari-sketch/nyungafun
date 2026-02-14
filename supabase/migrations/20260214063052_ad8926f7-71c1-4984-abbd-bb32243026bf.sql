
CREATE TABLE public.parent_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id),
  amount numeric NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'cash',
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  term text DEFAULT '',
  year text DEFAULT '',
  description text DEFAULT '',
  payment_code_id uuid REFERENCES public.payment_codes(id),
  recorded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.parent_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage parent payments"
ON public.parent_payments FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Parents can view own payments"
ON public.parent_payments FOR SELECT
USING (EXISTS (
  SELECT 1 FROM applications a WHERE a.id = parent_payments.application_id AND a.user_id = auth.uid()
));

CREATE TRIGGER update_parent_payments_updated_at
BEFORE UPDATE ON public.parent_payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
