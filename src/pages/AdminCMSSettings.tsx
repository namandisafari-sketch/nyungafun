import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
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

  const [hero, setHero] = useState({ title: "", subtitle: "", description: "" });
  const [about, setAbout] = useState({ title: "", content: "", content2: "" });
  const [contact, setContact] = useState({ phone: "", email: "", location: "" });
  const [stats, setStats] = useState([{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }]);

  useEffect(() => {
    if (settings) {
      if (settings.hero) setHero(settings.hero.value as any);
      if (settings.about) setAbout(settings.about.value as any);
      if (settings.contact) setContact(settings.contact.value as any);
      if (settings.stats) setStats(settings.stats.value as any);
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
      toast.success("Settings saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground text-sm">Edit the content displayed on the public website</p>
      </div>

      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Subtitle (small text above title)</Label><Input value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} /></div>
              <div><Label>Main Title</Label><Input value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={4} value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} /></div>
              <Button onClick={() => saveMutation.mutate({ key: "hero", value: hero })} disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" /> Save Hero
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader><CardTitle>About Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Section Title</Label><Input value={about.title} onChange={(e) => setAbout({ ...about, title: e.target.value })} /></div>
              <div><Label>Paragraph 1</Label><Textarea rows={4} value={about.content} onChange={(e) => setAbout({ ...about, content: e.target.value })} /></div>
              <div><Label>Paragraph 2</Label><Textarea rows={4} value={about.content2} onChange={(e) => setAbout({ ...about, content2: e.target.value })} /></div>
              <Button onClick={() => saveMutation.mutate({ key: "about", value: about })} disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" /> Save About
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader><CardTitle>Homepage Statistics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <div><Label>Value {i + 1}</Label><Input value={stat.value} onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], value: e.target.value }; setStats(n); }} /></div>
                  <div><Label>Label {i + 1}</Label><Input value={stat.label} onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], label: e.target.value }; setStats(n); }} /></div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setStats([...stats, { value: "", label: "" }])}>Add Stat</Button>
              <Button onClick={() => saveMutation.mutate({ key: "stats", value: stats })} disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" /> Save Stats
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Phone</Label><Input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></div>
              <div><Label>Location</Label><Input value={contact.location} onChange={(e) => setContact({ ...contact, location: e.target.value })} /></div>
              <Button onClick={() => saveMutation.mutate({ key: "contact", value: contact })} disabled={saveMutation.isPending}>
                <Save className="h-4 w-4 mr-2" /> Save Contact
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCMSSettings;
