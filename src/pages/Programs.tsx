import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, BookOpen, Heart, Users, Briefcase, Shield, Star, ArrowRight, Award } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import nyungaLogo from "@/assets/nyunga-logo.png";

const iconMap: Record<string, any> = { GraduationCap, BookOpen, Heart, Users, Briefcase, Shield, Star, Award };

const fallbackPrograms = [
  { title: "Tuition Sponsorship", description: "We cover full or partial tuition fees for students from nursery to university level.", icon: "GraduationCap", highlights: ["Nursery to University", "Merit-based selection", "Term-by-term disbursement"] },
  { title: "Scholastic Materials", description: "Every term, we distribute exercise books, textbooks, and essential learning materials.", icon: "BookOpen", highlights: ["Textbooks & exercise books", "Mathematical instruments", "Stationery packs"] },
  { title: "School Uniforms & Essentials", description: "We provide school uniforms, shoes, bedding, and other essentials.", icon: "Shield", highlights: ["Uniforms & shoes", "Bedding for boarders", "Personal hygiene items"] },
  { title: "Mentorship & Guidance", description: "Beyond financial support, we provide mentorship programs.", icon: "Users", highlights: ["Academic counselling", "Career guidance", "Life skills training"] },
  { title: "Examination Support", description: "We cover examination fees for national exams (PLE, UCE, UACE).", icon: "Briefcase", highlights: ["PLE registration", "UCE & UACE fees", "Mock exam fees"] },
  { title: "Vulnerability Support", description: "Special attention for orphans, children with disabilities, and extremely disadvantaged.", icon: "Heart", highlights: ["Orphan care", "Disability support", "Psychosocial counselling"] },
];

const educationLevels = [
  { level: "Nursery", age: "3–5 years", description: "Foundation learning with play-based education and early childhood development." },
  { level: "Primary", age: "6–13 years", description: "Seven years of primary education culminating in the Primary Leaving Examinations (PLE)." },
  { level: "O-Level", age: "14–17 years", description: "Four years of ordinary level secondary education leading to the Uganda Certificate of Education (UCE)." },
  { level: "A-Level", age: "18–19 years", description: "Two years of advanced level secondary education leading to the Uganda Advanced Certificate of Education (UACE)." },
  { level: "Vocational", age: "16+ years", description: "Technical and vocational training programs offering practical skills for direct employment." },
  { level: "University", age: "18+ years", description: "Tertiary education at accredited universities for high-performing beneficiaries." },
];

const Programs = () => {
  const { data: cmsPrograms } = useQuery({
    queryKey: ["public-programs"],
    queryFn: async () => {
      const { data } = await supabase.from("cms_programs").select("*").eq("is_active", true).order("sort_order");
      return data;
    },
  });

  const programs = cmsPrograms && cmsPrograms.length > 0 ? cmsPrograms : fallbackPrograms;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Heart size={48} className="mx-auto mb-4 text-secondary" />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Programs</h1>
          <p className="text-primary-foreground/80 text-lg">Comprehensive support from nursery to university — because education is the most powerful tool for change.</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-secondary font-semibold text-sm uppercase tracking-wide mb-2">What We Offer</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">Support Programs</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program: any) => {
              const Icon = iconMap[program.icon] || GraduationCap;
              return (
                <div key={program.title} className="bg-card border border-border rounded-xl p-7 hover:shadow-lg hover:border-secondary/30 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
                    <Icon size={24} className="text-secondary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-primary mb-3">{program.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{program.description}</p>
                  <ul className="space-y-1.5">
                    {(program.highlights || []).map((h: string) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-foreground">
                        <Star size={12} className="text-secondary shrink-0" />{h}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-secondary font-semibold text-sm uppercase tracking-wide mb-2">Education Pathway</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">Levels We Support</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            <div className="space-y-6">
              {educationLevels.map((item, idx) => (
                <div key={item.level} className="flex gap-6 items-start">
                  <div className="hidden md:flex flex-col items-center shrink-0">
                    <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-display font-bold text-sm z-10">{idx + 1}</div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6 flex-1 hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-display text-lg font-bold text-primary">{item.level}</h3>
                      <span className="bg-secondary/10 text-secondary text-xs font-semibold px-2 py-0.5 rounded-full">{item.age}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-secondary font-semibold text-sm uppercase tracking-wide mb-2">The Process</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">How Students Are Selected</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Application", desc: "Parents/guardians submit a detailed application with academic records and financial information." },
              { step: "2", title: "Verification", desc: "Our team conducts home visits and school verification to confirm the applicant's circumstances." },
              { step: "3", title: "Selection", desc: "A committee reviews all applications and selects beneficiaries based on merit and need." },
              { step: "4", title: "Support", desc: "Selected students receive comprehensive support throughout their academic journey." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-xl font-bold mx-auto mb-4">{item.step}</div>
                <h3 className="font-display text-base font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <img src={nyungaLogo} alt="Nyunga Foundation" className="w-20 mx-auto mb-6 opacity-90" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Want to Learn More?</h2>
          <p className="text-primary-foreground/80 max-w-md mx-auto text-lg mb-8">Visit our office to learn about our programs and how you can support a child's education.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/schools"><button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-base px-8 py-3 rounded-md transition-colors flex items-center gap-2">View Partner Schools <ArrowRight size={16} /></button></Link>
            <Link to="/about"><button className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-base px-8 py-3 rounded-md transition-colors">About Us</button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Programs;
