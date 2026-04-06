import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const mimeType = file.type || "application/pdf";

    const response = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Extract the following information from this resume/CV document. Return ONLY a valid JSON object with these exact keys (use empty string "" if not found):

{
  "fullName": "full name",
  "gender": "ذكر or أنثى",
  "nationality": "nationality in Arabic",
  "birthDate": "YYYY-MM-DD format if found",
  "maritalStatus": "أعزب/عزباء or متزوج/ة or مطلق/ة or أرمل/ة",
  "phone": "phone number",
  "email": "email address",
  "currentCity": "city in Arabic",
  "educationLevel": "education level in Arabic (ثانوية, دبلوم, بكالوريوس, ماجستير, دكتوراه)",
  "major": "field of study",
  "university": "university name",
  "graduationYear": "year",
  "gpa": "GPA if found",
  "yearsExperience": "years of experience as Arabic text",
  "currentTitle": "current job title",
  "currentTasks": "brief summary of current tasks",
  "selfSummary": "professional summary",
  "otherExperience": "other experience",
  "arabicLevel": "ممتاز, جيد جداً, جيد, متوسط, or مبتدئ",
  "englishLevel": "ممتاز, جيد جداً, جيد, متوسط, or مبتدئ",
  "otherLanguage": "other languages",
  "linkedin": "LinkedIn URL if found"
}

Return ONLY the JSON, no markdown, no explanation.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to parse resume" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "{}";
    
    // Extract JSON from response (handle potential markdown wrapping)
    let jsonStr = content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonStr);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Parse resume error:", error);
    return new Response(JSON.stringify({ error: "Failed to parse resume" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
