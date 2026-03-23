import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Insert schools
  const schools = [
    { name: "Apex International University", level: "university", district: "Kampala", total_bursaries: 100, full_fees: 0, nyunga_covered_fees: 0 },
    { name: "St. Lawrence University", level: "university", district: "Kampala", total_bursaries: 100, full_fees: 0, nyunga_covered_fees: 0 },
    { name: "Kampala School of Health Sciences", level: "tertiary", district: "Kampala", total_bursaries: 50, full_fees: 0, nyunga_covered_fees: 0 },
    { name: "Buloba College of Health Sciences", level: "tertiary", district: "Wakiso", total_bursaries: 30, full_fees: 0, nyunga_covered_fees: 0 },
  ];

  const { data: insertedSchools, error: schoolErr } = await supabase
    .from("schools")
    .insert(schools)
    .select("id, name");

  if (schoolErr) return new Response(JSON.stringify({ error: schoolErr.message }), { status: 500, headers: corsHeaders });

  // Get school IDs
  const { data: allSchools } = await supabase.from("schools").select("id, name").in("name", schools.map(s => s.name));
  const schoolMap: Record<string, string> = {};
  for (const s of allSchools || []) schoolMap[s.name] = s.id;

  // Build courses
  const courses: any[] = [];
  let order = 0;

  const addCourses = (schoolName: string, bursaryType: string, items: any[]) => {
    for (const c of items) {
      courses.push({
        school_id: schoolMap[schoolName],
        course_name: c.name,
        tuition: c.tuition,
        functional_fees: c.functionalFees,
        duration: c.duration,
        session: c.session || null,
        bursary_type: bursaryType,
        qualification: c.qualification || null,
        sort_order: order++,
        is_active: true,
      });
    }
  };

  // Apex
  addCourses("Apex International University", "full", [
    { name: "Bachelor of Education - Primary", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Education - Primary (Recess)", tuition: "1,200,000", functionalFees: "500,000", duration: "2 Years" },
    { name: "Bachelor of Arts with Education", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Arts with Education (Recess)", tuition: "1,200,000", functionalFees: "500,000", duration: "2 Years" },
    { name: "Bachelor of Science with Education", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Education Pre-primary", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Education Pre-primary (Recess)", tuition: "1,200,000", functionalFees: "500,000", duration: "3 Years" },
    { name: "Bachelor of Business Administration", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Information Technology", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Social Works & Social Administration", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Records & Information Management", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Procurement & Logistics", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Record Management", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Hospitality & Tourism Management", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Administration Science", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Business Studies with Education", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Management Science", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Adult & Community Education", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Computer Science", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Guidance & Counselling", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Social Works & Community Development", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of ICT Software Engineering", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Public Administration", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Mass Communication", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Information System", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Business Studies", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Education in Vocational Studies", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "BBA (Finance & Accounting)", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "BBA (Human Resource Management)", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "BBA (International Relations)", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Occupational Health & Safety", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of Public Health & Community Management", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of IT (Artificial Intelligence)", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Bachelor of IT (Cyber Security)", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
    { name: "Diploma in Records & Information Management", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Pre-primary Education", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Education Primary", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Education Primary (Recess)", tuition: "480,000", functionalFees: "300,000", duration: "2 Years" },
    { name: "Diploma in Education Secondary", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Business Administration", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Information Technology", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Library & Information Science", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Procurement & Logistics", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Record Management", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Hospitality & Tourism Management", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Administration Science", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Business Studies with Education", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Management Science", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Adult & Community Education", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Computer Science", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Guidance & Counselling", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Social Works & Community Development", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in ICT Software Engineering", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Public Administration", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Mass Communication", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Information System", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Business Studies", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Education in Vocational Studies", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Science in Accounting & Finance", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Public Health", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Diploma in Pre-primary Education (Recess)", tuition: "480,000", functionalFees: "300,000", duration: "2 Years" },
    { name: "Certificate in Business Administration", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Certificate in IT", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Certificate in Computer Applications", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Certificate in Public Health", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Certificate in Guidance & Counselling", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Certificate in Records Management", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Certificate in Occupational Health & Safety", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Certificate in Early Childhood Care & Education", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
    { name: "Certificate in Child Care", tuition: "480,000", functionalFees: "350,000", duration: "1 Year" },
    { name: "Cyber Security Fundamentals (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
    { name: "AI Basics (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
    { name: "Digital Marketing Basics (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
    { name: "Graphics Designing (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
    { name: "Web Design & Development (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
    { name: "Data Analysis With Excel (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
    { name: "Entrepreneurship Business Setup (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
  ]);

  // St. Lawrence
  addCourses("St. Lawrence University", "full", [
    { name: "Masters of Business Administration & Management (MBA)", tuition: "1,650,000", functionalFees: "889,000", duration: "2 Years", session: "W" },
    { name: "Bachelor of Procurement & Supply Chain Management", tuition: "1,160,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Bachelor of Business Administration", tuition: "1,160,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Diploma in Business Administration", tuition: "710,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
    { name: "National Certificate in Business Administration", tuition: "600,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
    { name: "Bachelor of Human Resource Management", tuition: "1,060,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Bachelor of Tourism & Hospitality Management", tuition: "1,050,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Bachelor of Economics", tuition: "1,050,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Bachelor of Statistics", tuition: "1,100,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Diploma in Tourism & Hospitality Management", tuition: "720,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
    { name: "Masters of Education Administration & Management", tuition: "1,650,000", functionalFees: "540,000", duration: "2 Years", session: "W" },
    { name: "Postgraduate Diploma in Education", tuition: "1,250,000", functionalFees: "540,000", duration: "1 Year", session: "W" },
    { name: "Postgraduate Diploma in Educational Leadership & Management", tuition: "1,250,000", functionalFees: "540,000", duration: "1 Year", session: "W" },
    { name: "Bachelor of Education (Secondary) Arts", tuition: "830,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Higher Education Access Certificate", tuition: "750,000", functionalFees: "540,000", duration: "1 Year", session: "D/E/W" },
    { name: "Certificate in English Language Proficiency", tuition: "750,000", functionalFees: "540,000", duration: "3 Months", session: "D/E/W" },
    { name: "Certificate in Uganda Sign Language & Communication", tuition: "750,000", functionalFees: "540,000", duration: "6 Months", session: "D/E/W" },
    { name: "Bachelor of Education - Primary In-Service", tuition: "400,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
    { name: "Bachelor of Education - Secondary In-Service", tuition: "400,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
    { name: "Diploma in Education - Primary", tuition: "350,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
    { name: "Bachelor of Information Technology", tuition: "1,160,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Bachelor of Records & Information Management", tuition: "1,000,000", functionalFees: "540,000", duration: "3 Years", session: "D/E" },
    { name: "Bachelor of Science in Telecommunications Engineering", tuition: "1,260,000", functionalFees: "540,000", duration: "4 Years", session: "D/E" },
    { name: "Bachelor of Science in Computer Engineering", tuition: "1,260,000", functionalFees: "540,000", duration: "4 Years", session: "D/E/W" },
    { name: "Bachelor of Science in Computer Science", tuition: "1,210,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Diploma in Information Technology", tuition: "910,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
    { name: "National Certificate in Communication & IT", tuition: "600,000", functionalFees: "540,000", duration: "2 Years", session: "D/E" },
    { name: "Bachelor of Science in Public Health", tuition: "1,150,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Bachelor of Medical Records & Health Informatics", tuition: "1,150,000", functionalFees: "540,000", duration: "4 Years", session: "D/E/W" },
    { name: "Diploma in Medical Records & Health Informatics", tuition: "720,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
    { name: "Diploma of Science in Public Health", tuition: "780,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
    { name: "Bachelor of Industrial Art & Design", tuition: "930,000", functionalFees: "540,000", duration: "3 Years", session: "D/E" },
    { name: "National Diploma in Interior & Landscape Design", tuition: "650,000", functionalFees: "540,000", duration: "2 Years", session: "D/E" },
    { name: "National Diploma in Fashion & Design", tuition: "650,000", functionalFees: "540,000", duration: "2 Years", session: "D/E" },
    { name: "National Certificate in Fashion & Design", tuition: "650,000", functionalFees: "540,000", duration: "2 Years", session: "D/E" },
    { name: "Bachelor of Public Administration & Management", tuition: "1,030,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Bachelor of Diplomacy & International Relations", tuition: "1,080,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Bachelor of Development Studies", tuition: "950,000", functionalFees: "540,000", duration: "3 Years", session: "D" },
    { name: "Diploma in Public Administration & Management", tuition: "720,000", functionalFees: "540,000", duration: "2 Years", session: "D" },
    { name: "Bachelor of Mass Communication & Journalism", tuition: "1,080,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Bachelor of Social Work & Social Administration", tuition: "1,080,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
    { name: "Diploma in Mass Communication & Journalism", tuition: "720,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
    { name: "Diploma in Social Work & Social Administration", tuition: "780,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
  ]);

  // Kampala School of Health Sciences
  addCourses("Kampala School of Health Sciences", "partial", [
    { name: "Certificate in Enrolled Nursing", tuition: "1,100,000", functionalFees: "800,000", duration: "2½ Years" },
    { name: "Certificate in Enrolled Midwifery", tuition: "1,100,000", functionalFees: "800,000", duration: "2½ Years" },
    { name: "Certificate in Pharmacy", tuition: "800,000", functionalFees: "600,000", duration: "2 Years" },
    { name: "Certificate in Medical Laboratory Techniques", tuition: "800,000", functionalFees: "600,000", duration: "2 Years" },
    { name: "Certificate in Public Health", tuition: "500,000", functionalFees: "300,000", duration: "2 Years" },
    { name: "Certificate in Medical Records & Health Informatics", tuition: "500,000", functionalFees: "300,000", duration: "2 Years" },
    { name: "Certificate in Food Science & Nutrition", tuition: "500,000", functionalFees: "300,000", duration: "2 Years" },
    { name: "Certificate in Biomedical Engineering", tuition: "800,000", functionalFees: "600,000", duration: "2 Years" },
    { name: "Certificate in Secretarial Studies & Office Management", tuition: "500,000", functionalFees: "300,000", duration: "2 Years" },
    { name: "Certificate in Guidance & Counselling", tuition: "600,000", functionalFees: "400,000", duration: "2 Years" },
    { name: "Certificate in Records & Information Management", tuition: "500,000", functionalFees: "300,000", duration: "2 Years" },
    { name: "Bridging Programme", tuition: "1,200,000", functionalFees: "900,000", duration: "9 Months" },
    { name: "Diploma in Clinical Medicine & Community Health", tuition: "1,000,000", functionalFees: "700,000", duration: "3 Years" },
    { name: "Diploma in Pharmacy", tuition: "1,000,000", functionalFees: "700,000", duration: "3 Years" },
    { name: "Diploma in Diagnostic Sonography", tuition: "1,000,000", functionalFees: "700,000", duration: "3 Years" },
    { name: "Diploma in Biomedical Engineering", tuition: "1,000,000", functionalFees: "700,000", duration: "2 Years" },
    { name: "Diploma in Secretarial Studies & Office Management", tuition: "600,000", functionalFees: "400,000", duration: "2 Years" },
    { name: "Diploma in Medical Records & Health Informatics", tuition: "500,000", functionalFees: "300,000", duration: "3 Years" },
    { name: "Diploma in Public Health", tuition: "600,000", functionalFees: "400,000", duration: "2 Years" },
    { name: "Diploma in Records & Information Management", tuition: "600,000", functionalFees: "400,000", duration: "2 Years" },
    { name: "Diploma in Health Counselling & Guidance", tuition: "600,000", functionalFees: "400,000", duration: "2 Years" },
    { name: "Diploma in Food Science & Nutrition", tuition: "600,000", functionalFees: "400,000", duration: "2 Years" },
  ]);

  // Buloba
  addCourses("Buloba College of Health Sciences", "full", [
    { name: "Certificate in Pharmacy", tuition: "800,000", functionalFees: "0", duration: "2 Years" },
    { name: "Certificate in Medical Laboratory", tuition: "800,000", functionalFees: "0", duration: "2 Years" },
    { name: "Diploma in Clinical Medicine", tuition: "800,000", functionalFees: "0", duration: "3 Years" },
  ]);

  // Insert in batches
  const batchSize = 50;
  let inserted = 0;
  for (let i = 0; i < courses.length; i += batchSize) {
    const batch = courses.slice(i, i + batchSize);
    const { error } = await supabase.from("university_courses").insert(batch);
    if (error) return new Response(JSON.stringify({ error: error.message, batch: i }), { status: 500, headers: corsHeaders });
    inserted += batch.length;
  }

  return new Response(JSON.stringify({ success: true, schools: allSchools?.length, courses: inserted }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
