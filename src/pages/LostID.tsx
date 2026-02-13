import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle, Phone, AlertTriangle, CreditCard } from "lucide-react";
import nyungaLogo from "@/assets/nyunga-logo.png";

const LostID = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("id");
  const [finderPhone, setFinderPhone] = useState("");
  const [finderName, setFinderName] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [studentName, setStudentName] = useState<string | null>(null);

  useEffect(() => {
    if (applicationId) {
      supabase
        .from("applications")
        .select("student_name")
        .eq("id", applicationId)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setStudentName(data.student_name);
        });
    }
  }, [applicationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finderPhone) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!applicationId) {
      toast.error("Invalid ID card reference");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("lost_id_reports" as any).insert({
      application_id: applicationId,
      finder_phone: finderPhone,
      finder_name: finderName || null,
      notes: notes || null,
    } as any);

    if (error) {
      toast.error("Failed to submit report. Please try again.");
      console.error(error);
    } else {
      setSubmitted(true);
      toast.success("Report submitted! Thank you for your help.");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-10 text-center space-y-4">
            <CheckCircle size={64} className="text-accent mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
            <p className="text-muted-foreground">
              Your report has been submitted. The student's guardian will be contacted to arrange collection of the ID card.
            </p>
            <p className="text-sm text-muted-foreground">
              They may call you at <span className="font-medium text-foreground">{finderPhone}</span> to collect the card.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="py-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <img src={nyungaLogo} alt="Nyunga Logo" className="w-16 h-16 mx-auto rounded-full object-cover" />
            <h1 className="text-2xl font-bold text-foreground">Report Found ID Card</h1>
            <p className="text-sm text-muted-foreground">
              You've found a Nyunga Bursary Scheme student ID card. Please enter your details so we can arrange collection.
            </p>
          </div>

          {studentName && (
            <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
              <CreditCard size={18} className="text-primary shrink-0" />
              <p className="text-sm text-foreground">
                This ID belongs to: <span className="font-semibold">{studentName}</span>
              </p>
            </div>
          )}

          {!applicationId && (
            <div className="bg-destructive/10 rounded-lg p-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-destructive shrink-0" />
              <p className="text-sm text-destructive">Invalid or missing ID reference. The QR code may be damaged.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Your Phone Number *</Label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={finderPhone}
                  onChange={(e) => setFinderPhone(e.target.value)}
                  placeholder="e.g. 0771234567"
                  className="pl-9"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">So the student's family can call you to collect the card.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your Name (optional)</Label>
              <Input
                id="name"
                value={finderName}
                onChange={(e) => setFinderName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Where did you find it? (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Near the market in Kampala"
                rows={2}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !applicationId}
            >
              {submitting ? "Submitting..." : "Report Found ID"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LostID;
