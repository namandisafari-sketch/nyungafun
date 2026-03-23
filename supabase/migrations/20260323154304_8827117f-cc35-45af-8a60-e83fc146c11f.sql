
-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Announcement',
  slug TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  read_time TEXT DEFAULT '3 min read',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Programs table
CREATE TABLE public.cms_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'GraduationCap',
  highlights TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Site settings table for hero text, about content, contact info etc
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Public can view published posts" ON public.blog_posts
  FOR SELECT TO anon USING (is_published = true);

CREATE POLICY "Auth can view published posts" ON public.blog_posts
  FOR SELECT TO authenticated USING (is_published = true OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

CREATE POLICY "Admin and staff can manage posts" ON public.blog_posts
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

-- Programs policies
CREATE POLICY "Public can view active programs" ON public.cms_programs
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Auth can view active programs" ON public.cms_programs
  FOR SELECT TO authenticated USING (is_active = true OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

CREATE POLICY "Admin and staff can manage programs" ON public.cms_programs
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

-- Site settings policies
CREATE POLICY "Public can view site settings" ON public.site_settings
  FOR SELECT TO anon USING (true);

CREATE POLICY "Auth can view site settings" ON public.site_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin and staff can manage site settings" ON public.site_settings
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('hero', '{"title": "Still There''s Hope", "subtitle": "Nyunga Foundation", "description": "Transforming lives in Uganda through education. The Nyunga Foundation identifies and supports bright but financially disadvantaged students — because every child deserves a chance to learn."}'::jsonb),
  ('about', '{"title": "Who We Are", "content": "The Nyunga Foundation is a Ugandan non-profit organisation dedicated to breaking the cycle of poverty through education. We support students from nursery to university level, covering tuition, scholastic materials, uniforms, and more.", "content2": "Founded on the belief that \"Still there''s Hope\", we work alongside communities, schools, and families to ensure every deserving child gets access to quality education."}'::jsonb),
  ('contact', '{"phone": "+256 700 000 000", "email": "info@nyungafoundation.com", "location": "Uganda"}'::jsonb),
  ('stats', '[{"value": "500+", "label": "Scholarships Awarded"}, {"value": "1,200+", "label": "Students Supported"}, {"value": "50+", "label": "Partner Schools"}]'::jsonb);
