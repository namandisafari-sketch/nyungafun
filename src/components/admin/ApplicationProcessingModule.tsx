import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, FileCheck, School, Printer, Receipt, ArrowRight, User, Loader2 } from "lucide-react";
import { generateFullDocumentHTML } from "@/components/admin/PrintableLawyerForm";
import ReceiptPreview from "@/components/admin/ReceiptPreview";

interface IntakeRecord {
  id: string;
  applicant_name: string;
  date_given: string;
  amount_paid: number;
  photo_url: string | null;
  signature_url: string | null;
  status: string;
  linked_application_id: string | null;
}

interface ApplicationRecord {
  id: string;
  student_name: string;
  parent_name: string;
  parent_phone: string;
  education_level: string;
  class_grade: string | null;
  school_id: string | null;
  status: string;
  registration_number: string | null;
  parent_signature_url: string | null;
  student_signature_url: string | null;
  district: string | null;
  father_details: any;
  mother_details: any;
  guardian_details: any;
}

interface SchoolRecord {
  id: string;
  name: string;
  level: string;
  district: string;
  full_fees: number;
  nyunga_covered_fees: number;
  parent_pays: number | null;
  boarding_available: boolean | null;
}

interface LawyerTemplate {
  id: string;
  title: string;
  description: string | null;
  fields: any[];
  is_active: boolean;
}

type SearchResult = {
  type: "intake" | "application";
  id: string;
  name: string;
  photo_url: string | null;
  status: string;
  intake?: IntakeRecord;
  application?: ApplicationRecord;
};

const formatUGX = (amount: number) =>
  new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(amount);

