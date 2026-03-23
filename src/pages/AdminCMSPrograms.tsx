import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

const iconOptions = ["GraduationCap", "BookOpen", "Shield", "Users", "Briefcase", "Heart", "Star", "Award"];

interface CmsProgram {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlights: string[];
  sort_order: number;
  is_active: boolean;
}

const AdminCMSPrograms = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<CmsProgram | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", icon: "GraduationCap", highlights: "", sort_order: 0, is_active: true });

  const { data: programs, isLoading } = useQuery({
    queryKey: ["cms-programs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_programs").select("*").order("sort_order");
      if (error) throw error;
      return data as CmsProgram[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (p: typeof form & { id?: string }) => {
      const payload = { ...p, highlights: p.highlights.split("\n").map(h => h.trim()).filter(Boolean) };
      if (p.id) {
        const { error } = await supabase.from("cms_programs").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cms_programs").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-programs"] });
      toast.success("Program saved");
      close();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cms_programs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-programs"] });
      toast.success("Program deleted");
    },
  });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", description: "", icon: "GraduationCap", highlights: "", sort_order: (programs?.length || 0), is_active: true });
    setIsOpen(true);
  };

  const openEdit = (p: CmsProgram) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, icon: p.icon, highlights: p.highlights.join("\n"), sort_order: p.sort_order, is_active: p.is_active });
    setIsOpen(true);
  };

  const close = () => { setIsOpen(false); setEditing(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Programs</h1>
          <p className="text-muted-foreground text-sm">Manage foundation programs displayed on the website</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> New Program</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : !programs?.length ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No programs yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {programs.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between py-4 px-5">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{p.title}</h3>
                      <Badge variant={p.is_active ? "default" : "secondary"}>{p.is_active ? "Active" : "Inactive"}</Badge>
                      <Badge variant="outline">{p.icon}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{p.description.substring(0, 80)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(p.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Program" : "New Program"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div>
              <Label>Icon</Label>
              <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{iconOptions.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Highlights (one per line)</Label><Textarea rows={4} value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} placeholder="Nursery to University&#10;Merit-based selection" /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Active</Label></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={close}>Cancel</Button>
              <Button onClick={() => saveMutation.mutate(editing ? { ...form, id: editing.id } : form)} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCMSPrograms;
