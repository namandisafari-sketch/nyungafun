import { useEffect, useState } from "react";
import { BookOpen, MapPin, Users, GraduationCap, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface School {
  id: string;
  name: string;
  level: string;
  district: string;
  total_bursaries: number;
  boarding_available: boolean;
  is_active: boolean;
}

const levelLabels: Record<string, string> = {
  nursery: "Nursery",
  primary: "Primary",
  secondary_o: "O-Level",
  secondary_a: "A-Level",
  vocational: "Vocational",
  university: "University",
};

const levelColors: Record<string, string> = {
  nursery: "bg-pink-100 text-pink-700",
  primary: "bg-blue-100 text-blue-700",
  secondary_o: "bg-green-100 text-green-700",
  secondary_a: "bg-purple-100 text-purple-700",
  vocational: "bg-orange-100 text-orange-700",
  university: "bg-indigo-100 text-indigo-700",
};

const Schools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  useEffect(() => {
    const fetchSchools = async () => {
      const { data } = await supabase
        .from("schools")
        .select("id, name, level, district, total_bursaries, boarding_available, is_active")
        .eq("is_active", true)
        .order("name");
      setSchools((data as School[]) || []);
      setLoading(false);
    };
    fetchSchools();
  }, []);

  const levels = [...new Set(schools.map((s) => s.level))].sort();

  const filtered = schools.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.district.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = filterLevel === "all" || s.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const groupedByLevel = filtered.reduce<Record<string, School[]>>((acc, school) => {
    if (!acc[school.level]) acc[school.level] = [];
    acc[school.level].push(school);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <BookOpen size={48} className="mx-auto mb-4 text-secondary" />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Partner Schools</h1>
          <p className="text-primary-foreground/80 text-lg">
            We work with {schools.length}+ schools across Uganda to provide quality education to our beneficiaries.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-card border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by school name or district..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterLevel("all")}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  filterLevel === "all" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All ({schools.length})
              </button>
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                    filterLevel === level ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {levelLabels[level] || level} ({schools.filter((s) => s.level === level).length})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Schools Grid */}
      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-5xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-secondary border-t-transparent rounded-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground text-lg">No schools found matching your search.</p>
            </div>
          ) : (
            Object.entries(groupedByLevel)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([level, levelSchools]) => (
                <div key={level} className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap size={20} className="text-secondary" />
                    <h2 className="font-display text-xl font-bold text-primary">
                      {levelLabels[level] || level} Schools
                    </h2>
                    <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                      {levelSchools.length}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {levelSchools.map((school) => (
                      <div key={school.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-display text-base font-bold text-primary leading-snug pr-2">{school.name}</h3>
                          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${levelColors[school.level] || "bg-muted text-muted-foreground"}`}>
                            {levelLabels[school.level] || school.level}
                          </span>
                        </div>
                        <div className="space-y-1.5 text-sm text-muted-foreground">
                          {school.district && (
                            <p className="flex items-center gap-2">
                              <MapPin size={13} className="shrink-0 text-secondary" />
                              {school.district}
                            </p>
                          )}
                          {school.total_bursaries > 0 && (
                            <p className="flex items-center gap-2">
                              <Users size={13} className="shrink-0 text-secondary" />
                              {school.total_bursaries} bursary slots
                            </p>
                          )}
                          {school.boarding_available && (
                            <p className="flex items-center gap-2">
                              <BookOpen size={13} className="shrink-0 text-secondary" />
                              Boarding available
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Schools;
