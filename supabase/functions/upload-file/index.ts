import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Magic bytes for allowed file types
const MAGIC_BYTES: Record<string, { bytes: number[]; offset: number }[]> = {
  pdf: [{ bytes: [0x25, 0x50, 0x44, 0x46], offset: 0 }], // %PDF
  jpg: [{ bytes: [0xff, 0xd8, 0xff], offset: 0 }],
  jpeg: [{ bytes: [0xff, 0xd8, 0xff], offset: 0 }],
  png: [{ bytes: [0x89, 0x50, 0x4e, 0x47], offset: 0 }],
  doc: [{ bytes: [0xd0, 0xcf, 0x11, 0xe0], offset: 0 }], // OLE2
  docx: [{ bytes: [0x50, 0x4b, 0x03, 0x04], offset: 0 }], // ZIP (OOXML)
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function getExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function validateMagicBytes(
  buffer: Uint8Array,
  extension: string
): boolean {
  const signatures = MAGIC_BYTES[extension];
  if (!signatures) return false;
  return signatures.some((sig) =>
    sig.bytes.every((b, i) => buffer[sig.offset + i] === b)
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Check file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: "File too large. Maximum size is 10 MB." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Check extension
    const ext = getExtension(file.name);
    const allowedExtensions = ["pdf", "doc", "docx", "jpg", "jpeg", "png"];
    if (!allowedExtensions.includes(ext)) {
      return new Response(
        JSON.stringify({ error: `File type .${ext} is not allowed.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Validate magic bytes
    const arrayBuffer = await file.arrayBuffer();
    const header = new Uint8Array(arrayBuffer.slice(0, 16));
    if (!validateMagicBytes(header, ext)) {
      return new Response(
        JSON.stringify({ error: "File content does not match its extension." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Generate unique path with UUID prefix to prevent collisions
    const uniqueId = crypto.randomUUID();
    const path = `${folder}/${uniqueId}.${ext}`;

    // 5. Upload via service role (bypasses RLS)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase.storage
      .from("resumes")
      .upload(path, arrayBuffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to upload file" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ path }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Upload error:", err);
    return new Response(
      JSON.stringify({ error: "Upload failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
