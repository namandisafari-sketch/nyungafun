
CREATE TABLE public.university_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  course_name text NOT NULL,
  faculty text,
  duration text,
  qualification text DEFAULT 'Bachelor''s Degree',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.university_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active courses" ON public.university_courses
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Auth can view courses" ON public.university_courses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage courses" ON public.university_courses
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
