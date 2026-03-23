import { Link } from "react-router-dom";
import { Heart, Target, Eye, Users, GraduationCap, ShieldAlert, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import nyungaLogo from "@/assets/nyunga-logo.png";

const About = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    {/* Header */}
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <img src={nyungaLogo} alt="Nyunga Foundation" className="w-24 mx-auto mb-6" />
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About Nyunga Foundation</h1>
        <p className="text-primary-foreground/80 text-lg">"Still there's Hope" — empowering Uganda's youth through education since day one.</p>
      </div>
    </section>

    {/* Values */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: Target, title: "Our Mission", desc: "To identify and sponsor academically bright but financially needy students across Uganda, from nursery to university level." },
            { icon: Eye, title: "Our Vision", desc: "A Uganda where no child is denied education due to poverty — where every learner has the chance to reach their full potential." },
            { icon: Heart, title: "Our Values", desc: "Transparency, compassion, and accountability guide everything we do. Every shilling is tracked and accounted for." },
          ].map((item) => (
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
          {["Tuition fees", "Scholastic materials", "School uniforms", "Boarding fees", "Examination fees", "Mentorship programs"].map((item) => (
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
        <h2 className="font-display text-2xl font-bold text-destructive mb-4">⚠️ Fraud Warning</h2>
        <p className="text-foreground leading-relaxed mb-3">
          Beware of individuals or websites falsely claiming to represent the Nyunga Foundation. We do <strong>NOT</strong> collect money online, through mobile money, or via social media.
        </p>
        <p className="text-foreground leading-relaxed">
          Our only official website is <strong className="text-primary">www.nyungafoundation.com</strong>. All our services are conducted <strong className="text-primary">in person at our physical office</strong>.
        </p>
      </div>
    </section>

    {/* Closing */}
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">Still There's Hope</h2>
        <p className="text-primary-foreground/80 max-w-md mx-auto">
          Together, we can ensure that every deserving child in Uganda has access to quality education regardless of their financial background.
        </p>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
