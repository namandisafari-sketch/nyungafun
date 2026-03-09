
-- Delete old templates and re-insert with exact fields matching the physical documents
DELETE FROM public.lawyer_form_templates WHERE id IN ('321907e6-2f61-437b-82ff-83ffdbef2cb7', 'a6709119-b671-4189-9bc0-2fce364721ed');

-- English Version: Memorandum of Understanding
INSERT INTO public.lawyer_form_templates (id, title, description, is_active, fields) VALUES (
  '321907e6-2f61-437b-82ff-83ffdbef2cb7',
  'Memorandum of Understanding (English)',
  'THE REPUBLIC OF UGANDA - IN THE MATTER OF THE CONTRACTS ACT CAP 284 - IN THE MATTER OF A MEMORANDUM OF UNDERSTANDING',
  true,
  '[
    {"id":"agreement_day","label":"Agreement Day","type":"text","required":true,"placeholder":"e.g. 15th"},
    {"id":"agreement_month","label":"Agreement Month","type":"text","required":true,"placeholder":"e.g. January"},
    {"id":"agreement_year","label":"Agreement Year (202_)","type":"text","required":true,"placeholder":"e.g. 6"},
    {"id":"school_name","label":"School Name (First Party)","type":"text","required":true,"placeholder":"Name of the school"},
    {"id":"parent_name","label":"Parent / Guardian Full Name (Second Party)","type":"text","required":true,"placeholder":"Full name of parent"},
    {"id":"parent_of","label":"Parent of (Student Name)","type":"text","required":true,"placeholder":"Student full name"},
    {"id":"parent_phone","label":"Parent Telephone","type":"text","required":true,"placeholder":"e.g. 0700000000"},
    {"id":"parent_district","label":"Parent District of Residence","type":"text","required":true,"placeholder":"e.g. Kampala"},
    {"id":"bursary_duration","label":"Bursary Duration (years)","type":"text","required":true,"placeholder":"e.g. 4"},
    {"id":"functional_fees","label":"Functional Fees Amount (Ugx)","type":"text","required":true,"placeholder":"e.g. 150,000"},
    {"id":"medical_fees","label":"Medical Fees Amount (Ugx)","type":"text","required":false,"placeholder":"e.g. 50,000"},
    {"id":"parent_contact","label":"Parent Contact (for signature section)","type":"text","required":false,"placeholder":"Phone number"},
    {"id":"student_name_sign","label":"Student Name (for signature section)","type":"text","required":false,"placeholder":"Student full name"},
    {"id":"student_contact","label":"Student Contact","type":"text","required":false,"placeholder":"Phone number"},
    {"id":"director_name","label":"Name of Director of the School","type":"text","required":false,"placeholder":"School director name"},
    {"id":"director_contact","label":"Director Contact","type":"text","required":false,"placeholder":"Phone number"},
    {"id":"consent","label":"I/We have read, understood, and agree to all terms in this Memorandum of Understanding","type":"checkbox","required":true}
  ]'::jsonb
);

-- Luganda Version: Enteeseganya n'Okukkaanya
INSERT INTO public.lawyer_form_templates (id, title, description, is_active, fields) VALUES (
  'a6709119-b671-4189-9bc0-2fce364721ed',
  'Enteeseganya n''Okukkaanya (Luganda)',
  'Enteeseganya n''Okukkaanya Ebituukiddwako Wakati w''Essomero, Nyunga Foundation, n''Omuzadde',
  true,
  '[
    {"id":"essomero","label":"Essomero (School Name)","type":"text","required":true,"placeholder":"Erinnya ly''essomero"},
    {"id":"omuzadde_erinnya","label":"Omuzadde Erinnya (Parent Name)","type":"text","required":true,"placeholder":"Erinnya ly''omuzadde"},
    {"id":"agenda","label":"Agenda (Term)","type":"text","required":true,"placeholder":"e.g. II"},
    {"id":"omwaka","label":"Omwaka (Year)","type":"text","required":true,"placeholder":"e.g. 2026"},
    {"id":"ennaku_z_omwezi","label":"Ennaku z''Omwezi (Date)","type":"text","required":true,"placeholder":"e.g. 15th January 2026"},
    {"id":"emyaka_okusoma","label":"Emyaka gy''okusoma (Duration in years)","type":"text","required":true,"placeholder":"e.g. 4"},
    {"id":"functional_fees_lg","label":"Functional fees ez''ebyetaago by''essomero (Ugx)","type":"text","required":true,"placeholder":"e.g. 150,000"},
    {"id":"omuzadde_erinnya_sign","label":"Omuzadde Erinnya (Signature Section)","type":"text","required":false,"placeholder":"Erinnya ly''omuzadde"},
    {"id":"omuzadde_essimu","label":"Omuzadde Essimu (Phone)","type":"text","required":false,"placeholder":"Enamba y''essimu"},
    {"id":"omuyizi_erinnya","label":"Omuyizi Erinnya (Student Name)","type":"text","required":false,"placeholder":"Erinnya ly''omuyizi"},
    {"id":"ssenkulu_essomero","label":"Ssenkulu w''Essomero Erinnya (School Director)","type":"text","required":false,"placeholder":"Erinnya ly''omukulembeze"},
    {"id":"ssenkulu_essimu","label":"Ssenkulu Essimu (Director Phone)","type":"text","required":false,"placeholder":"Enamba y''essimu"},
    {"id":"okukkiriza","label":"Nze/Ffe tutegeera era tukkirizza okugoberera mu nkola byonna ebikaanyizidwako","type":"checkbox","required":true}
  ]'::jsonb
);
