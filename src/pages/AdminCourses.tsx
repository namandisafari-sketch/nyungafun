import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, GraduationCap, Pencil, School, Search } from "lucide-react";

// ── Institution Management ───────────────────────────────────────

const InstitutionForm = ({ initial, onSave, onCancel }: { initial?: any; onSave: (d: any) => void; onCancel: () => void }) => {
  const [form, setForm] = useState({
    name: initial?.name || "",
    level: initial?.level || "university",
    district: initial?.district || "",
    total_bursaries: initial?.total_bursaries || 0,
  });
  return (
    <div className="space-y-4">
      <div><Label>Institution Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div><Label>Level</Label>
        <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="university">University</SelectItem>
            <SelectItem value="tertiary">Tertiary / College</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label>District</Label><Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></div>
      <div><Label>Total Bursary Slots</Label><Input type="number" value={form.total_bursaries} onChange={(e) => setForm({ ...form, total_bursaries: Number(e.target.value) })} /></div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(form)}>Save</Button>
      </div>
    </div>
  );
};

const CourseForm = ({ initial, schoolId, onSave, onCancel }: { initial?: any; schoolId: string; onSave: (d: any) => void; onCancel: () => void }) => {
  const [form, setForm] = useState({
    course_name: initial?.course_name || "",
    tuition: initial?.tuition || "",
    functional_fees: initial?.functional_fees || "",
    duration: initial?.duration || "",
    session: initial?.session || "",
    bursary_type: initial?.bursary_type || "full",
    qualification: initial?.qualification || "",
    faculty: initial?.faculty || "",
  });
  return (
    <div className="space-y-3">
      <div><Label>Course Name</Label><Input value={form.course_name} onChange={(e) => setForm({ ...form, course_name: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Tuition (UGX)</Label><Input value={form.tuition} onChange={(e) => setForm({ ...form, tuition: e.target.value })} placeholder="e.g. 1,200,000" /></div>
        <div><Label>Functional Fees (UGX)</Label><Input value={form.functional_fees} onChange={(e) => setForm({ ...form, functional_fees: e.target.value })} placeholder="e.g. 600,000" /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label>Duration</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3 Years" /></div>
        <div><Label>Session</Label><Input value={form.session} onChange={(e) => setForm({ ...form, session: e.target.value })} placeholder="e.g. D/E/W" /></div>
        <div><Label>Bursary Type</Label>
          <Select value={form.bursary_type} onValueChange={(v) => setForm({ ...form, bursary_type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Bursary</SelectItem>
              <SelectItem value="partial">Partial Bursary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Qualification</Label><Input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} placeholder="e.g. Bachelor's Degree" /></div>
        <div><Label>Faculty</Label><Input value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} placeholder="Optional" /></div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave({ ...form, school_id: schoolId, is_active: true })}>Save</Button>
      </div>
    </div>
  );
};

// ── CSV Import ───────────────────────────────────────────────────

const CSVImporter = ({ schools, onDone }: { schools: any[]; onDone: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [schoolId, setSchoolId] = useState("");
  const [bursaryType, setBursaryType] = useState("full");
  const [importing, setImporting] = useState(false);

  const handleFile = async (f: File) => {
    setFile(f);
    const text = await f.text();
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows = lines.slice(1).map((line) => {
      const vals = line.split(",").map((v) => v.trim());
      const row: any = {};
      headers.forEach((h, i) => (row[h] = vals[i] || ""));
      return row;
    });
    setPreview(rows.slice(0, 10));
  };

  const handleImport = async () => {
    if (!file || !schoolId) return;
    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const rows = lines.slice(1).map((line, idx) => {
        const vals = line.split(",").map((v) => v.trim());
        const row: any = {};
        headers.forEach((h, i) => (row[h] = vals[i] || ""));
        return {
          school_id: schoolId,
          course_name: row["course_name"] || row["course"] || row["name"] || "",
          tuition: row["tuition"] || row["tuition_bursary"] || "",
          functional_fees: row["functional_fees"] || row["fees"] || "",
          duration: row["duration"] || "",
          session: row["session"] || null,
          bursary_type: bursaryType,
          qualification: row["qualification"] || null,
          faculty: row["faculty"] || null,
          sort_order: idx,
          is_active: true,
        };
      }).filter((r) => r.course_name);

      const batchSize = 50;
      for (let i = 0; i < rows.length; i += batchSize) {
        const { error } = await supabase.from("university_courses").insert(rows.slice(i, i + batchSize));
        if (error) throw error;
      }
      toast({ title: "Import Complete", description: `${rows.length} courses imported successfully.` });
      onDone();
    } catch (err: any) {
      toast({ title: "Import Failed", description: err.message, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">CSV Format</p>
        <p>Required columns: <code>course_name</code></p>
        <p>Optional: <code>tuition, functional_fees, duration, session, qualification, faculty</code></p>
        <p className="mt-1">Example: <code>course_name,tuition,functional_fees,duration</code></p>
      </div>
      <div><Label>Select Institution</Label>
        <Select value={schoolId} onValueChange={setSchoolId}>
          <SelectTrigger><SelectValue placeholder="Choose institution..." /></SelectTrigger>
          <SelectContent>{schools.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div><Label>Bursary Type</Label>
        <Select value={bursaryType} onValueChange={setBursaryType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Bursary</SelectItem>
            <SelectItem value="partial">Partial Bursary</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>CSV File</Label>
        <Input type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>
      {preview.length > 0 && (
        <div className="border rounded-lg overflow-x-auto max-h-48">
          <table className="text-xs w-full">
            <thead><tr className="bg-muted">{Object.keys(preview[0]).map((k) => <th key={k} className="px-2 py-1 text-left">{k}</th>)}</tr></thead>
            <tbody>{preview.map((row, i) => <tr key={i} className="border-t">{Object.values(row).map((v: any, j) => <td key={j} className="px-2 py-1">{v}</td>)}</tr>)}</tbody>
          </table>
          <p className="text-xs text-muted-foreground p-2">Showing first {preview.length} rows</p>
        </div>
      )}
      <Button onClick={handleImport} disabled={!file || !schoolId || importing} className="w-full">
        <Upload className="w-4 h-4 mr-2" /> {importing ? "Importing..." : "Import Courses"}
      </Button>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────

const AdminCourses = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any>(null);

  const { data: schools = [] } = useQuery({
    queryKey: ["admin-course-schools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("schools").select("*").in("level", ["university", "tertiary"]).order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["admin-courses", selectedSchool],
    queryFn: async () => {
      let q = supabase.from("university_courses").select("*").order("sort_order");
      if (selectedSchool) q = q.eq("school_id", selectedSchool);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const saveCourse = useMutation({
    mutationFn: async (course: any) => {
      if (course.id) {
        const { error } = await supabase.from("university_courses").update(course).eq("id", course.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("university_courses").insert(course);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      setEditingCourse(null);
      setShowAddCourse(false);
      toast({ title: "Course saved" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteCourse = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("university_courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      toast({ title: "Course deleted" });
    },
  });

  const saveSchool = useMutation({
    mutationFn: async (school: any) => {
      if (school.id) {
        const { error } = await supabase.from("schools").update(school).eq("id", school.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("schools").insert({ ...school, full_fees: 0, nyunga_covered_fees: 0 });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-course-schools"] });
      setShowAddSchool(false);
      setEditingSchool(null);
      toast({ title: "Institution saved" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteSchool = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("schools").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-course-schools"] });
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      toast({ title: "Institution deleted" });
    },
  });

  const filteredCourses = search
    ? courses.filter((c: any) => c.course_name.toLowerCase().includes(search.toLowerCase()))
    : courses;

  const getSchoolName = (id: string) => schools.find((s: any) => s.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Courses & Bursaries</h1>
          <p className="text-sm text-muted-foreground">{schools.length} institutions · {courses.length} courses</p>
        </div>
      </div>

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses"><GraduationCap className="w-4 h-4 mr-1" /> Courses</TabsTrigger>
          <TabsTrigger value="institutions"><School className="w-4 h-4 mr-1" /> Institutions</TabsTrigger>
          <TabsTrigger value="import"><Upload className="w-4 h-4 mr-1" /> CSV Import</TabsTrigger>
        </TabsList>

        {/* ── Courses Tab ── */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={selectedSchool || "all"} onValueChange={(v) => setSelectedSchool(v === "all" ? null : v)}>
              <SelectTrigger className="w-64"><SelectValue placeholder="All institutions" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Institutions</SelectItem>
                {schools.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {selectedSchool && (
              <Dialog open={showAddCourse} onOpenChange={setShowAddCourse}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" /> Add Course</Button></DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>Add Course</DialogTitle></DialogHeader>
                  <CourseForm schoolId={selectedSchool} onSave={(d) => saveCourse.mutate(d)} onCancel={() => setShowAddCourse(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {!selectedSchool && <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">Select an institution to add courses.</p>}

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60 border-b">
                    <th className="px-3 py-2 text-left font-semibold">#</th>
                    <th className="px-3 py-2 text-left font-semibold">Course</th>
                    {!selectedSchool && <th className="px-3 py-2 text-left font-semibold">Institution</th>}
                    <th className="px-3 py-2 text-right font-semibold">Tuition</th>
                    <th className="px-3 py-2 text-right font-semibold">Functional Fees</th>
                    <th className="px-3 py-2 text-center font-semibold">Duration</th>
                    <th className="px-3 py-2 text-center font-semibold">Type</th>
                    <th className="px-3 py-2 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((c: any, i: number) => (
                    <tr key={c.id} className="border-b hover:bg-muted/20">
                      <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{c.course_name}</td>
                      {!selectedSchool && <td className="px-3 py-2 text-xs text-muted-foreground">{getSchoolName(c.school_id)}</td>}
                      <td className="px-3 py-2 text-right font-mono text-xs">{c.tuition || "—"}</td>
                      <td className="px-3 py-2 text-right font-mono text-xs">{c.functional_fees || "—"}</td>
                      <td className="px-3 py-2 text-center text-xs">{c.duration}</td>
                      <td className="px-3 py-2 text-center">
                        <Badge variant={c.bursary_type === "full" ? "default" : "secondary"} className="text-xs">{c.bursary_type}</Badge>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex gap-1 justify-center">
                          <Dialog>
                            <DialogTrigger asChild><Button variant="ghost" size="sm"><Pencil className="w-3 h-3" /></Button></DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader><DialogTitle>Edit Course</DialogTitle></DialogHeader>
                              <CourseForm initial={c} schoolId={c.school_id} onSave={(d) => saveCourse.mutate({ ...d, id: c.id })} onCancel={() => {}} />
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete this course?")) deleteCourse.mutate(c.id); }}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCourses.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No courses found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ── Institutions Tab ── */}
        <TabsContent value="institutions" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showAddSchool} onOpenChange={setShowAddSchool}>
              <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" /> Add Institution</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Institution</DialogTitle></DialogHeader>
                <InstitutionForm onSave={(d) => saveSchool.mutate(d)} onCancel={() => setShowAddSchool(false)} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {schools.map((s: any) => {
              const count = courses.filter((c: any) => c.school_id === s.id).length;
              return (
                <div key={s.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{s.name}</h3>
                      <p className="text-sm text-muted-foreground">{s.district} · {s.level}</p>
                      <Badge variant="outline" className="mt-2">{count} courses</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild><Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button></DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Edit Institution</DialogTitle></DialogHeader>
                          <InstitutionForm initial={s} onSave={(d) => saveSchool.mutate({ ...d, id: s.id })} onCancel={() => {}} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm(`Delete ${s.name} and all its courses?`)) deleteSchool.mutate(s.id); }}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ── CSV Import Tab ── */}
        <TabsContent value="import">
          <div className="max-w-xl">
            <CSVImporter schools={schools} onDone={() => qc.invalidateQueries({ queryKey: ["admin-courses"] })} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCourses;
