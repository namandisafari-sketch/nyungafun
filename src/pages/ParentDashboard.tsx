import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clock, CheckCircle, XCircle, AlertCircle, FileCheck, Send, Search, ThumbsUp, Ban } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ParentLawyerForms from "@/components/parent/ParentLawyerForms";

interface Application {
  id: string;
  student_name: string;
  education_level: string;
  status: string;
  created_at: string;
  admin_notes: string | null;
  school_id: string | null;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  term: string;
  created_at: string;
}

const levelLabels: Record<string, string> = {
  nursery: "Nursery", primary: "Primary", secondary_o: "O-Level", secondary_a: "A-Level", vocational: "Vocational", university: "University",
};

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-yellow-100 text-yellow-800", label: "Pending" },
  under_review: { icon: AlertCircle, color: "bg-blue-100 text-blue-800", label: "Under Review" },
  approved: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Approved" },
  rejected: { icon: XCircle, color: "bg-red-100 text-red-800", label: "Rejected" },
};

const formatUGX = (amount: number) =>
  new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(amount);

const ParentDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [expenses, setExpenses] = useState<Record<string, Expense[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data: apps } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const appList = (apps as unknown as Application[]) || [];
      setApplications(appList);

      // Fetch expenses for approved apps
      const approvedIds = appList.filter((a) => a.status === "approved").map((a) => a.id);
      if (approvedIds.length > 0) {
        const { data: expData } = await supabase
          .from("expenses")
          .select("*")
          .in("application_id", approvedIds)
          .order("created_at", { ascending: false });

        const grouped: Record<string, Expense[]> = {};
        ((expData as unknown as (Expense & { application_id: string })[]) || []).forEach((exp) => {
          if (!grouped[exp.application_id]) grouped[exp.application_id] = [];
          grouped[exp.application_id].push(exp);
        });
        setExpenses(grouped);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (authLoading || loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="py-10 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">My Applications</h1>
            <p className="text-muted-foreground">Track the status of your scholarship applications</p>
          </div>
          <Link to="/register">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
              <PlusCircle size={18} /> New Application
            </Button>
          </Link>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">You haven't submitted any applications yet.</p>
              <Link to="/register">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Apply Now</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const sc = statusConfig[app.status] || statusConfig.pending;
              const StatusIcon = sc.icon;
              const appExpenses = expenses[app.id] || [];
              const totalSpent = appExpenses.reduce((s, e) => s + e.amount, 0);

              return (
                <Card key={app.id} className="overflow-hidden">
                  <CardContent className="py-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{app.student_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {levelLabels[app.education_level] || app.education_level} • Applied {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${sc.color} gap-1`}>
                        <StatusIcon size={14} /> {sc.label}
                      </Badge>
                    </div>

                    {/* Enhanced Status Tracker */}
                    {(() => {
                      const steps = [
                        { key: "submitted", label: "Submitted", icon: Send, desc: "Application received" },
                        { key: "pending", label: "Pending Review", icon: Clock, desc: "Awaiting admin review" },
                        { key: "under_review", label: "Under Review", icon: Search, desc: "Being evaluated" },
                        { key: "approved", label: "Approved", icon: ThumbsUp, desc: "Scholarship granted" },
                      ];
                      const statusOrder = ["submitted", "pending", "under_review", "approved"];
                      const isRejected = app.status === "rejected";
                      // "submitted" is always reached; map app.status to step index
                      const currentIdx = isRejected ? 2 : Math.max(statusOrder.indexOf(app.status), 0) + 1;

                      return (
                        <div className="bg-muted/30 rounded-lg p-4 mb-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Application Progress</p>
                          <div className="relative">
                            {steps.map((step, i) => {
                              const reached = i < currentIdx && !isRejected;
                              const isCurrent = i === currentIdx - 1 && !isRejected;
                              const StepIcon = step.icon;

                              return (
                                <div key={step.key} className="flex items-start gap-3 relative">
                                  {/* Vertical line */}
                                  {i < steps.length - 1 && (
                                    <div className={`absolute left-[15px] top-[30px] w-0.5 h-[calc(100%-6px)] ${reached ? "bg-accent" : isRejected && i < 2 ? "bg-destructive/40" : "bg-border"}`} />
                                  )}
                                  {/* Icon circle */}
                                  <div className={`relative z-10 flex items-center justify-center w-[30px] h-[30px] rounded-full shrink-0 border-2 transition-all ${
                                    reached || isCurrent
                                      ? isRejected ? "border-destructive bg-destructive/10 text-destructive" : "border-accent bg-accent/10 text-accent"
                                      : "border-border bg-background text-muted-foreground"
                                  }`}>
                                    {reached ? <CheckCircle size={16} /> : <StepIcon size={14} />}
                                  </div>
                                  {/* Label */}
                                  <div className={`pb-5 ${isCurrent ? "" : ""}`}>
                                    <p className={`text-sm font-medium ${reached || isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                                      {step.label}
                                      {isCurrent && <span className="ml-2 text-xs text-accent font-normal">← Current</span>}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Rejected step (shown only if rejected) */}
                            {isRejected && (
                              <div className="flex items-start gap-3 relative">
                                <div className="relative z-10 flex items-center justify-center w-[30px] h-[30px] rounded-full shrink-0 border-2 border-destructive bg-destructive/10 text-destructive">
                                  <Ban size={16} />
                                </div>
                                <div className="pb-2">
                                  <p className="text-sm font-medium text-destructive">
                                    Rejected <span className="ml-2 text-xs font-normal">← Final</span>
                                  </p>
                                  <p className="text-xs text-muted-foreground">Application was not approved</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {app.admin_notes && (
                      <div className="bg-muted/50 rounded-md p-3 mb-3 border border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-1">📝 Admin Notes:</p>
                        <p className="text-sm text-foreground">{app.admin_notes}</p>
                      </div>
                    )}

                    {app.status === "approved" && appExpenses.length > 0 && (
                      <div className="border-t border-border pt-3 mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-foreground">💰 Expenses Recorded</p>
                          <p className="text-sm font-semibold text-secondary">Total: {formatUGX(totalSpent)}</p>
                        </div>
                        <div className="space-y-1">
                          {appExpenses.map((exp) => (
                            <div key={exp.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{exp.description} {exp.term && `(${exp.term})`}</span>
                              <span className="text-foreground">{formatUGX(exp.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Legal Forms Section */}
        <div className="mt-8">
          <ParentLawyerForms />
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
