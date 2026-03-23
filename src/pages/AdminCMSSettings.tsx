import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminCMSSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      const map: Record<string, any> = {};
      data.forEach((s: any) => { map[s.key] = { id: s.id, value: s.value }; });
      return map;
    },
  });

  // Home page
  const [hero, setHero] = useState({ title: "", subtitle: "", description: "" });
  const [stats, setStats] = useState([{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }]);
  const [aboutSnippet, setAboutSnippet] = useState({ title: "", content: "", content2: "" });
  const [contact, setContact] = useState({ phone: "", email: "", location: "", whatsapp: "" });
  const [scamWarning, setScamWarning] = useState({ title: "", body1: "", body2: "", officialSite: "", channels: [""] });
  const [closingCta, setClosingCta] = useState({ title: "", description: "" });
  const [quickLinks, setQuickLinks] = useState([
    { title: "", description: "", linkText: "", linkTo: "" },
    { title: "", description: "", linkText: "", linkTo: "" },
    { title: "", description: "", linkText: "", linkTo: "" },
  ]);

  // About page
  const [aboutPage, setAboutPage] = useState({
    headerTitle: "About Nyunga Foundation",
    headerSubtitle: '"Still there\'s Hope" — empowering Uganda\'s youth through education since day one.',
    mission: "To identify and sponsor academically bright but financially needy students across Uganda, from nursery to university level.",
    vision: "A Uganda where no child is denied education due to poverty — where every learner has the chance to reach their full potential.",
    values: "Transparency, compassion, and accountability guide everything we do. Every shilling is tracked and accounted for.",
    provides: ["Tuition fees", "Scholastic materials", "School uniforms", "Boarding fees", "Examination fees", "Mentorship programs"],
    closingTitle: "Still There's Hope",
    closingDesc: "Together, we can ensure that every deserving child in Uganda has access to quality education regardless of their financial background.",
  });

  // Gallery page
  const [gallery, setGallery] = useState({
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
  });

  // Social
  const [social, setSocial] = useState({ tiktok: "", facebook: "", instagram: "", youtube: "", twitter: "", linkedin: "", whatsapp: "" });

  useEffect(() => {
    if (settings) {
      if (settings.hero) setHero(settings.hero.value as any);
      if (settings.about) setAboutSnippet(settings.about.value as any);
      if (settings.contact) setContact({ phone: "", email: "", location: "", whatsapp: "", ...(settings.contact.value as any) });
      if (settings.stats) setStats(settings.stats.value as any);
      if (settings.social) setSocial({ tiktok: "", facebook: "", instagram: "", youtube: "", twitter: "", linkedin: "", whatsapp: "", ...(settings.social.value as any) });
      if (settings.scam_warning) setScamWarning(settings.scam_warning.value as any);
      if (settings.closing_cta) setClosingCta(settings.closing_cta.value as any);
      if (settings.quick_links) setQuickLinks(settings.quick_links.value as any);
      if (settings.about_page) setAboutPage({ ...aboutPage, ...(settings.about_page.value as any) });
      if (settings.gallery) setGallery({ ...gallery, ...(settings.gallery.value as any) });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      if (settings?.[key]) {
        const { error } = await supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("id", settings[key].id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_settings").insert({ key, value });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      queryClient.invalidateQueries({ queryKey: ["public-site-settings"] });
      toast.success("Settings saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const SaveBtn = ({ onClick, label = "Save" }: { onClick: () => void; label?: string }) => (
    <Button onClick={onClick} disabled={saveMutation.isPending} className="mt-2">
      <Save className="h-4 w-4 mr-2" /> {label}
    </Button>
  );

  if (isLoading) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site Content Manager</h1>
        <p className="text-muted-foreground text-sm">Manage every section of the public website from here</p>
      </div>

      <Tabs defaultValue="home-hero">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="home-hero">Home: Hero</TabsTrigger>
          <TabsTrigger value="home-stats">Home: Stats</TabsTrigger>
          <TabsTrigger value="home-about">Home: About</TabsTrigger>
          <TabsTrigger value="home-links">Home: Quick Links</TabsTrigger>
          <TabsTrigger value="home-warning">Home: Scam Warning</TabsTrigger>
          <TabsTrigger value="home-cta">Home: Closing CTA</TabsTrigger>
          <TabsTrigger value="about-page">About Page</TabsTrigger>
          <TabsTrigger value="gallery-page">Gallery / Stories</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        {/* HOME: HERO */}
        <TabsContent value="home-hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>The main banner visitors see on the homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Subtitle (small text above title)</Label><Input value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} /></div>
              <div><Label>Main Title</Label><Input value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={4} value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} /></div>
              <SaveBtn onClick={() => saveMutation.mutate({ key: "hero", value: hero })} label="Save Hero" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* HOME: STATS */}
        <TabsContent value="home-stats">
          <Card>
            <CardHeader>
              <CardTitle>Homepage Statistics</CardTitle>
              <CardDescription>Key impact numbers shown below the hero</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 items-end">
                  <div><Label>Value {i + 1}</Label><Input value={stat.value} onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], value: e.target.value }; setStats(n); }} /></div>
                  <div className="flex gap-2">
                    <div className="flex-1"><Label>Label {i + 1}</Label><Input value={stat.label} onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], label: e.target.value }; setStats(n); }} /></div>
                    {stats.length > 1 && <Button variant="ghost" size="icon" className="shrink-0 mt-5" onClick={() => setStats(stats.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setStats([...stats, { value: "", label: "" }])}><Plus className="h-3 w-3 mr-1" /> Add Stat</Button>
              <SaveBtn onClick={() => saveMutation.mutate({ key: "stats", value: stats })} label="Save Stats" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* HOME: ABOUT SNIPPET */}
        <TabsContent value="home-about">
          <Card>
            <CardHeader>
              <CardTitle>About / Mission Snippet</CardTitle>
              <CardDescription>Brief about section shown on homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Section Title</Label><Input value={aboutSnippet.title} onChange={(e) => setAboutSnippet({ ...aboutSnippet, title: e.target.value })} /></div>
              <div><Label>Paragraph 1</Label><Textarea rows={4} value={aboutSnippet.content} onChange={(e) => setAboutSnippet({ ...aboutSnippet, content: e.target.value })} /></div>
              <div><Label>Paragraph 2</Label><Textarea rows={4} value={aboutSnippet.content2} onChange={(e) => setAboutSnippet({ ...aboutSnippet, content2: e.target.value })} /></div>
              <SaveBtn onClick={() => saveMutation.mutate({ key: "about", value: aboutSnippet })} label="Save About Snippet" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* HOME: QUICK LINKS */}
        <TabsContent value="home-links">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links Section</CardTitle>
              <CardDescription>The 3 feature cards linking to key pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {quickLinks.map((link, i) => (
                <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground">Card {i + 1}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Title</Label><Input value={link.title} onChange={(e) => { const n = [...quickLinks]; n[i] = { ...n[i], title: e.target.value }; setQuickLinks(n); }} /></div>
                    <div><Label>Link Text</Label><Input value={link.linkText} onChange={(e) => { const n = [...quickLinks]; n[i] = { ...n[i], linkText: e.target.value }; setQuickLinks(n); }} /></div>
                  </div>
                  <div><Label>Description</Label><Textarea rows={2} value={link.description} onChange={(e) => { const n = [...quickLinks]; n[i] = { ...n[i], description: e.target.value }; setQuickLinks(n); }} /></div>
                  <div><Label>Link URL (e.g. /programs)</Label><Input value={link.linkTo} onChange={(e) => { const n = [...quickLinks]; n[i] = { ...n[i], linkTo: e.target.value }; setQuickLinks(n); }} /></div>
                </div>
              ))}
              <SaveBtn onClick={() => saveMutation.mutate({ key: "quick_links", value: quickLinks })} label="Save Quick Links" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* HOME: SCAM WARNING */}
        <TabsContent value="home-warning">
          <Card>
            <CardHeader>
              <CardTitle>Scam Warning Section</CardTitle>
              <CardDescription>Fraud warning banner on homepage and about page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Warning Title</Label><Input value={scamWarning.title} onChange={(e) => setScamWarning({ ...scamWarning, title: e.target.value })} placeholder="⚠️ Beware of Scammers" /></div>
              <div><Label>Paragraph 1</Label><Textarea rows={3} value={scamWarning.body1} onChange={(e) => setScamWarning({ ...scamWarning, body1: e.target.value })} /></div>
              <div><Label>Paragraph 2</Label><Textarea rows={3} value={scamWarning.body2} onChange={(e) => setScamWarning({ ...scamWarning, body2: e.target.value })} /></div>
              <div><Label>Official Website URL</Label><Input value={scamWarning.officialSite} onChange={(e) => setScamWarning({ ...scamWarning, officialSite: e.target.value })} placeholder="www.nyungafoundation.com" /></div>
              <SaveBtn onClick={() => saveMutation.mutate({ key: "scam_warning", value: scamWarning })} label="Save Warning" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* HOME: CLOSING CTA */}
        <TabsContent value="home-cta">
          <Card>
            <CardHeader>
              <CardTitle>Closing Call-to-Action</CardTitle>
              <CardDescription>The final motivational section at the bottom of the homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Title</Label><Input value={closingCta.title} onChange={(e) => setClosingCta({ ...closingCta, title: e.target.value })} placeholder="Every Child Deserves a Chance" /></div>
              <div><Label>Description</Label><Textarea rows={3} value={closingCta.description} onChange={(e) => setClosingCta({ ...closingCta, description: e.target.value })} /></div>
              <SaveBtn onClick={() => saveMutation.mutate({ key: "closing_cta", value: closingCta })} label="Save CTA" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABOUT PAGE */}
        <TabsContent value="about-page">
          <Card>
            <CardHeader>
              <CardTitle>About Page</CardTitle>
              <CardDescription>Full content for the /about page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Page Title</Label><Input value={aboutPage.headerTitle} onChange={(e) => setAboutPage({ ...aboutPage, headerTitle: e.target.value })} /></div>
              <div><Label>Page Subtitle</Label><Input value={aboutPage.headerSubtitle} onChange={(e) => setAboutPage({ ...aboutPage, headerSubtitle: e.target.value })} /></div>
              <hr className="my-2" />
              <p className="text-sm font-semibold text-muted-foreground">Mission / Vision / Values</p>
              <div><Label>Mission</Label><Textarea rows={3} value={aboutPage.mission} onChange={(e) => setAboutPage({ ...aboutPage, mission: e.target.value })} /></div>
              <div><Label>Vision</Label><Textarea rows={3} value={aboutPage.vision} onChange={(e) => setAboutPage({ ...aboutPage, vision: e.target.value })} /></div>
              <div><Label>Values</Label><Textarea rows={3} value={aboutPage.values} onChange={(e) => setAboutPage({ ...aboutPage, values: e.target.value })} /></div>
              <hr className="my-2" />
              <p className="text-sm font-semibold text-muted-foreground">What We Provide (one per line)</p>
              <Textarea
                rows={6}
                value={(aboutPage.provides || []).join("\n")}
                onChange={(e) => setAboutPage({ ...aboutPage, provides: e.target.value.split("\n").filter(Boolean) })}
              />
              <hr className="my-2" />
              <p className="text-sm font-semibold text-muted-foreground">Closing Section</p>
              <div><Label>Closing Title</Label><Input value={aboutPage.closingTitle} onChange={(e) => setAboutPage({ ...aboutPage, closingTitle: e.target.value })} /></div>
              <div><Label>Closing Description</Label><Textarea rows={3} value={aboutPage.closingDesc} onChange={(e) => setAboutPage({ ...aboutPage, closingDesc: e.target.value })} /></div>
              <SaveBtn onClick={() => saveMutation.mutate({ key: "about_page", value: aboutPage })} label="Save About Page" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* GALLERY / SUCCESS STORIES */}
        <TabsContent value="gallery-page">
          <Card>
            <CardHeader>
              <CardTitle>Gallery / Success Stories</CardTitle>
              <CardDescription>Manage the videos and text on the /gallery page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Page Subtitle</Label><Input value={gallery.heroSubtitle} onChange={(e) => setGallery({ ...gallery, heroSubtitle: e.target.value })} /></div>
              <div><Label>Page Title</Label><Input value={gallery.heroTitle} onChange={(e) => setGallery({ ...gallery, heroTitle: e.target.value })} /></div>
              <div><Label>Page Description</Label><Textarea rows={3} value={gallery.heroDescription} onChange={(e) => setGallery({ ...gallery, heroDescription: e.target.value })} /></div>
              <hr className="my-2" />
              <p className="text-sm font-semibold text-muted-foreground">Success Story Videos</p>
              {gallery.videos.map((v, i) => (
                <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-muted-foreground">Video {i + 1}</p>
                    {gallery.videos.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => setGallery({ ...gallery, videos: gallery.videos.filter((_, j) => j !== i) })}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div><Label>Title</Label><Input value={v.title} onChange={(e) => { const vids = [...gallery.videos]; vids[i] = { ...vids[i], title: e.target.value }; setGallery({ ...gallery, videos: vids }); }} /></div>
                  <div><Label>Description</Label><Textarea rows={2} value={v.description} onChange={(e) => { const vids = [...gallery.videos]; vids[i] = { ...vids[i], description: e.target.value }; setGallery({ ...gallery, videos: vids }); }} /></div>
                  <div><Label>Video URL (relative or absolute)</Label><Input value={v.video} onChange={(e) => { const vids = [...gallery.videos]; vids[i] = { ...vids[i], video: e.target.value }; setGallery({ ...gallery, videos: vids }); }} placeholder="/videos/success-story-1.mp4" /></div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setGallery({ ...gallery, videos: [...gallery.videos, { title: "", description: "", video: "" }] })}>
                <Plus className="h-3 w-3 mr-1" /> Add Video
              </Button>
              <hr className="my-2" />
              <p className="text-sm font-semibold text-muted-foreground">Bottom CTA</p>
              <div><Label>CTA Title</Label><Input value={gallery.ctaTitle} onChange={(e) => setGallery({ ...gallery, ctaTitle: e.target.value })} /></div>
              <div><Label>CTA Description</Label><Textarea rows={2} value={gallery.ctaDescription} onChange={(e) => setGallery({ ...gallery, ctaDescription: e.target.value })} /></div>
              <SaveBtn onClick={() => saveMutation.mutate({ key: "gallery", value: gallery })} label="Save Gallery" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTACT */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Shown on the homepage contact section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Phone</Label><Input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></div>
              <div><Label>WhatsApp Number</Label><Input value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} placeholder="0746 960 654" /></div>
              <div><Label>Email</Label><Input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></div>
              <div><Label>Location / Address</Label><Textarea rows={3} value={contact.location} onChange={(e) => setContact({ ...contact, location: e.target.value })} /></div>
              <SaveBtn onClick={() => saveMutation.mutate({ key: "contact", value: contact })} label="Save Contact" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SOCIAL */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Shown in the website footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {([
                ["tiktok", "TikTok URL"],
                ["facebook", "Facebook URL"],
                ["instagram", "Instagram URL"],
                ["youtube", "YouTube URL"],
                ["twitter", "Twitter / X URL"],
                ["linkedin", "LinkedIn URL"],
                ["whatsapp", "WhatsApp Channel URL"],
              ] as const).map(([key, label]) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <Input placeholder="https://..." value={(social as any)[key] || ""} onChange={(e) => setSocial({ ...social, [key]: e.target.value })} />
                </div>
              ))}
              <SaveBtn onClick={() => saveMutation.mutate({ key: "social", value: social })} label="Save Social Links" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCMSSettings;
