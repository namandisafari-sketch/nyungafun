
-- Create storage policies for scanned-documents bucket
-- Allow authenticated users with admin role to upload/read/delete

CREATE POLICY "Admin users can upload scanned documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'scanned-documents'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admin users can update scanned documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'scanned-documents'
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'scanned-documents'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admin users can read scanned documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'scanned-documents'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admin users can delete scanned documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'scanned-documents'
  AND public.has_role(auth.uid(), 'admin')
);
