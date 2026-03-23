import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Target, Eye, Users, GraduationCap, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import nyungaLogo from "@/assets/nyunga-logo.png";

const defaultAboutPage = {
  headerTitle: "About Nyunga Foundation",
  headerSubtitle: '"Still there\'s Hope" — empowering Uganda\'s youth through education since day one.',
  mission: "To identify and sponsor academically bright but financially needy students across Uganda, from nursery to university level.",
  vision: "A Uganda where no child is denied education due to poverty — where every learner has the chance to reach their full potential.",
  values: "Transparency, compassion, and accountability guide everything we do. Every shilling is tracked and accounted for.",
  provides: ["Tuition fees", "Scholastic materials", "School uniforms", "Boarding fees", "Examination fees", "Mentorship programs"],
  closingTitle: "Still There's Hope",
  closingDesc: "Together, we can ensure that every deserving child in Uganda has access to quality education regardless of their financial background.",
};

const defaultScamWarning = {
  title: "⚠️ Fraud Warning",
  body1: 'Beware of individuals or websites falsely claiming to represent the Nyunga Foundation. We do NOT collect money online, through mobile money, or via social media.',
  body2: 'Our only official website is www.nyungafoundation.com. All our services are conducted in person at our physical office.',
  officialSite: "www.nyungafoundation.com",
};

const About = () => {
  const { data: settings } = useQuery({
    queryKey: ["public-site-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      const map: Record<string, any> = {};
      data?.forEach((s: any) => { map[s.key] = s.value; });
      return map;
    },
  });

  const pg = settings?.about_page || defaultAboutPage;
  const scam = settings?.scam_warning || defaultScamWarning;

  const mvv = [
    { icon: Target, title: "Our Mission", desc: pg.mission },
    { icon: Eye, title: "Our Vision", desc: pg.vision },
    { icon: Heart, title: "Our Values", desc: pg.values },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="relative py-20 bg-primary">
        <div className="absolute inset-0" style={{ background: "var(--hero-gradient)", opacity: 0.95 }} />
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <img src={nyungaLogo} alt="Nyunga Foundation" className="w-24 mx-auto mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">{pg.headerTitle}</h1>
          <p className="text-primary-foreground/80 text-lg">{pg.headerSubtitle}</p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {mvv.map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-lg p-8 text-center">
                <item.icon size={40} className="text-secondary mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-10">Our Impact</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: GraduationCap, value: "500+", label: "Scholarships Given" },
              { icon: Users, value: "1,200+", label: "Lives Changed" },
              { icon: Heart, value: "50+", label: "Schools Reached" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-lg p-6">
                <stat.icon size={32} className="text-secondary mx-auto mb-3" />
                <span className="font-display text-3xl font-bold text-primary block">{stat.value}</span>
                <span className="text-muted-foreground text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we cover */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-10">What We Provide</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {(pg.provides || defaultAboutPage.provides).map((item: string) => (
              <div key={item} className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
                <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scam Warning */}
      <section className="py-16 bg-destructive/10 border-y border-destructive/20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <ShieldAlert size={40} className="text-destructive mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-destructive mb-4">{scam.title}</h2>
          <p className="text-foreground leading-relaxed mb-3">{scam.body1}</p>
          <p className="text-foreground leading-relaxed">{scam.body2}</p>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">{pg.closingTitle}</h2>
          <p className="text-primary-foreground/80 max-w-md mx-auto">{pg.closingDesc}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
