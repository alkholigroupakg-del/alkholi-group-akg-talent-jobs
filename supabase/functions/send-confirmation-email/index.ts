import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, position } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For now, log the email details. Once email domain is configured,
    // this will be updated to actually send emails.
    console.log(`Confirmation email queued for: ${email}, Name: ${fullName}, Position: ${position}`);

    // TODO: When email domain is set up, integrate with email sending service
    // For now, return success so the flow isn't blocked
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Confirmation email queued",
        note: "Email sending will activate once email domain is configured"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-confirmation-email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process confirmation email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
