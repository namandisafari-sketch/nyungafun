
-- Lawyer form templates (admin-managed)
CREATE TABLE public.lawyer_form_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lawyer_form_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage lawyer form templates"
  ON public.lawyer_form_templates FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone authenticated can view active templates"
  ON public.lawyer_form_templates FOR SELECT
  USING (is_active = true);

CREATE TRIGGER update_lawyer_form_templates_updated_at
  BEFORE UPDATE ON public.lawyer_form_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Parent submissions of lawyer forms
CREATE TABLE public.lawyer_form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.lawyer_form_templates(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  signed_document_url TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lawyer_form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own submissions"
  ON public.lawyer_form_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can create own submissions"
  ON public.lawyer_form_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Parents can update own draft submissions"
  ON public.lawyer_form_submissions FOR UPDATE
  USING (auth.uid() = user_id AND status = 'draft');

CREATE POLICY "Admins can manage all submissions"
  ON public.lawyer_form_submissions FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_lawyer_form_submissions_updated_at
  BEFORE UPDATE ON public.lawyer_form_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
