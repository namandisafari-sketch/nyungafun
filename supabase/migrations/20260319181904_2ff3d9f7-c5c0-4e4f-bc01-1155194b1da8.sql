
-- Create form intake queue table
CREATE TABLE public.form_intake (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_name TEXT NOT NULL,
  date_given DATE NOT NULL DEFAULT CURRENT_DATE,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  photo_url TEXT,
  signature_url TEXT,
  registered_by UUID NOT NULL,
  registered_by_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  linked_application_id UUID REFERENCES public.applications(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.form_intake ENABLE ROW LEVEL SECURITY;

-- All authenticated staff can view all intake records
CREATE POLICY "Authenticated can view intake records"
ON public.form_intake FOR SELECT TO authenticated
USING (true);

-- All authenticated staff can insert intake records
CREATE POLICY "Authenticated can insert intake records"
ON public.form_intake FOR INSERT TO authenticated
WITH CHECK (auth.uid() = registered_by);

-- Admins can manage all intake records
CREATE POLICY "Admins can manage intake records"
ON public.form_intake FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Staff can update their own intake records
CREATE POLICY "Staff can update own intake records"
ON public.form_intake FOR UPDATE TO authenticated
USING (auth.uid() = registered_by);

-- Trigger for updated_at
CREATE TRIGGER update_form_intake_updated_at
BEFORE UPDATE ON public.form_intake
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
