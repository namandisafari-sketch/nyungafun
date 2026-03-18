import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Navigation map for local handling
const NAV_MAP: Record<string, { path: string; description: string }> = {
  "dashboard": { path: "/admin", description: "Dashboard" },
  "applications": { path: "/admin/applications", description: "Applications" },
  "students": { path: "/admin/students", description: "Students" },
  "schools": { path: "/admin/schools", description: "Schools" },
  "payments": { path: "/admin/payments", description: "Payments" },
  "payment history": { path: "/admin/payment-history", description: "Payment History" },
  "payments dashboard": { path: "/admin/payments-dashboard", description: "Payments Dashboard" },
  "receipts": { path: "/admin/receipts", description: "Receipts" },
  "id cards": { path: "/admin/id-cards", description: "ID Cards" },
  "appointments": { path: "/admin/appointments", description: "Appointments" },
  "passport photo": { path: "/admin/passport-photo", description: "Passport Photo" },
  "staff": { path: "/admin/staff", description: "Staff" },
  "attendance": { path: "/admin/attendance", description: "Attendance" },
  "attendance reports": { path: "/admin/attendance-reports", description: "Attendance Reports" },
  "materials": { path: "/admin/materials", description: "Materials" },
  "accounting": { path: "/admin/accounting", description: "Accounting" },
  "bursary requests": { path: "/admin/bursary-requests", description: "Bursary Requests" },
  "batch processing": { path: "/admin/batch-processing", description: "Batch Processing" },
  "security": { path: "/admin/security", description: "Security" },
  "audit logs": { path: "/admin/audit-logs", description: "Audit Logs" },
  "backup": { path: "/admin/backup", description: "Backup" },
  "settings": { path: "/admin/settings", description: "Settings" },
  "photocopying": { path: "/admin/photocopying", description: "Photocopying" },
  "student search": { path: "/admin/student-search", description: "Student Search" },
  "register": { path: "/register", description: "Register New Application" },
};

function detectNavigation(message: string): { path: string; description: string } | null {
  const lower = message.toLowerCase();
  const navPhrases = ["go to", "open", "show me", "navigate to", "take me to"];
  const isNavRequest = navPhrases.some((p) => lower.includes(p));
  if (!isNavRequest) return null;

  for (const [key, value] of Object.entries(NAV_MAP)) {
    if (lower.includes(key)) return value;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const EXTERNAL_AI_URL = Deno.env.get("EXTERNAL_AI_URL");
    const EXTERNAL_AI_TOKEN = Deno.env.get("EXTERNAL_AI_TOKEN");

    if (!EXTERNAL_AI_URL || !EXTERNAL_AI_TOKEN) {
      return new Response(
        JSON.stringify({ error: "AI not configured. Please set EXTERNAL_AI_URL and EXTERNAL_AI_TOKEN." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
    const userMessage = lastUserMsg?.content || "";

    // Check for navigation intent locally
    const navTarget = detectNavigation(userMessage);
    const clientActions: any[] = [];

    if (navTarget) {
      clientActions.push({ type: "navigate", path: navTarget.path, description: navTarget.description });
    }

    // Call external AI API
    const apiUrl = EXTERNAL_AI_URL.replace(/\/+$/, "") + "/user/chat";

    const externalResp = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "nyunga_system",
        token: EXTERNAL_AI_TOKEN,
        user_name: "Nyunga Staff",
        message: userMessage,
      }),
    });

    if (!externalResp.ok) {
      const status = externalResp.status;
      const errData = await externalResp.json().catch(() => ({}));
      const errMsg = errData.response || errData.error || `External AI error (${status})`;
      console.error("External AI error:", status, errMsg);

      if (status === 401) {
        return new Response(
          JSON.stringify({ error: "AI authentication failed. Check your token." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: errMsg }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await externalResp.json();

    if (data.status === "error") {
      return new Response(
        JSON.stringify({ error: data.response || "AI processing failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const content = data.response || "I couldn't generate a response.";

    // If we detected navigation, prepend a note
    let finalContent = content;
    if (navTarget) {
      finalContent = `Navigating you to **${navTarget.description}**.\n\n${content}`;
    }

    return new Response(
      JSON.stringify({
        content: finalContent,
        actions: clientActions,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
