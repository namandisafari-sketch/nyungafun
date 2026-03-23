import { Link } from "react-router-dom";
import { GraduationCap, Users, BookOpen, Heart, MapPin, Phone, Mail, AlertTriangle, Newspaper, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import nyungaLogo from "@/assets/nyunga-logo.png";

const stats = [
  { icon: GraduationCap, value: "500+", label: "Scholarships Awarded" },
  { icon: Users, value: "1,200+", label: "Students Supported" },
  { icon: BookOpen, value: "50+", label: "Partner Schools" },
];

const newsItems = [
  {
    date: "March 2026",
    title: "Nyunga Foundation Launches Official Website",
    summary: "We are excited to announce the launch of our official website at www.nyungafoundation.com — the only authentic online presence of the Foundation.",
  },
  {
    date: "February 2026",
    title: "Term 1 Support Distribution Completed",
    summary: "Over 300 students across 40+ partner schools received scholastic materials and tuition support for Term 1, 2026.",
  },
  {
    date: "January 2026",
    title: "New Partner Schools Onboarded",
    summary: "Nyunga Foundation has expanded its network by partnering with 12 additional schools across central and eastern Uganda.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0" style={{ background: "var(--hero-gradient)", opacity: 0.95 }} />
        <div className="relative container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 animate-fade-in-up">
              <p className="text-secondary font-semibold tracking-wide uppercase text-sm mb-4">Nyunga Foundation</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
                Still There's <span className="text-secondary">Hope</span>
              </h1>
              <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                Transforming lives in Uganda through education. The Nyunga Foundation identifies and supports bright but financially disadvantaged students — because every child deserves a chance to learn.
              </p>
              <Link to="/about">
                <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-base px-8 py-3 rounded-md transition-colors">
                  Learn About Us
                </button>
              </Link>
            </div>
            <div className="flex-shrink-0">
              <img src={nyungaLogo} alt="Nyunga Foundation Logo" className="w-48 md:w-72 lg:w-80 drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center p-8 rounded-lg bg-muted/50">
                <stat.icon size={40} className="text-secondary mb-4" />
                <span className="font-display text-4xl font-bold text-primary">{stat.value}</span>
                <span className="text-muted-foreground mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Mission */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-6">Who We Are</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            The Nyunga Foundation is a Ugandan non-profit organisation dedicated to breaking the cycle of poverty through education. We support students from nursery to university level, covering tuition, scholastic materials, uniforms, and more.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Founded on the belief that <strong className="text-primary">"Still there's Hope"</strong>, we work alongside communities, schools, and families to ensure every deserving child gets access to quality education.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary text-center mb-10">What We Do</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Tuition fee support",
              "Scholastic materials",
              "School uniforms",
              "Boarding fees",
              "Examination fees",
              "Mentorship programs",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-card border border-border rounded-lg p-5">
                <Heart size={18} className="text-secondary shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Newspaper size={28} className="text-secondary" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">Latest News</h2>
          </div>
          <div className="space-y-6">
            {newsItems.map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-lg p-6">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wide">{item.date}</span>
                <h3 className="font-display text-lg font-bold text-primary mt-1 mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scam Warning */}
      <section className="py-16 bg-destructive/10 border-y border-destructive/20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
              <ShieldAlert size={32} className="text-destructive" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-destructive mb-4">
              ⚠️ Beware of Scammers
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              The Nyunga Foundation does <strong>NOT</strong> operate through any other websites, social media accounts, or agents online. We do <strong>NOT</strong> ask for money through mobile money, WhatsApp, or any online platform.
            </p>
            <p className="text-foreground leading-relaxed mb-4">
              If anyone contacts you claiming to represent Nyunga Foundation and asks for payment or personal information online, <strong>they are scammers</strong>. Please do not engage with them.
            </p>
            <div className="bg-card border border-border rounded-lg p-5 mt-4 w-full max-w-md">
              <p className="text-sm font-semibold text-primary mb-2">Our only official channels:</p>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-secondary shrink-0" /> Website: <strong className="text-primary">www.nyungafoundation.com</strong></li>
                <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-secondary shrink-0" /> All services are handled <strong className="text-primary">in person at our office</strong></li>
                <li className="flex items-center gap-2"><AlertTriangle size={14} className="text-secondary shrink-0" /> We never solicit funds online</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-primary mb-8">Contact Us</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-2 p-6 bg-card border border-border rounded-lg">
              <Phone size={24} className="text-secondary" />
              <span className="text-sm text-muted-foreground">Phone</span>
              <a href="tel:+256700000000" className="text-primary font-medium text-sm">+256 700 000 000</a>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 bg-card border border-border rounded-lg">
              <Mail size={24} className="text-secondary" />
              <span className="text-sm text-muted-foreground">Email</span>
              <a href="mailto:info@nyungafoundation.com" className="text-primary font-medium text-sm">info@nyungafoundation.com</a>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 bg-card border border-border rounded-lg">
              <MapPin size={24} className="text-secondary" />
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-primary font-medium text-sm">Uganda</span>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <img src={nyungaLogo} alt="Nyunga Foundation" className="w-20 mx-auto mb-6 opacity-90" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Every Child Deserves a Chance
          </h2>
          <p className="text-primary-foreground/80 max-w-md mx-auto text-lg">
            Together, we can change the story for Uganda's most vulnerable children through the power of education.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
