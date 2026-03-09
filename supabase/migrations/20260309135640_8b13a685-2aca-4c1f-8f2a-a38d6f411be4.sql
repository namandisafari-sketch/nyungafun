
INSERT INTO public.lawyer_form_templates (title, description, is_active, fields) VALUES
(
  'Memorandum of Understanding (English)',
  'THE REPUBLIC OF UGANDA - IN THE MATTER OF THE CONTRACTS ACT CAP 284 - Agreement between School, Nyunga Foundation, and Parent/Guardian regarding bursary terms and conditions.',
  true,
  '[
    {"id": "agreement_date", "label": "Date of Agreement", "type": "date", "required": true, "placeholder": ""},
    {"id": "school_name", "label": "School Name", "type": "text", "required": true, "placeholder": "Enter school name"},
    {"id": "parent_name", "label": "Parent/Guardian Full Name", "type": "text", "required": true, "placeholder": "Full name of parent or guardian"},
    {"id": "parent_contact", "label": "Parent/Guardian Telephone", "type": "text", "required": true, "placeholder": "e.g. 0700000000"},
    {"id": "parent_residence", "label": "Parent/Guardian Residence", "type": "text", "required": true, "placeholder": "Village, Parish, Sub-county"},
    {"id": "parent_district", "label": "District", "type": "text", "required": true, "placeholder": "District of residence"},
    {"id": "student_name", "label": "Student Full Name", "type": "text", "required": true, "placeholder": "Full name of the student"},
    {"id": "bursary_duration", "label": "Duration of Bursary (years)", "type": "text", "required": true, "placeholder": "e.g. 4"},
    {"id": "functional_fees", "label": "Functional Fees per Term (UGX)", "type": "text", "required": false, "placeholder": "Amount in UGX"},
    {"id": "medical_fees", "label": "Medical Fee (UGX)", "type": "text", "required": false, "placeholder": "Amount in UGX"},
    {"id": "student_contact", "label": "Student Contact", "type": "text", "required": false, "placeholder": "Student phone number"},
    {"id": "school_director_name", "label": "Name of School Director", "type": "text", "required": false, "placeholder": "Director full name"},
    {"id": "school_director_contact", "label": "School Director Contact", "type": "text", "required": false, "placeholder": "Director phone number"},
    {"id": "consent_acknowledgement", "label": "I have read and understood all 9 sections of this agreement including: Bursaries, Duration, School Obligations, Parent & Student Obligations, Breach of Contract, End of Term Reports, Bursary Alterations, Payments, and Governing Law.", "type": "checkbox", "required": true}
  ]'::jsonb
),
(
  'Enteeseganya n''Okukkaanya (Luganda)',
  'ENTEESEGANYA N''OKUKKAANYA EBITUUKIDDWAKO WAKATI W''ESSOMERO - Endagaano wakati w''essomero, Nyunga Foundation, n''Omuzadde ku bikwata ku bbasale ez''okusoma.',
  true,
  '[
    {"id": "essomero", "label": "Erinnya ly''Essomero (School Name)", "type": "text", "required": true, "placeholder": "Wandiika erinnya ly''essomero"},
    {"id": "omuzadde_erinnya", "label": "Erinnya ly''Omuzadde (Parent Name)", "type": "text", "required": true, "placeholder": "Erinnya lyonna ly''omuzadde"},
    {"id": "omuzadde_essimu", "label": "Essimu y''Omuzadde (Parent Phone)", "type": "text", "required": true, "placeholder": "e.g. 0700000000"},
    {"id": "agenda", "label": "Agenda mu (Term)", "type": "text", "required": false, "placeholder": "e.g. Term II"},
    {"id": "omwaka", "label": "Omwaka (Year)", "type": "text", "required": true, "placeholder": "e.g. 2026"},
    {"id": "omuyizi_erinnya", "label": "Erinnya ly''Omuyizi (Student Name)", "type": "text", "required": true, "placeholder": "Erinnya lyonna ly''omuyizi"},
    {"id": "emyaka_okusoma", "label": "Omuyizi wa kusoma emyaka (Duration in years)", "type": "text", "required": true, "placeholder": "e.g. 4"},
    {"id": "functional_fees_luganda", "label": "Ebyetaago by''essomero (Functional fees) - UGX", "type": "text", "required": false, "placeholder": "Omuwendo mu UGX"},
    {"id": "omuyizi_essimu", "label": "Essimu y''Omuyizi (Student Phone)", "type": "text", "required": false, "placeholder": "Essimu y''omuyizi"},
    {"id": "ssenkulu_essomero_erinnya", "label": "Erinnya lya Ssenkulu w''essomero (School Director Name)", "type": "text", "required": false, "placeholder": "Erinnya lya Director"},
    {"id": "ssenkulu_essomero_essimu", "label": "Essimu ya Ssenkulu w''essomero (School Director Phone)", "type": "text", "required": false, "placeholder": "Essimu ya Director"},
    {"id": "okukkiriza", "label": "Nkkiriza nti nsomye era ntegedde ebiri mu kiwandiiko kino kyonna, era nzikiiriza okugoberera mu nkola byonna ebikaanyizidwako.", "type": "checkbox", "required": true}
  ]'::jsonb
);
