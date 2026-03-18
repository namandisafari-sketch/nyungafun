import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prefix } = await req.json();
    if (!prefix || typeof prefix !== "string") {
      return new Response(
        JSON.stringify({ error: "prefix is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const MEDIA_SERVER_URL = Deno.env.get("MEDIA_SERVER_URL");
    if (!MEDIA_SERVER_URL) {
      return new Response(
        JSON.stringify({ error: "Media server not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const baseUrl = MEDIA_SERVER_URL.replace(/\/+$/, "");
    const resp = await fetch(`${baseUrl}/v1/media/prefix/${encodeURIComponent(prefix)}`);

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ error: errData.message || `Media not found (${resp.status})` }),
        { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await resp.json();
    // Construct full URL
    const fullUrl = baseUrl + data.path + "?t=" + data.timestamp;

    return new Response(
      JSON.stringify({
        url: fullUrl,
        type: data.type,
        path: data.path,
        timestamp: data.timestamp,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Media resolve error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
