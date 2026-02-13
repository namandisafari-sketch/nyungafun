
-- Table for lost ID reports
CREATE TABLE public.lost_id_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id),
  finder_phone TEXT NOT NULL,
  finder_name TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'reported',
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lost_id_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public page for finders)
CREATE POLICY "Anyone can report a lost ID"
  ON public.lost_id_reports
  FOR INSERT
  WITH CHECK (true);

-- Admins can view and manage all reports
CREATE POLICY "Admins can manage lost ID reports"
  ON public.lost_id_reports
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Parents can view reports for their own students
CREATE POLICY "Parents can view own student lost ID reports"
  ON public.lost_id_reports
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM applications a
    WHERE a.id = lost_id_reports.application_id AND a.user_id = auth.uid()
  ));
