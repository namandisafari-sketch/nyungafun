import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, GraduationCap, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// ─── Data from PDFs ───────────────────────────────────────────────

interface Course {
  no: number;
  name: string;
  tuition: string;
  functionalFees: string;
  duration: string;
  session?: string;
  entryReq?: string;
  outcome?: string;
  bursaryLabel?: string;
}

interface Institution {
  name: string;
  bursaryType: string;
  columns: string[];
  courses: Course[];
  notes?: string[];
}

const institutions: Institution[] = [
  {
    name: "Apex International University",
    bursaryType: "FULL TUITION BURSARY",
    columns: ["S/NO", "Course", "Full Tuition Bursary/Sem", "Functional Fees/Sem", "Duration"],
    notes: [],
    courses: [
      { no: 1, name: "Bachelor of Education - Primary", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 2, name: "Bachelor of Education - Primary (Recess)", tuition: "1,200,000", functionalFees: "500,000", duration: "2 Years" },
      { no: 3, name: "Bachelor of Arts with Education", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 4, name: "Bachelor of Arts with Education (Recess)", tuition: "1,200,000", functionalFees: "500,000", duration: "2 Years" },
      { no: 5, name: "Bachelor of Science with Education", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 6, name: "Bachelor of Education Pre-primary", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 7, name: "Bachelor of Education Pre-primary (Recess)", tuition: "1,200,000", functionalFees: "500,000", duration: "3 Years" },
      { no: 8, name: "Bachelor of Business Administration", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 9, name: "Bachelor of Information Technology", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 10, name: "Bachelor of Social Works & Social Administration", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 11, name: "Bachelor of Records & Information Management", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 12, name: "Bachelor of Procurement & Logistics", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 13, name: "Bachelor of Record Management", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 14, name: "Bachelor of Hospitality & Tourism Management", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 15, name: "Bachelor of Administration Science", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 16, name: "Bachelor of Business Studies with Education", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 17, name: "Bachelor of Management Science", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 18, name: "Bachelor of Adult & Community Education", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 19, name: "Bachelor of Computer Science", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 20, name: "Bachelor of Guidance & Counselling", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 21, name: "Bachelor of Social Works & Community Development", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 22, name: "Bachelor of ICT Software Engineering", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 23, name: "Bachelor of Public Administration", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 24, name: "Bachelor of Mass Communication", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 25, name: "Bachelor of Information System", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 26, name: "Bachelor of Business Studies", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 27, name: "Bachelor of Education in Vocational Studies", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 28, name: "BBA (Finance & Accounting)", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 29, name: "BBA (Human Resource Management)", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 30, name: "BBA (International Relations)", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 31, name: "Bachelor of Occupational Health & Safety", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 32, name: "Bachelor of Public Health & Community Management", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 33, name: "Bachelor of Arts with Education", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 34, name: "Bachelor of IT (Artificial Intelligence)", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 35, name: "Bachelor of IT (Cyber Security)", tuition: "1,200,000", functionalFees: "600,000", duration: "3 Years" },
      { no: 36, name: "Diploma in Records & Information Management", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 37, name: "Diploma in Pre-primary Education", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 38, name: "Diploma in Education Primary", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 39, name: "Diploma in Education Primary (Recess)", tuition: "480,000", functionalFees: "300,000", duration: "2 Years" },
      { no: 40, name: "Diploma in Education Secondary", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 41, name: "Diploma in Business Administration", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 42, name: "Diploma in Information Technology", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 43, name: "Diploma in Library & Information Science", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 44, name: "Diploma in Procurement & Logistics", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 45, name: "Diploma in Record Management", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 46, name: "Diploma in Hospitality & Tourism Management", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 47, name: "Diploma in Administration Science", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 48, name: "Diploma in Business Studies with Education", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 49, name: "Diploma in Management Science", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 50, name: "Diploma in Adult & Community Education", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 51, name: "Diploma in Computer Science", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 52, name: "Diploma in Guidance & Counselling", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 53, name: "Diploma in Social Works & Community Development", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 54, name: "Diploma in ICT Software Engineering", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 55, name: "Diploma in Public Administration", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 56, name: "Diploma in Mass Communication", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 57, name: "Diploma in Information System", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 58, name: "Diploma in Business Studies", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 59, name: "Diploma in Education in Vocational Studies", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 60, name: "Diploma in Science in Accounting & Finance", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 61, name: "Diploma in Procurement & Logistics", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 62, name: "Diploma in Public Health", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 63, name: "Diploma in Pre-primary Education (Recess)", tuition: "480,000", functionalFees: "300,000", duration: "2 Years" },
      { no: 64, name: "Certificate in Business Administration", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 65, name: "Certificate in IT", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 66, name: "Certificate in Computer Applications", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 67, name: "Certificate in Public Health", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 68, name: "Certificate in Guidance & Counselling", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 69, name: "Certificate in Records Management", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 70, name: "Certificate in Occupational Health & Safety", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 71, name: "Certificate in Early Childhood Care & Education", tuition: "480,000", functionalFees: "350,000", duration: "2 Years" },
      { no: 72, name: "Certificate in Child Care", tuition: "480,000", functionalFees: "350,000", duration: "1 Year" },
      { no: 73, name: "Cyber Security Fundamentals (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
      { no: 74, name: "AI Basics (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
      { no: 75, name: "Digital Marketing Basics (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
      { no: 76, name: "Graphics Designing (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
      { no: 77, name: "Web Design & Development (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
      { no: 78, name: "Data Analysis With Excel (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
      { no: 79, name: "Entrepreneurship Business Setup (Short Course)", tuition: "N/A", functionalFees: "300,000", duration: "2 Weeks" },
    ],
  },
  {
    name: "St. Lawrence University",
    bursaryType: "FULL BURSARY",
    columns: ["S/NO", "Course", "Session", "Tuition", "Functional Fees", "Duration"],
    notes: [],
    courses: [
      { no: 1, name: "Masters of Business Administration & Management (MBA)", tuition: "1,650,000", functionalFees: "889,000", duration: "2 Years", session: "W" },
      { no: 2, name: "Bachelor of Procurement & Supply Chain Management", tuition: "1,160,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 3, name: "Bachelor of Business Administration", tuition: "1,160,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 4, name: "Diploma in Business Administration", tuition: "710,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
      { no: 5, name: "National Certificate in Business Administration", tuition: "600,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
      { no: 6, name: "Bachelor of Human Resource Management", tuition: "1,060,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 7, name: "Bachelor of Tourism & Hospitality Management", tuition: "1,050,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 8, name: "Bachelor of Economics", tuition: "1,050,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 9, name: "Bachelor of Statistics", tuition: "1,100,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 10, name: "Diploma in Tourism & Hospitality Management", tuition: "720,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
      { no: 11, name: "Masters of Education Administration & Management", tuition: "1,650,000", functionalFees: "540,000", duration: "2 Years", session: "W" },
      { no: 12, name: "Postgraduate Diploma in Education", tuition: "1,250,000", functionalFees: "540,000", duration: "1 Year", session: "W" },
      { no: 13, name: "Postgraduate Diploma in Educational Leadership & Management", tuition: "1,250,000", functionalFees: "540,000", duration: "1 Year", session: "W" },
      { no: 14, name: "Bachelor of Education (Secondary) Arts", tuition: "830,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 15, name: "Higher Education Access Certificate", tuition: "750,000", functionalFees: "540,000", duration: "1 Year", session: "D/E/W" },
      { no: 16, name: "Certificate in English Language Proficiency", tuition: "750,000", functionalFees: "540,000", duration: "3 Months", session: "D/E/W" },
      { no: 17, name: "Certificate in Uganda Sign Language & Communication", tuition: "750,000", functionalFees: "540,000", duration: "6 Months", session: "D/E/W" },
      { no: 18, name: "Bachelor of Education - Primary In-Service", tuition: "400,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
      { no: 19, name: "Bachelor of Education - Secondary In-Service", tuition: "400,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
      { no: 20, name: "Diploma in Education - Primary", tuition: "350,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
      { no: 21, name: "Bachelor of Information Technology", tuition: "1,160,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 22, name: "Bachelor of Records & Information Management", tuition: "1,000,000", functionalFees: "540,000", duration: "3 Years", session: "D/E" },
      { no: 23, name: "Bachelor of Science in Telecommunications Engineering", tuition: "1,260,000", functionalFees: "540,000", duration: "4 Years", session: "D/E" },
      { no: 24, name: "Bachelor of Science in Computer Engineering", tuition: "1,260,000", functionalFees: "540,000", duration: "4 Years", session: "D/E/W" },
      { no: 25, name: "Bachelor of Science in Computer Science", tuition: "1,210,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 26, name: "Diploma in Information Technology", tuition: "910,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
      { no: 27, name: "National Certificate in Communication & IT", tuition: "600,000", functionalFees: "540,000", duration: "2 Years", session: "D/E" },
      { no: 28, name: "Bachelor of Science in Public Health", tuition: "1,150,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 29, name: "Bachelor of Medical Records & Health Informatics", tuition: "1,150,000", functionalFees: "540,000", duration: "4 Years", session: "D/E/W" },
      { no: 30, name: "Diploma in Medical Records & Health Informatics", tuition: "720,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
      { no: 31, name: "Diploma of Science in Public Health", tuition: "780,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
      { no: 32, name: "Bachelor of Industrial Art & Design", tuition: "930,000", functionalFees: "540,000", duration: "3 Years", session: "D/E" },
      { no: 33, name: "National Diploma in Interior & Landscape Design", tuition: "650,000", functionalFees: "540,000", duration: "2 Years", session: "D/E" },
      { no: 34, name: "National Diploma in Fashion & Design", tuition: "650,000", functionalFees: "540,000", duration: "2 Years", session: "D/E" },
      { no: 35, name: "National Certificate in Fashion & Design", tuition: "650,000", functionalFees: "540,000", duration: "2 Years", session: "D/E" },
      { no: 36, name: "Bachelor of Public Administration & Management", tuition: "1,030,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 37, name: "Bachelor of Diplomacy & International Relations", tuition: "1,080,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 38, name: "Bachelor of Development Studies", tuition: "950,000", functionalFees: "540,000", duration: "3 Years", session: "D" },
      { no: 39, name: "Diploma in Public Administration & Management", tuition: "720,000", functionalFees: "540,000", duration: "2 Years", session: "D" },
      { no: 40, name: "Bachelor of Mass Communication & Journalism", tuition: "1,080,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 41, name: "Bachelor of Social Work & Social Administration", tuition: "1,080,000", functionalFees: "540,000", duration: "3 Years", session: "D/E/W" },
      { no: 42, name: "Diploma in Mass Communication & Journalism", tuition: "720,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
      { no: 43, name: "Diploma in Social Work & Social Administration", tuition: "780,000", functionalFees: "540,000", duration: "2 Years", session: "D/E/W" },
    ],
  },
  {
    name: "Kampala School of Health Sciences",
    bursaryType: "PARTIAL TUITION BURSARY",
    columns: ["S/N", "Course", "Duration", "Tuition/Sem", "Partial Bursary"],
    notes: ["Functional fees not indicated on this list.", "We thank Kampala School of Health Sciences for offering these bursaries through Nyunga Foundation."],
    courses: [
      { no: 1, name: "Certificate in Enrolled Nursing", tuition: "1,100,000", functionalFees: "800,000", duration: "2½ Years" },
      { no: 2, name: "Certificate in Enrolled Midwifery", tuition: "1,100,000", functionalFees: "800,000", duration: "2½ Years" },
      { no: 3, name: "Certificate in Pharmacy", tuition: "800,000", functionalFees: "600,000", duration: "2 Years" },
      { no: 4, name: "Certificate in Medical Laboratory Techniques", tuition: "800,000", functionalFees: "600,000", duration: "2 Years" },
      { no: 5, name: "Certificate in Public Health", tuition: "500,000", functionalFees: "300,000", duration: "2 Years" },
      { no: 6, name: "Certificate in Medical Records & Health Informatics", tuition: "500,000", functionalFees: "300,000", duration: "2 Years" },
      { no: 7, name: "Certificate in Food Science & Nutrition", tuition: "500,000", functionalFees: "300,000", duration: "2 Years" },
      { no: 8, name: "Certificate in Biomedical Engineering", tuition: "800,000", functionalFees: "600,000", duration: "2 Years" },
      { no: 9, name: "Certificate in Secretarial Studies & Office Management", tuition: "500,000", functionalFees: "300,000", duration: "2 Years" },
      { no: 10, name: "Certificate in Guidance & Counselling", tuition: "600,000", functionalFees: "400,000", duration: "2 Years" },
      { no: 11, name: "Certificate in Records & Information Management", tuition: "500,000", functionalFees: "300,000", duration: "2 Years" },
      { no: 12, name: "Bridging Programme", tuition: "1,200,000", functionalFees: "900,000", duration: "9 Months" },
      { no: 13, name: "Diploma in Clinical Medicine & Community Health", tuition: "1,000,000", functionalFees: "700,000", duration: "3 Years" },
      { no: 14, name: "Diploma in Pharmacy", tuition: "1,000,000", functionalFees: "700,000", duration: "3 Years" },
      { no: 15, name: "Diploma in Diagnostic Sonography", tuition: "1,000,000", functionalFees: "700,000", duration: "3 Years" },
      { no: 16, name: "Diploma in Biomedical Engineering", tuition: "1,000,000", functionalFees: "700,000", duration: "2 Years" },
      { no: 17, name: "Diploma in Secretarial Studies & Office Management", tuition: "600,000", functionalFees: "400,000", duration: "2 Years" },
      { no: 18, name: "Diploma in Medical Records & Health Informatics", tuition: "500,000", functionalFees: "300,000", duration: "3 Years" },
      { no: 19, name: "Diploma in Public Health", tuition: "600,000", functionalFees: "400,000", duration: "2 Years" },
      { no: 20, name: "Diploma in Records & Information Management", tuition: "600,000", functionalFees: "400,000", duration: "2 Years" },
      { no: 21, name: "Diploma in Health Counselling & Guidance", tuition: "600,000", functionalFees: "400,000", duration: "2 Years" },
      { no: 22, name: "Diploma in Food Science & Nutrition", tuition: "600,000", functionalFees: "400,000", duration: "2 Years" },
    ],
  },
  {
    name: "Buloba College of Health Sciences",
    bursaryType: "FULL BURSARY",
    columns: ["Course", "Duration", "Tuition (Without Bursary)", "With Full Bursary"],
    notes: [
      "Functional fees: UGX 320,000/semester",
      "Accommodation & meals: UGX 750,000/semester",
      "National examination fees: UGX 300,000/semester",
      "Hospital Attachment: UGX 550,000/semester",
      "One-time payments: School ID (20,000), Guild & sports (50,000), Medical uniform (200,000)",
    ],
    courses: [
      { no: 1, name: "Certificate in Pharmacy", tuition: "800,000", functionalFees: "0 (Full Bursary)", duration: "2 Years" },
      { no: 2, name: "Certificate in Medical Laboratory", tuition: "800,000", functionalFees: "0 (Full Bursary)", duration: "2 Years" },
      { no: 3, name: "Diploma in Clinical Medicine", tuition: "800,000", functionalFees: "0 (Full Bursary)", duration: "3 Years" },
    ],
  },
];

const Courses = () => {
  const [search, setSearch] = useState("");

  const filteredInstitutions = institutions.map((inst) => ({
    ...inst,
    courses: search.trim()
      ? inst.courses.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      : inst.courses,
  })).filter((inst) => inst.courses.length > 0);

  const totalCourses = institutions.reduce((acc, inst) => acc + inst.courses.length, 0);

  return (
    <>
      <Helmet>
        <title>Courses & Bursaries 2026 | Nyunga Foundation</title>
        <meta name="description" content="Browse full and partial tuition bursary courses available at Nyunga Foundation partner institutions in Uganda for 2026. Apex, St. Lawrence, Kampala School of Health Sciences & more." />
        <link rel="canonical" href="https://www.nyungafoundation.com/courses" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background">
        {/* Header matching PDF style */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-12 md:py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm uppercase tracking-widest text-primary-foreground/70 mb-2">Nyunga Foundation — "Still there's Hope"</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Courses Available on Bursaries 2026
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-2">
              Browse all courses at our partner institutions. Full and partial tuition bursaries available.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary-foreground/70 mt-4">
              <Phone className="w-4 h-4" />
              <span>Direct call 0746 960 654 / WhatsApp 0772 956 500</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Badge variant="secondary" className="text-sm px-4 py-1">{institutions.length} Partner Institutions</Badge>
              <Badge variant="secondary" className="text-sm px-4 py-1">{totalCourses} Courses Available</Badge>
            </div>
          </div>
        </section>

        {/* Search bar */}
        <div className="container mx-auto px-4 -mt-5 relative z-10">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search courses by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 text-base bg-card border-border shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Institution tables */}
        <section className="container mx-auto px-4 py-10 space-y-12">
          {filteredInstitutions.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p className="text-lg">No courses match your search.</p>
            </div>
          )}

          {filteredInstitutions.map((inst) => (
            <div key={inst.name} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              {/* Institution header — matches PDF branding */}
              <div className="bg-primary text-primary-foreground px-4 md:px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-display font-bold">{inst.name}</h2>
                      <p className="text-xs text-primary-foreground/70 uppercase tracking-wider">{inst.bursaryType} COURSES 2026</p>
                    </div>
                  </div>
                  <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 self-start sm:self-auto">
                    {inst.courses.length} course{inst.courses.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>

              {/* Table — mimics PDF table layout */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border">
                      <th className="text-left px-3 md:px-4 py-3 font-semibold text-foreground w-12">S/NO</th>
                      <th className="text-left px-3 md:px-4 py-3 font-semibold text-foreground">Course</th>
                      {inst.courses[0]?.session !== undefined && (
                        <th className="text-center px-3 md:px-4 py-3 font-semibold text-foreground w-20">Session</th>
                      )}
                      <th className="text-right px-3 md:px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                        {inst.bursaryType === "PARTIAL TUITION BURSARY" ? "Tuition/Sem" : "Tuition Bursary"}
                      </th>
                      <th className="text-right px-3 md:px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                        {inst.bursaryType === "PARTIAL TUITION BURSARY" ? "Partial Bursary" : "Functional Fees"}
                      </th>
                      <th className="text-center px-3 md:px-4 py-3 font-semibold text-foreground w-24">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inst.courses.map((course, idx) => (
                      <tr
                        key={course.no}
                        className={`border-b border-border/50 transition-colors hover:bg-muted/30 ${idx % 2 === 0 ? "bg-background" : "bg-muted/10"}`}
                      >
                        <td className="px-3 md:px-4 py-2.5 text-muted-foreground text-center">{course.no}</td>
                        <td className="px-3 md:px-4 py-2.5 font-medium text-foreground">{course.name}</td>
                        {course.session !== undefined && (
                          <td className="px-3 md:px-4 py-2.5 text-center">
                            <Badge variant="outline" className="text-xs">{course.session}</Badge>
                          </td>
                        )}
                        <td className="px-3 md:px-4 py-2.5 text-right font-mono text-foreground whitespace-nowrap">
                          {course.tuition !== "N/A" ? `UGX ${course.tuition}` : "—"}
                        </td>
                        <td className="px-3 md:px-4 py-2.5 text-right font-mono text-secondary whitespace-nowrap font-semibold">
                          UGX {course.functionalFees}
                        </td>
                        <td className="px-3 md:px-4 py-2.5 text-center text-muted-foreground">{course.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes */}
              {inst.notes && inst.notes.length > 0 && (
                <div className="px-4 md:px-6 py-3 bg-muted/30 border-t border-border">
                  {inst.notes.map((note, i) => (
                    <p key={i} className="text-xs text-muted-foreground">• {note}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Footer note matching PDF */}
        <section className="container mx-auto px-4 pb-10">
          <p className="text-center text-xs text-muted-foreground">
            © 2026 Nyunga Foundation. All rights reserved. | This information is for official use. Contact us for the latest updates.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Courses;
