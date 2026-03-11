import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const email = "nyunga@outlook.com";
    const password = "123456";

    // Create user
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Nyunga Admin" },
    });

    if (createError) {
      // If user already exists, find them
      if (createError.message.includes("already")) {
        const { data: { users } } = await adminClient.auth.admin.listUsers();
        const existing = users?.find((u: any) => u.email === email);
        if (existing) {
          // Ensure admin role
          await adminClient.from("user_roles").upsert(
            { user_id: existing.id, role: "admin" },
            { onConflict: "user_id,role" }
          );
          return new Response(JSON.stringify({ success: true, user_id: existing.id, note: "existing user, admin role ensured" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = newUser.user.id;

    // Update the auto-created 'parent' role to 'admin'
    const { error: updateError } = await adminClient
      .from("user_roles")
      .update({ role: "admin" })
      .eq("user_id", userId);

    // If no parent role was created by trigger, insert admin role
    if (updateError) {
      await adminClient.from("user_roles").insert({ user_id: userId, role: "admin" });
    }

    return new Response(JSON.stringify({ success: true, user_id: userId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
