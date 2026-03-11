const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_GATEWAY_RETRIES = 6;
const BASE_DELAY_MS = 1500;
const MAX_DELAY_MS = 25000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function extractRetryAfterMs(rawError: string): number | null {
  try {
    const parsed = JSON.parse(rawError);

    if (typeof parsed?.retry_after_ms === "number" && Number.isFinite(parsed.retry_after_ms)) {
      return Math.max(0, parsed.retry_after_ms);
    }

    if (typeof parsed?.retry_after === "number" && Number.isFinite(parsed.retry_after)) {
      return Math.max(0, parsed.retry_after * 1000);
    }
  } catch (_) {
    // Ignore parse errors and use fallback backoff
  }

  return null;
}

function computeRetryDelayMs(attempt: number, retryAfterMs: number | null): number {
  if (retryAfterMs && retryAfterMs > 0) {
    return retryAfterMs + Math.floor(Math.random() * 700);
  }

  const backoff = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * Math.pow(2, attempt));
  return backoff + Math.floor(Math.random() * 700);
}

async function callGatewayWithRetry(payload: Record<string, unknown>) {
  let lastStatus = 500;
  let lastErrorText = "AI request failed";

  for (let attempt = 0; attempt <= MAX_GATEWAY_RETRIES; attempt++) {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      return { ok: true as const, data };
    }

    const errText = await response.text();
    lastStatus = response.status;
    lastErrorText = errText;

    const isRetryable = response.status === 429 || response.status >= 500;
    const shouldRetry = isRetryable && attempt < MAX_GATEWAY_RETRIES;

    if (!shouldRetry) {
      break;
    }

    const retryAfterMs = extractRetryAfterMs(errText);
    const waitMs = computeRetryDelayMs(attempt, retryAfterMs);

    console.warn(
      `AI gateway ${response.status}; retrying in ${waitMs}ms (attempt ${attempt + 1}/${MAX_GATEWAY_RETRIES + 1})`
    );

    await sleep(waitMs);
  }

  return { ok: false as const, status: lastStatus, errorText: lastErrorText };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) throw new Error("imageBase64 is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const gatewayResult = await callGatewayWithRetry({
      model: "google/gemini-2.5-flash-lite",
      messages: [
        {
          role: "system",
          content:
            "You are an OCR specialist. You will receive an image snippet from a bursary application form showing the STUDENT'S APPLICATION NO area. Extract ONLY the application number (typically a 5-digit number like 20176). Return ONLY the number. If unreadable, return UNREADABLE.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the application number from this image snippet of a bursary application form.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "extract_application_number",
            description: "Extract the application number from the scanned image",
            parameters: {
              type: "object",
              properties: {
                application_number: {
                  type: "string",
                  description: "The extracted application number (digits only), or UNREADABLE",
                },
                confidence: {
                  type: "number",
                  description: "Confidence level from 0 to 100",
                },
              },
              required: ["application_number", "confidence"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "extract_application_number" } },
    });

    if (!gatewayResult.ok) {
      console.error("AI gateway error:", gatewayResult.status, gatewayResult.errorText);

      if (gatewayResult.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again shortly.", retry_after_ms: 5000 }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (gatewayResult.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please top up." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error("AI gateway error: " + gatewayResult.errorText);
    }

    const data = gatewayResult.data;
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const args = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify({
          application_number: args.application_number,
          confidence: args.confidence,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const content = data.choices?.[0]?.message?.content || "";
    const match = content.match(/\d{4,6}/);
    return new Response(
      JSON.stringify({
        application_number: match ? match[0] : "UNREADABLE",
        confidence: match ? 60 : 0,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("OCR error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
