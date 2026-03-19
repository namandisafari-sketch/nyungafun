import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Camera, Plus, ClipboardList, UserCheck, Search, Loader2 } from "lucide-react";
import SignaturePad from "@/components/register/SignaturePad";

interface IntakeRecord {
  id: string;
  applicant_name: string;
  date_given: string;
  amount_paid: number;
  photo_url: string | null;
  signature_url: string | null;
  registered_by: string;
  registered_by_name: string | null;
  status: string;
  linked_application_id: string | null;
  notes: string | null;
  created_at: string;
}

const formatUGX = (amount: number) =>
  new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(amount);

const FormIntakeModule = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<IntakeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [staffName, setStaffName] = useState("");

  // Form fields
  const [applicantName, setApplicantName] = useState("");
  const [dateGiven, setDateGiven] = useState(new Date().toISOString().split("T")[0]);
  const [amountPaid, setAmountPaid] = useState("");
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    fetchRecords();
    fetchStaffName();
  }, [user]);

  const fetchStaffName = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .single();
    if (data?.full_name) setStaffName(data.full_name);
  };

  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from("form_intake")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast.error("Failed to load intake records");
    } else {
      setRecords((data as unknown as IntakeRecord[]) || []);
    }
    setLoading(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 413, height: 531 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCapturing(true);
    } catch {
      toast.error("Could not access camera");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 413;
    canvas.height = 531;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, 413, 531);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPhotoUrl(dataUrl);
    stopCamera();
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCapturing(false);
  };

  const uploadPhoto = async (dataUrl: string): Promise<string | null> => {
    if (!user) return null;
    const blob = await (await fetch(dataUrl)).blob();
    const filename = `intake/${user.id}/${Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from("application-documents")
      .upload(filename, blob, { contentType: "image/jpeg" });
    if (error) {
      toast.error("Photo upload failed");
      return null;
    }
    const { data: urlData } = supabase.storage.from("application-documents").getPublicUrl(filename);
    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!user || !applicantName.trim()) {
      toast.error("Please enter the applicant's name");
      return;
    }
    setSubmitting(true);
    try {
      let finalPhotoUrl: string | null = null;
      if (photoUrl) {
        finalPhotoUrl = await uploadPhoto(photoUrl);
      }

      const { error } = await supabase.from("form_intake").insert({
        applicant_name: applicantName.trim(),
        date_given: dateGiven,
        amount_paid: parseFloat(amountPaid) || 0,
        photo_url: finalPhotoUrl,
        signature_url: signatureUrl || null,
        registered_by: user.id,
        registered_by_name: staffName || user.email,
        notes: notes.trim() || null,
        status: "pending",
      });

      if (error) throw error;
      toast.success(`${applicantName} registered successfully`);
      resetForm();
      setDialogOpen(false);
      fetchRecords();
    } catch (err: any) {
      toast.error(err.message || "Failed to register");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setApplicantName("");
    setDateGiven(new Date().toISOString().split("T")[0]);
    setAmountPaid("");
    setNotes("");
    setPhotoUrl("");
    setSignatureUrl("");
    stopCamera();
  };

  const filtered = records.filter((r) =>
    r.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.registered_by_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = records.filter((r) => r.status === "pending").length;
  const enteredCount = records.filter((r) => r.status === "entered").length;

  if (loading) {
    return <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Form Distribution & Intake
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Register applicants when distributing forms • Staff: <strong>{staffName || user?.email}</strong>
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { resetForm(); } }}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" /> Register Applicant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Applicant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="applicantName">Full Name of Applicant *</Label>
                <Input
                  id="applicantName"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Nakato Grace"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateGiven">Date</Label>
                  <Input id="dateGiven" type="date" value={dateGiven} onChange={(e) => setDateGiven(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amountPaid">Amount Paid (UGX)</Label>
                  <Input
                    id="amountPaid"
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Photo capture */}
              <div className="space-y-2">
                <Label>Applicant Photo</Label>
                {photoUrl ? (
                  <div className="flex items-center gap-3">
                    <img src={photoUrl} alt="Applicant" className="w-20 h-24 object-cover rounded border" />
                    <Button variant="outline" size="sm" onClick={() => { setPhotoUrl(""); startCamera(); }}>
                      Retake
                    </Button>
                  </div>
                ) : capturing ? (
                  <div className="space-y-2">
                    <video ref={videoRef} className="w-full max-w-[240px] rounded border bg-muted" autoPlay muted playsInline />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={capturePhoto} className="gap-1">
                        <Camera className="h-3 w-3" /> Capture
                      </Button>
                      <Button size="sm" variant="outline" onClick={stopCamera}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={startCamera} className="gap-1">
                    <Camera className="h-4 w-4" /> Open Camera
                  </Button>
                )}
              </div>

              {/* Signature */}
              <div className="space-y-2">
                <Label>Applicant Signature</Label>
                <SignaturePad
                  label="Applicant"
                  userId={user?.id || ""}
                  value={signatureUrl}
                  onChange={(url) => setSignatureUrl(url)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes..."
                  rows={2}
                />
              </div>

              <Button onClick={handleSubmit} disabled={submitting || !applicantName.trim()} className="w-full gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                {submitting ? "Registering..." : "Register & Issue Form"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-foreground">{records.length}</p>
            <p className="text-xs text-muted-foreground">Total Issued</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-destructive">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending Entry</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{enteredCount}</p>
            <p className="text-xs text-muted-foreground">Data Entered</p>
          </CardContent>
        </Card>
      </div>

      {/* Search + Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg">Intake Queue</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Applicant Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Registered By</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {searchTerm ? "No matching records" : "No forms distributed yet. Click 'Register Applicant' to start."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        {r.photo_url ? (
                          <img src={r.photo_url} alt={r.applicant_name} className="w-10 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{r.applicant_name}</TableCell>
                      <TableCell className="text-sm">{r.date_given}</TableCell>
                      <TableCell className="text-sm">{formatUGX(r.amount_paid)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.registered_by_name || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === "entered" ? "default" : "secondary"}>
                          {r.status === "pending" ? "Pending Entry" : r.status === "entered" ? "Entered" : r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormIntakeModule;
