import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search, PlusCircle, Loader2, Banknote, TrendingUp, Users, Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: string;
  application_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  term: string;
  year: string;
  description: string;
  created_at: string;
  applications?: { student_name: string; parent_name: string; parent_phone: string };
}

const AdminPaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [form, setForm] = useState({
    application_id: "",
    amount: "",
    payment_method: "cash",
    payment_date: new Date().toISOString().split("T")[0],
    term: "",
    year: new Date().getFullYear().toString(),
    description: "",
  });

  const fetchPayments = async () => {
    const { data } = await supabase
      .from("parent_payments")
      .select("*, applications(student_name, parent_name, parent_phone)")
      .order("payment_date", { ascending: false });
    setPayments((data as unknown as Payment[]) || []);
    setLoading(false);
  };

  const fetchApplications = async () => {
    const { data } = await supabase
      .from("applications")
      .select("id, student_name, parent_name")
      .order("student_name");
    setApplications(data || []);
  };

  useEffect(() => {
    fetchPayments();
    fetchApplications();
  }, []);

  const handleSave = async () => {
    if (!form.application_id || !form.amount) {
      toast.error("Select a student and enter amount");
      return;
    }
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("parent_payments").insert({
      application_id: form.application_id,
      amount: parseFloat(form.amount),
      payment_method: form.payment_method,
      payment_date: form.payment_date,
      term: form.term,
      year: form.year,
      description: form.description,
      recorded_by: userData.user?.id,
    } as any);

    if (error) toast.error(error.message);
    else {
      toast.success("Payment recorded!");
      setDialogOpen(false);
      setForm({
        application_id: "",
        amount: "",
        payment_method: "cash",
        payment_date: new Date().toISOString().split("T")[0],
        term: "",
        year: new Date().getFullYear().toString(),
        description: "",
      });
      fetchPayments();
    }
    setSaving(false);
  };

  const filtered = payments.filter((p) => {
    const matchesSearch =
      !search ||
      p.applications?.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.applications?.parent_name?.toLowerCase().includes(search.toLowerCase());
    const matchesYear = filterYear === "all" || p.year === filterYear;
    return matchesSearch && matchesYear;
  });

  const totalAmount = filtered.reduce((sum, p) => sum + Number(p.amount), 0);
  const uniqueParents = new Set(filtered.map((p) => p.application_id)).size;
  const years = [...new Set(payments.map((p) => p.year).filter(Boolean))].sort().reverse();

  if (loading)
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Banknote className="h-6 w-6 text-primary" /> Payment History
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle size={16} /> Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record Parent Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label>Student</Label>
                <Select
                  value={form.application_id}
                  onValueChange={(v) => setForm({ ...form, application_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.student_name} — {a.parent_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Amount (UGX)</Label>
                  <Input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Method</Label>
                  <Select
                    value={form.payment_method}
                    onValueChange={(v) =>
                      setForm({ ...form, payment_method: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={form.payment_date}
                    onChange={(e) =>
                      setForm({ ...form, payment_date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Term</Label>
                  <Select
                    value={form.term}
                    onValueChange={(v) => setForm({ ...form, term: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Term 1">Term 1</SelectItem>
                      <SelectItem value="Term 2">Term 2</SelectItem>
                      <SelectItem value="Term 3">Term 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Year</Label>
                  <Input
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="e.g. School fees Term 1"
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full gap-2"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <PlusCircle size={16} />
                )}
                Save Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Collected</p>
              <p className="text-lg font-bold text-foreground">
                UGX {totalAmount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Students Paid</p>
              <p className="text-lg font-bold text-foreground">{uniqueParents}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Records</p>
              <p className="text-lg font-bold text-foreground">
                {filtered.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative max-w-xs flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student or parent..."
            className="pl-9"
          />
        </div>
        <Select value={filterYear} onValueChange={setFilterYear}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {p.applications?.student_name || "—"}
                  </TableCell>
                  <TableCell>{p.applications?.parent_name || "—"}</TableCell>
                  <TableCell className="font-semibold">
                    UGX {Number(p.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-xs">
                      {p.payment_method?.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.term || "—"}</TableCell>
                  <TableCell>
                    {new Date(p.payment_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate">
                    {p.description || "—"}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No payments recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPaymentHistory;
