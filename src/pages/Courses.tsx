import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GraduationCap, Clock, Award, Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const Courses = () => {
  const [search, setSearch] = useState("");

  const { data: schools = [] } = useQuery({
    queryKey: ["public-schools-with-courses"],
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
    queryKey: ["public-university-courses"],
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
    ? courses.filter(
        (c: any) =>
          c.course_name.toLowerCase().includes(search.toLowerCase()) ||
          (c.faculty && c.faculty.toLowerCase().includes(search.toLowerCase()))
      )
    : courses;

  const groupedBySchool = schools
    .map((school: any) => ({
      ...school,
      courses: filtered.filter((c: any) => c.school_id === school.id),
    }))
    .filter((s: any) => s.courses.length > 0 || !search.trim());

  return (
    <>
      <Helmet>
        <title>Courses & Programs | Nyunga Foundation</title>
        <meta name="description" content="Browse courses offered at partner universities where Nyunga Foundation provides bursaries. Find the right program for your future." />
        <link rel="canonical" href="https://www.nyungafoundation.com/courses" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4 text-sm">
              <BookOpen className="w-4 h-4 mr-1" /> University Programs
            </Badge>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Explore Courses at Partner Universities
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Discover the programs available at universities where Nyunga Foundation awards bursaries. Find the right course for your future.
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="container mx-auto px-4 -mt-6 relative z-10">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search courses or faculties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 text-base bg-card border-border shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Grouped courses */}
        <section className="container mx-auto px-4 py-12">
          {groupedBySchool.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p className="text-lg">No courses found. Check back soon as we update our partner university programs.</p>
            </div>
          )}

          <div className="space-y-10">
            {groupedBySchool.map((school: any) => (
              <div key={school.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {/* University header */}
                <div className="bg-primary/5 border-b border-border px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-foreground">{school.name}</h2>
                      <p className="text-sm text-muted-foreground">{school.district} • {school.level}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {school.courses.length} course{school.courses.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>

                {/* Course list */}
                {school.courses.length > 0 ? (
                  <div className="divide-y divide-border">
                    {school.courses.map((course: any) => (
                      <div key={course.id} className="px-6 py-4 hover:bg-muted/30 transition-colors flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground">{course.course_name}</h3>
                          {course.faculty && (
                            <p className="text-sm text-muted-foreground">Faculty: {course.faculty}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
                          {course.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {course.duration}
                            </span>
                          )}
                          {course.qualification && (
                            <Badge variant="secondary" className="text-xs">
                              <Award className="w-3 h-3 mr-1" /> {course.qualification}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                    Course details coming soon for this institution.
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Courses;
