import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const defaultGallery = {
  heroTitle: "Our Success Stories",
  heroSubtitle: "Gallery",
  heroDescription: "Watch real stories of transformation — students whose lives have been changed through the power of education and community support.",
  ctaTitle: "Want to Be Part of the Story?",
  ctaDescription: "Join Nyunga Foundation in transforming lives. Every contribution creates a ripple of hope.",
  videos: [
    { title: "A Brighter Tomorrow", description: "See how Nyunga Foundation is transforming the lives of young learners across Uganda.", video: "/videos/success-story-1.mp4" },
    { title: "From Struggle to Success", description: "Watch the incredible journey of students supported by our bursary programs.", video: "/videos/success-story-2.mp4" },
    { title: "Community Impact", description: "Discover the ripple effect of education in rural communities.", video: "/videos/success-story-3.mp4" },
    { title: "Hope in Action", description: "Real stories of hope and resilience from our beneficiaries.", video: "/videos/success-story-4.mp4" },
  ],
};

const Gallery = () => {
  const { data: settings } = useQuery({
    queryKey: ["public-site-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      const map: Record<string, any> = {};
      data?.forEach((s: any) => { map[s.key] = s.value; });
      return map;
    },
  });

  const g = settings?.gallery || defaultGallery;
  const videos = g.videos || defaultGallery.videos;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGallery",
    name: g.heroTitle,
    description: g.heroDescription,
    publisher: {
      "@type": "Organization",
      name: "Nyunga Foundation",
      url: "https://nyungafun.lovable.app",
    },
    video: videos.map((v: any) => ({
      "@type": "VideoObject",
      name: v.title,
      description: v.description,
      contentUrl: v.video,
      uploadDate: "2025-01-01",
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{g.heroTitle} — Nyunga Foundation Gallery</title>
        <meta name="description" content={g.heroDescription} />
        <meta property="og:title" content={`${g.heroTitle} — Nyunga Foundation`} />
        <meta property="og:description" content={g.heroDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nyungafun.lovable.app/gallery" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar />

      {/* Hero */}
      <section className="relative py-20 bg-primary">
        <div className="absolute inset-0" style={{ background: "var(--hero-gradient)", opacity: 0.95 }} />
        <div className="relative container mx-auto px-4 text-center">
          <p className="text-secondary font-semibold tracking-wide uppercase text-sm mb-3">{g.heroSubtitle}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">{g.heroTitle}</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">{g.heroDescription}</p>
        </div>
      </section>

      {/* Videos Grid - Portrait TikTok format */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((story: any, i: number) => (
              <article key={i} className="group" itemScope itemType="https://schema.org/VideoObject">
                <meta itemProp="name" content={story.title} />
                <meta itemProp="description" content={story.description} />
                <div className="relative rounded-2xl overflow-hidden border-4 border-secondary/30 shadow-xl bg-card">
                  {/* Phone-style top bar */}
                  <div className="absolute top-0 left-0 right-0 z-10 h-8 bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center gap-1.5 rounded-t-xl">
                    <div className="w-10 h-1 rounded-full bg-primary-foreground/20" />
                  </div>
                  <div className="pt-8">
                    <video
                      controls
                      preload="metadata"
                      className="w-full aspect-[9/16] object-cover bg-muted"
                      playsInline
                      title={story.title}
                    >
                      <source src={story.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  {/* Phone-style bottom bar */}
                  <div className="h-6 bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                    <div className="w-8 h-1 rounded-full bg-primary-foreground/20" />
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <h3 className="font-display text-base font-bold text-primary mb-1">{story.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{story.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30 text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-4">{g.ctaTitle}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">{g.ctaDescription}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
