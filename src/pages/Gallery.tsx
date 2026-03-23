import { Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const successStories = [
  {
    title: "A Brighter Tomorrow",
    description: "See how Nyunga Foundation is transforming the lives of young learners across Uganda.",
    video: "/videos/success-story-1.mp4",
  },
  {
    title: "From Struggle to Success",
    description: "Watch the incredible journey of students supported by our bursary programs.",
    video: "/videos/success-story-2.mp4",
  },
  {
    title: "Community Impact",
    description: "Discover the ripple effect of education in rural communities.",
    video: "/videos/success-story-3.mp4",
  },
  {
    title: "Hope in Action",
    description: "Real stories of hope and resilience from our beneficiaries.",
    video: "/videos/success-story-4.mp4",
  },
];

const Gallery = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 bg-primary">
        <div className="absolute inset-0" style={{ background: "var(--hero-gradient)", opacity: 0.95 }} />
        <div className="relative container mx-auto px-4 text-center">
          <p className="text-secondary font-semibold tracking-wide uppercase text-sm mb-3">Gallery</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Our Success Stories</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Watch real stories of transformation — students whose lives have been changed through the power of education and community support.
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {successStories.map((story, i) => (
              <div key={i} className="group">
                {/* Styled video frame */}
                <div className="relative rounded-2xl overflow-hidden border-4 border-secondary/30 shadow-xl bg-card">
                  {/* Decorative top bar */}
                  <div className="absolute top-0 left-0 right-0 z-10 h-10 bg-gradient-to-r from-primary to-primary/80 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/80" />
                    <div className="w-3 h-3 rounded-full bg-secondary/80" />
                    <div className="w-3 h-3 rounded-full bg-accent/80" />
                    <span className="ml-2 text-primary-foreground/70 text-xs font-medium truncate">{story.title}</span>
                  </div>
                  <div className="pt-10">
                    <video
                      controls
                      preload="metadata"
                      className="w-full aspect-video object-cover"
                      poster=""
                    >
                      <source src={story.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
                {/* Caption */}
                <div className="mt-4 px-1">
                  <h3 className="font-display text-xl font-bold text-primary mb-1">{story.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{story.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30 text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-4">Want to Be Part of the Story?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">Join Nyunga Foundation in transforming lives. Every contribution creates a ripple of hope.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
