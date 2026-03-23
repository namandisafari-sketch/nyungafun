import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Users, BookOpen, Heart, MapPin, Phone, Mail, AlertTriangle, ShieldAlert, ArrowRight, Calendar, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import nyungaLogo from "@/assets/nyunga-logo.png";

const defaultStats = [
  { value: "500+", label: "Scholarships Awarded" },
  { value: "1,200+", label: "Students Supported" },
  { value: "50+", label: "Partner Schools" },
];

const statIcons = [GraduationCap, Users, BookOpen];

const defaultHero = {
  title: "Still There's Hope",
  subtitle: "Nyunga Foundation",
  description: "Transforming lives in Uganda through education. The Nyunga Foundation identifies and supports bright but financially disadvantaged students — because every child deserves a chance to learn.",
};

const defaultAbout = {
  title: "Who We Are",
  content: "The Nyunga Foundation is a Ugandan non-profit organisation dedicated to breaking the cycle of poverty through education. We support students from nursery to university level, covering tuition, scholastic materials, uniforms, and more.",
  content2: 'Founded on the belief that "Still there\'s Hope", we work alongside communities, schools, and families to ensure every deserving child gets access to quality education.',
};

const defaultContact = { phone: "+256 700 000 000", email: "info@nyungafoundation.com", location: "Uganda" };

const Index = () => {
  const { data: settings } = useQuery({
    queryKey: ["public-site-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      const map: Record<string, any> = {};
      data?.forEach((s: any) => { map[s.key] = s.value; });
      return map;
    },
  });

  const { data: blogPosts } = useQuery({
    queryKey: ["public-blog-posts"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(4);
      return data || [];
    },
  });

  const hero = settings?.hero || defaultHero;
  const about = settings?.about || defaultAbout;
  const contact = settings?.contact || defaultContact;
  const stats = (settings?.stats as any[]) || defaultStats;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0" style={{ background: "var(--hero-gradient)", opacity: 0.95 }} />
        <div className="relative container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 animate-fade-in-up">
              <p className="text-secondary font-semibold tracking-wide uppercase text-sm mb-4">{hero.subtitle}</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
                {hero.title.includes("Hope") ? (
                  <>
                    {hero.title.split("Hope")[0]}<span className="text-secondary">Hope</span>{hero.title.split("Hope")[1]}
                  </>
                ) : hero.title}
              </h1>
              <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">{hero.description}</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/about">
                  <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-base px-8 py-3 rounded-md transition-colors">Learn About Us</button>
                </Link>
                <Link to="/programs">
                  <button className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-base px-8 py-3 rounded-md transition-colors">Our Programs</button>
                </Link>
              </div>
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
            {stats.map((stat: any, i: number) => {
              const Icon = statIcons[i % statIcons.length];
              return (
                <div key={stat.label} className="flex flex-col items-center text-center p-8 rounded-lg bg-muted/50">
                  <Icon size={40} className="text-secondary mb-4" />
                  <span className="font-display text-4xl font-bold text-primary">{stat.value}</span>
                  <span className="text-muted-foreground mt-1">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About / Mission */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-6">{about.title}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">{about.content}</p>
          <p className="text-muted-foreground text-lg leading-relaxed">{about.content2}</p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/programs" className="group bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:border-secondary/30 transition-all">
              <Heart size={32} className="text-secondary mb-4" />
              <h3 className="font-display text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">Our Programs</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">Discover how we support students from nursery to university through our various programs.</p>
              <span className="text-secondary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Learn more <ArrowRight size={14} /></span>
            </Link>
            <Link to="/schools" className="group bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:border-secondary/30 transition-all">
              <BookOpen size={32} className="text-secondary mb-4" />
              <h3 className="font-display text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">Partner Schools</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">View the 50+ schools we partner with across Uganda to provide quality education.</p>
              <span className="text-secondary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">View schools <ArrowRight size={14} /></span>
            </Link>
            <Link to="/about" className="group bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:border-secondary/30 transition-all sm:col-span-2 lg:col-span-1">
              <Users size={32} className="text-secondary mb-4" />
              <h3 className="font-display text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">About Us</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">Learn about our mission, vision, values and the impact we've made in Ugandan communities.</p>
              <span className="text-secondary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Read more <ArrowRight size={14} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      {blogPosts && blogPosts.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <p className="text-secondary font-semibold text-sm uppercase tracking-wide mb-2">From Our Blog</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">Latest News & Stories</h2>
            </div>

            {/* Featured post */}
            <article className="bg-card border border-border rounded-xl overflow-hidden mb-8 hover:shadow-lg transition-shadow">
              <div className="p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">{blogPosts[0].category}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar size={12} /> {new Date(blogPosts[0].created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} /> {blogPosts[0].read_time}</span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-primary mb-4 leading-tight">{blogPosts[0].title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-2xl">{blogPosts[0].summary}</p>
                <span className="text-secondary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">Read full article <ArrowRight size={14} /></span>
              </div>
            </article>

            {blogPosts.length > 1 && (
              <div className="grid md:grid-cols-3 gap-6">
                {blogPosts.slice(1).map((post: any) => (
                  <article key={post.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="h-2 bg-secondary/20 group-hover:bg-secondary transition-colors" />
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">{post.category}</span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Calendar size={10} /> {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-primary mb-3 leading-snug group-hover:text-secondary transition-colors">{post.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">{post.summary}</p>
                      <span className="text-secondary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer">Read more <ArrowRight size={12} /></span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Scam Warning */}
      <section className="py-16 bg-destructive/10 border-y border-destructive/20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
              <ShieldAlert size={32} className="text-destructive" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-destructive mb-4">⚠️ Beware of Scammers</h2>
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
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="font-display text-3xl font-bold text-primary mb-8">Contact Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="flex flex-col items-center gap-2 p-6 bg-card border border-border rounded-lg">
              <Phone size={24} className="text-secondary" />
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="text-primary font-medium text-sm text-center">{contact.phone}</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 bg-card border border-border rounded-lg">
              <Mail size={24} className="text-secondary" />
              <span className="text-sm text-muted-foreground">WhatsApp</span>
              <a href={`https://wa.me/256746960654`} target="_blank" rel="noopener noreferrer" className="text-primary font-medium text-sm">{contact.whatsapp || "0746 960 654"}</a>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 bg-card border border-border rounded-lg">
              <Mail size={24} className="text-secondary" />
              <span className="text-sm text-muted-foreground">Email</span>
              <a href={`mailto:${contact.email}`} className="text-primary font-medium text-sm">{contact.email}</a>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 bg-card border border-border rounded-lg">
              <MapPin size={24} className="text-secondary" />
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-primary font-medium text-sm text-center leading-relaxed">{contact.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <img src={nyungaLogo} alt="Nyunga Foundation" className="w-20 mx-auto mb-6 opacity-90" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Every Child Deserves a Chance</h2>
          <p className="text-primary-foreground/80 max-w-md mx-auto text-lg">Together, we can change the story for Uganda's most vulnerable children through the power of education.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
