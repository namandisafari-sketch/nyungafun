
ALTER TABLE public.university_courses
  ADD COLUMN IF NOT EXISTS tuition text,
  ADD COLUMN IF NOT EXISTS functional_fees text,
  ADD COLUMN IF NOT EXISTS session text,
  ADD COLUMN IF NOT EXISTS bursary_type text DEFAULT 'full',
  ADD COLUMN IF NOT EXISTS notes text;
