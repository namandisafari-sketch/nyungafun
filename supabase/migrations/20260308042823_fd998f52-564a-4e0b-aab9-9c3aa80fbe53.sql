ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS parent_passport_photo_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS student_signature_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS parent_signature_url text DEFAULT '';