const ApplicationProcessingModule = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [templates, setTemplates] = useState<LawyerTemplate[]>([]);

  // Selected applicant state
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [application, setApplication] = useState<ApplicationRecord | null>(null);

  // Lawyer form dialog
  const [lawyerDialog, setLawyerDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LawyerTemplate | null>(null);
  const [lawyerFormHTML, setLawyerFormHTML] = useState("");

  // Receipt
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const [processing, setProcessing] = useState(false);
  const [staffName, setStaffName] = useState("");

  useEffect(() => {
    loadInitialData();
  }, [user]);

  const loadInitialData = async () => {
    if (!user) return;
    const [schoolsRes, templatesRes, profileRes] = await Promise.all([
      supabase.from("schools").select("*").eq("is_active", true).order("name"),
      supabase.from("lawyer_form_templates").select("*").eq("is_active", true),
      supabase.from("profiles").select("full_name").eq("user_id", user.id).single(),
    ]);
    setSchools((schoolsRes.data as unknown as SchoolRecord[]) || []);
    setTemplates((templatesRes.data as unknown as LawyerTemplate[]) || []);
    if (profileRes.data?.full_name) setStaffName(profileRes.data.full_name);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    setSelected(null);
    setApplication(null);

    const term = searchTerm.trim().toLowerCase();

    const [intakeRes, appRes] = await Promise.all([
      supabase.from("form_intake").select("*").ilike("applicant_name", `%${term}%`).order("created_at", { ascending: false }).limit(20),
      supabase.from("applications").select("*").ilike("student_name", `%${term}%`).order("created_at", { ascending: false }).limit(20),
    ]);

    const results: SearchResult[] = [];

    ((intakeRes.data as unknown as IntakeRecord[]) || []).forEach((r) => {
      results.push({
        type: "intake",
        id: r.id,
        name: r.applicant_name,
        photo_url: r.photo_url,
        status: r.status,
        intake: r,
      });
    });

    ((appRes.data as unknown as ApplicationRecord[]) || []).forEach((r) => {
      // Skip if already linked from intake
      if (!results.some((sr) => sr.type === "intake" && sr.intake?.linked_application_id === r.id)) {
        results.push({
          type: "application",
          id: r.id,
          name: r.student_name,
          photo_url: null,
          status: r.status,
          application: r,
        });
      }
    });

    setSearchResults(results);
    setSearching(false);
  };

  const selectApplicant = async (result: SearchResult) => {
    setSelected(result);

    if (result.type === "application" && result.application) {
      setApplication(result.application);
      setSelectedSchoolId(result.application.school_id || "");
    } else if (result.type === "intake" && result.intake?.linked_application_id) {
      // Load linked application
      const { data } = await supabase
        .from("applications")
        .select("*")
        .eq("id", result.intake.linked_application_id)
        .single();
      if (data) {
        setApplication(data as unknown as ApplicationRecord);
        setSelectedSchoolId((data as any).school_id || "");
      }
    } else {
      setApplication(null);
      setSelectedSchoolId("");
    }
  };

  const assignSchool = async () => {
    if (!application || !selectedSchoolId) {
      toast.error("Please select a school");
      return;
    }
    setProcessing(true);
    const { error } = await supabase
      .from("applications")
      .update({ school_id: selectedSchoolId } as any)
      .eq("id", application.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("School assigned successfully");
      setApplication({ ...application, school_id: selectedSchoolId });
    }
    setProcessing(false);
  };

  const generateLawyerForm = (template: LawyerTemplate) => {
    if (!application) {
      toast.error("No application selected");
      return;
    }

    const school = schools.find((s) => s.id === (application.school_id || selectedSchoolId));
    const now = new Date().toISOString();

    // Pre-fill lawyer form responses from application data
    const prefilled: Record<string, any> = {
      student_name: application.student_name,
      parent_name: application.parent_name,
      parent_of: application.student_name,
      parent_phone: application.parent_phone,
      parent_contact: application.parent_phone,
      school_name: school?.name || "",
      parent_district: application.district || "",
      application_number: application.registration_number || "",
      agreement_day: new Date().getDate().toString(),
      agreement_month: new Date().toLocaleString("en", { month: "long" }),
      agreement_year: new Date().getFullYear().toString().slice(-1),
      functional_fees: school?.parent_pays ? formatUGX(school.parent_pays) : "",
      medical_fees: "",
      bursary_duration: "",
      student_name_sign: application.student_name,
      student_contact: "",
      director_name: "",
      director_contact: "",
    };

    // Try to extract parent info from father/mother details
    if (application.father_details) {
      const fd = typeof application.father_details === "string" ? JSON.parse(application.father_details) : application.father_details;
      if (!prefilled.parent_name || prefilled.parent_name === "N/A") {
        prefilled.parent_name = fd.name || prefilled.parent_name;
      }
      if (!prefilled.parent_phone || prefilled.parent_phone === "N/A") {
        prefilled.parent_phone = fd.telephone || prefilled.parent_phone;
        prefilled.parent_contact = fd.telephone || prefilled.parent_contact;
      }
    }

    const html = generateFullDocumentHTML(template.id, prefilled, application.parent_signature_url || null, now);
    if (html) {
      setLawyerFormHTML(html);
    } else {
      // Fallback: generate simple field listing
      let fallbackHtml = `<div style="font-family:serif;padding:40px 50px;max-width:210mm;margin:0 auto">`;
      fallbackHtml += `<h2 style="text-align:center">${template.title}</h2>`;
      template.fields.forEach((f: any) => {
        const val = prefilled[f.id] || prefilled[f.label?.toLowerCase().replace(/\s+/g, "_")] || "";
        fallbackHtml += `<p><strong>${f.label}:</strong> <span style="border-bottom:1px dotted #000;display:inline-block;min-width:200px;padding:0 4px">${val || "&nbsp;"}</span></p>`;
      });
      fallbackHtml += `</div>`;
      setLawyerFormHTML(fallbackHtml);
    }

    setSelectedTemplate(template);
    setLawyerDialog(true);
  };

  const printLawyerForm = () => {
    const printWindow = window.open("", "_blank", "width=800,height=1000");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Lawyer Form</title>
      <style>@page{size:A4;margin:10mm}body{margin:0;padding:0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
      </head><body onload="setTimeout(()=>{window.print();},500)">
      ${lawyerFormHTML}
      </body></html>
    `);
    printWindow.document.close();
  };

  const issueReceipt = (type: "application" | "lawyer" | "combined") => {
    if (!application) return;
    const school = schools.find((s) => s.id === (application.school_id || selectedSchoolId));
    const intakeAmount = selected?.intake?.amount_paid || 0;

    const appFee = type === "lawyer" ? 0 : intakeAmount || 5000;
    const lawyerFee = type === "application" ? 0 : 10000;

    setReceiptData({
      receiptNo: `RCP-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toLocaleDateString("en-UG"),
      studentName: application.student_name,
      level: application.education_level || "N/A",
      classGrade: application.class_grade,
      schoolName: school?.name || "Not assigned",
      parentName: application.parent_name,
      parentPhone: application.parent_phone,
      paymentCode: null,
      isVerified: true,
      applicationFormFee: appFee,
      lawyerFormFee: lawyerFee,
      totalFees: appFee + lawyerFee,
      orgName: "NYUNGA FOUNDATION",
      orgAddress: "Katwe, Byandala Building",
      orgPhone: "0746960654",
      orgEmail: "nyungafoundation@gmail.com",
      logoText: "NF",
      footerNote: "This receipt confirms payment for bursary application processing. Keep for your records.",
      signatureName: staffName || "Staff",
      signatureTitle: "Processing Officer",
      seasonalRemark: "",
      qrData: `nyunga:receipt:${application.id}:${Date.now()}`,
      appId: application.id,
    });
    setReceiptOpen(true);
  };

  const selectedSchool = schools.find((s) => s.id === selectedSchoolId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileCheck className="h-6 w-6 text-primary" />
          Application Processing
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search applicant → Assign school → Generate lawyer forms → Issue receipts
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-4">
          <Label className="text-sm font-medium mb-2 block">Search Applicant by Name</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter name used during form intake or registration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-8"
              />
            </div>
            <Button onClick={handleSearch} disabled={searching || !searchTerm.trim()}>
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground">{searchResults.length} result(s) found</p>
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {searchResults.map((r) => (
                  <div
                    key={`${r.type}-${r.id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selected?.id === r.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => selectApplicant(r)}
                  >
                    {r.photo_url ? (
                      <img src={r.photo_url} alt={r.name} className="w-10 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-12 bg-muted rounded flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.type === "intake" ? "From Form Intake" : "Existing Application"}
                        {r.type === "application" && r.application?.registration_number && ` • ${r.application.registration_number}`}
                      </p>
                    </div>
                    <Badge variant={r.status === "approved" ? "default" : r.status === "pending" ? "secondary" : "outline"} className="text-xs">
                      {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.length === 0 && searchTerm && !searching && (
            <p className="text-sm text-muted-foreground mt-3 text-center">No applicants found matching "{searchTerm}"</p>
          )}
        </CardContent>
      </Card>

      {/* Selected Applicant Processing */}
      {selected && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* School Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <School className="h-4 w-4 text-primary" />
                Assign School
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application ? (
                <>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Student:</span> <strong>{application.student_name}</strong></p>
                    <p><span className="text-muted-foreground">Level:</span> {application.education_level}</p>
                    <p><span className="text-muted-foreground">Parent:</span> {application.parent_name}</p>
                    {application.registration_number && (
                      <p><span className="text-muted-foreground">Reg No:</span> {application.registration_number}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Select School</Label>
                    <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose school..." />
                      </SelectTrigger>
                      <SelectContent>
                        {schools
                          .filter((s) => !application.education_level || s.level === application.education_level || true)
                          .map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name} ({s.level}) - {s.district}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSchool && (
                    <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-1">
                      <p><strong>{selectedSchool.name}</strong></p>
                      <p>Full Fees: {formatUGX(selectedSchool.full_fees)}</p>
                      <p>Nyunga Covers: {formatUGX(selectedSchool.nyunga_covered_fees)}</p>
                      <p>Parent Pays: {formatUGX(selectedSchool.parent_pays || 0)}</p>
                    </div>
                  )}

                  {selectedSchoolId && selectedSchoolId !== application.school_id && (
                    <Button onClick={assignSchool} disabled={processing} className="w-full gap-2">
                      {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                      Save School Assignment
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  <p>This intake record doesn't have a linked application yet.</p>
                  <p className="text-xs mt-1">The application data must be entered first before processing.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions: Lawyer Forms & Receipts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Processing Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Lawyer Forms */}
              {application && templates.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Generate Lawyer Form (Pre-filled PDF)</Label>
                  <div className="grid gap-2">
                    {templates.map((t) => (
                      <Button
                        key={t.id}
                        variant="outline"
                        size="sm"
                        className="justify-start gap-2 h-auto py-2"
                        onClick={() => generateLawyerForm(t)}
                        disabled={!application.school_id && !selectedSchoolId}
                      >
                        <Printer className="h-4 w-4 text-primary" />
                        <div className="text-left">
                          <p className="text-sm font-medium">{t.title}</p>
                          {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                        </div>
                      </Button>
                    ))}
                  </div>
                  {!application.school_id && !selectedSchoolId && (
                    <p className="text-xs text-destructive">Assign a school first to generate lawyer forms</p>
                  )}
                </div>
              )}

              {/* Receipts */}
              {application && (
                <div className="space-y-2 border-t border-border pt-4">
                  <Label className="text-sm font-medium">Issue Receipts</Label>
                  <div className="grid gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start gap-2"
                      onClick={() => issueReceipt("application")}
                    >
                      <Receipt className="h-4 w-4 text-primary" />
                      Application Form Receipt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start gap-2"
                      onClick={() => issueReceipt("lawyer")}
                    >
                      <Receipt className="h-4 w-4 text-primary" />
                      Lawyer Form Receipt
                    </Button>
                    <Button
                      size="sm"
                      className="justify-start gap-2"
                      onClick={() => issueReceipt("combined")}
                    >
                      <Receipt className="h-4 w-4" />
                      Combined Receipt (Both)
                    </Button>
                  </div>
                </div>
              )}

              {!application && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Select an applicant with entered application data to process.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lawyer Form Print Dialog */}
      <Dialog open={lawyerDialog} onOpenChange={setLawyerDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedTemplate?.title} — Pre-filled</span>
              <Button onClick={printLawyerForm} className="gap-2">
                <Printer className="h-4 w-4" /> Print
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg overflow-hidden bg-white">
            <div dangerouslySetInnerHTML={{ __html: lawyerFormHTML }} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Preview */}
      <ReceiptPreview open={receiptOpen} onClose={() => setReceiptOpen(false)} data={receiptData} />
    </div>
  );
};

export default ApplicationProcessingModule;
