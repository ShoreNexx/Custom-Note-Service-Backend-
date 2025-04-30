import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // Get Supabase URL and Service Role Key from environment variables
  const supabaseUrl = Deno.env.get("PROJECT_URL");
  const supabaseKey = Deno.env.get("SERVICE_ROLE_KEY");

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Handle GET request
  if (req.method === "GET") {
    // Fetch data from the "notes" table
    const { data, error } = await supabase.from("notes").select("*");

    // Handle errors if any
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the notes data as JSON response
    return new Response(JSON.stringify({ notes: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // If the method is not GET, return "Method not allowed"
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
});
