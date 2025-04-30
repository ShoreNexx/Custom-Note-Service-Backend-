import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
    const supabaseUrl = Deno.env.get("PROJECT_URL");
    const supabaseKey = Deno.env.get("SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, supabaseKey);

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { title, content } = await req.json();

  if (!title || !content) {
    return new Response(JSON.stringify({ error: "Missing title or content" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data, error } = await supabase
    .from("notes")
    .insert([{ title, content }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ message: "Note added", data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
