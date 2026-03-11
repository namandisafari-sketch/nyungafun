
-- Add missing columns found in backup data
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS reviewed_by UUID;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS school_type TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS uneb_index_number TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS institution_name TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS year_of_study TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS parent_occupation TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS parent_monthly_income TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS parent_nin TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS children_in_school INTEGER DEFAULT 0;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS current_fee_payer TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS fees_per_term NUMERIC DEFAULT 0;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS outstanding_balances NUMERIC DEFAULT 0;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS previous_bursary BOOLEAN DEFAULT false;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS household_income_range TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS proof_of_need_url TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS personal_statement TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS right_thumb_url TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS transcript_url TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS expected_graduation_year TEXT DEFAULT '';

ALTER TABLE public.parent_payments ADD COLUMN IF NOT EXISTS term TEXT DEFAULT '';
ALTER TABLE public.parent_payments ADD COLUMN IF NOT EXISTS year TEXT DEFAULT '';
ALTER TABLE public.parent_payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.access_logs ADD COLUMN IF NOT EXISTS failure_reason TEXT DEFAULT '';

ALTER TABLE public.trusted_devices ADD COLUMN IF NOT EXISTS approved_by UUID;
ALTER TABLE public.trusted_devices ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ;

ALTER TABLE public.webauthn_credentials ADD COLUMN IF NOT EXISTS counter INTEGER DEFAULT 0;
ALTER TABLE public.webauthn_credentials ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ;

ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS updated_by UUID;

ALTER TABLE public.lawyer_form_templates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.lawyer_form_submissions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE public.lawyer_form_submissions ADD COLUMN IF NOT EXISTS reviewed_by UUID;
ALTER TABLE public.lawyer_form_submissions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.lawyer_form_submissions ADD COLUMN IF NOT EXISTS filled_from_ip TEXT DEFAULT '';

ALTER TABLE public.staff_profiles ADD COLUMN IF NOT EXISTS staff_number_seq SERIAL;
