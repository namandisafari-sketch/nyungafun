
-- Create scanned_documents table to store OCR-processed scanned PDFs linked to applications
CREATE TABLE public.scanned_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES public.applications(id) ON DELETE SET NULL,
  application_number text NOT NULL,
  original_filename text NOT NULL DEFAULT '',
  storage_path text NOT NULL DEFAULT '',
  ocr_confidence numeric DEFAULT 0,
  processed_by uuid DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.scanned_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage scanned documents" ON public.scanned_documents
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view scanned documents" ON public.scanned_documents
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'data_entrant') OR public.has_role(auth.uid(), 'secretary'));

-- Create storage bucket for scanned documents
INSERT INTO storage.buckets (id, name, public) VALUES ('scanned-documents', 'scanned-documents', true);

-- Storage RLS policies
CREATE POLICY "Admins can manage scanned doc files" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'scanned-documents' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'scanned-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view scanned doc files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'scanned-documents');
