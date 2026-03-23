import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, GraduationCap, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const BURSARY_LABELS: Record<string, string> = {
  full: "FULL TUITION BURSARY",
  partial: "PARTIAL TUITION BURSARY",
};

const Courses = () => {
  const [search, setSearch] = useState("");

  const { data: schools = [] } = useQuery({
    queryKey: ["public-bursary-schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("id, name, district, level")
        .eq("is_active", true)
        .in("level", ["university", "tertiary"])
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["public-bursary-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("university_courses")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const filtered = search.trim()
    ? courses.filter((c: any) => c.course_name.toLowerCase().includes(search.toLowerCase()))
    : courses;

  const grouped = schools.map((school: any) => {
    const schoolCourses = filtered.filter((c: any) => c.school_id === school.id);
    const bursaryType = schoolCourses[0]?.bursary_type || "full";
    const hasSession = schoolCourses.some((c: any) => c.session);
    return { ...school, courses: schoolCourses, bursaryType, hasSession };
  }).filter((s: any) => s.courses.length > 0);

  const totalCourses = courses.length;

  return (
    <>
      <Helmet>
        <title>Courses & Bursaries 2026 | Nyunga Foundation</title>
        <meta name="description" content="Browse full and partial tuition bursary courses available at Nyunga Foundation partner institutions in Uganda for 2026." />
        <link rel="canonical" href="https://www.nyungafoundation.com/courses" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-12 md:py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm uppercase tracking-widest text-primary-foreground/70 mb-2">Nyunga Foundation — "Still there's Hope"</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Courses Available on Bursaries 2026</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-2">Browse all courses at our partner institutions. Full and partial tuition bursaries available.</p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary-foreground/70 mt-4">
              <Phone className="w-4 h-4" />
              <span>Direct call 0746 960 654 / WhatsApp 0772 956 500</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Badge variant="secondary" className="text-sm px-4 py-1">{schools.length} Partner Institutions</Badge>
              <Badge variant="secondary" className="text-sm px-4 py-1">{totalCourses} Courses Available</Badge>
            </div>
          </div>
        </section>

        {/* Search */}
        <div className="container mx-auto px-4 -mt-5 relative z-10">
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search courses by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-12 text-base bg-card border-border shadow-lg" />
          </div>
        </div>

        {/* Tables */}
        <section className="container mx-auto px-4 py-10 space-y-12">
          {grouped.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p className="text-lg">{search ? "No courses match your search." : "Courses coming soon. Check back later."}</p>
            </div>
          )}

          {grouped.map((inst: any) => (
            <div key={inst.id} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="bg-primary text-primary-foreground px-4 md:px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-display font-bold">{inst.name}</h2>
                      <p className="text-xs text-primary-foreground/70 uppercase tracking-wider">
                        {BURSARY_LABELS[inst.bursaryType] || "BURSARY"} COURSES 2026
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 self-start sm:self-auto">
                    {inst.courses.length} course{inst.courses.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border">
                      <th className="text-left px-3 md:px-4 py-3 font-semibold text-foreground w-12">S/NO</th>
                      <th className="text-left px-3 md:px-4 py-3 font-semibold text-foreground">Course</th>
                      {inst.hasSession && <th className="text-center px-3 md:px-4 py-3 font-semibold text-foreground w-20">Session</th>}
                      <th className="text-right px-3 md:px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                        {inst.bursaryType === "partial" ? "Tuition/Sem" : "Tuition Bursary"}
                      </th>
                      <th className="text-right px-3 md:px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                        {inst.bursaryType === "partial" ? "Partial Bursary" : "Functional Fees"}
                      </th>
                      <th className="text-center px-3 md:px-4 py-3 font-semibold text-foreground w-24">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inst.courses.map((course: any, idx: number) => (
                      <tr key={course.id} className={`border-b border-border/50 transition-colors hover:bg-muted/30 ${idx % 2 === 0 ? "bg-background" : "bg-muted/10"}`}>
                        <td className="px-3 md:px-4 py-2.5 text-muted-foreground text-center">{idx + 1}</td>
                        <td className="px-3 md:px-4 py-2.5 font-medium text-foreground">{course.course_name}</td>
                        {inst.hasSession && (
                          <td className="px-3 md:px-4 py-2.5 text-center">
                            {course.session ? <Badge variant="outline" className="text-xs">{course.session}</Badge> : "—"}
                          </td>
                        )}
                        <td className="px-3 md:px-4 py-2.5 text-right font-mono text-foreground whitespace-nowrap">
                          {course.tuition && course.tuition !== "N/A" ? `UGX ${course.tuition}` : "—"}
                        </td>
                        <td className="px-3 md:px-4 py-2.5 text-right font-mono text-secondary whitespace-nowrap font-semibold">
                          {course.functional_fees ? `UGX ${course.functional_fees}` : "—"}
                        </td>
                        <td className="px-3 md:px-4 py-2.5 text-center text-muted-foreground">{course.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        <section className="container mx-auto px-4 pb-10">
          <p className="text-center text-xs text-muted-foreground">© 2026 Nyunga Foundation. All rights reserved. | Contact us for the latest updates.</p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Courses;
