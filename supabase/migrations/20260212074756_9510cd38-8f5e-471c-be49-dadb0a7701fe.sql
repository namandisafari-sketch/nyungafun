
-- Table for school claims/reports on students
CREATE TABLE public.student_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id),
  claim_type TEXT NOT NULL DEFAULT 'general',
  description TEXT NOT NULL,
  action_taken TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  created_by UUID,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage claims"
  ON public.student_claims FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_student_claims_updated_at
  BEFORE UPDATE ON public.student_claims
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
