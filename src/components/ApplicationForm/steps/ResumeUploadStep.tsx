import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, FileUp, PenLine } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import FormField from "../FormField";
import { useFieldConfig } from "@/hooks/useFieldConfig";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onFileChange: (name: string, file: File | null) => void;
  onAutoFill?: (fields: Record<string, string>) => void;
  onSkip: () => void;
}

const ResumeUploadStep = ({ data, onChange, onFileChange, onAutoFill, onSkip }: Props) => {
  const { t, lang } = useLanguage();
  const fc = useFieldConfig();
  const [isParsing, setIsParsing] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const show = fc.isVisible;
  const req = fc.isRequired;
  const lbl = (name: string, fallback: string) => fc.getLabel(name, lang, fallback);

  const handleResumeUpload = async (name: string, file: File | null) => {
    onFileChange(name, file);
    if (!file || !onAutoFill) return;
    setUploaded(true);

    if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
      toast.info(lang === "ar" ? "التعبئة التلقائية تدعم ملفات PDF فقط. يرجى تعبئة الحقول يدوياً" : "Auto-fill supports PDF files only. Please fill fields manually.");
      return;
    }

    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-resume`,
        {
          method: "POST",
          headers: {
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            ...(session?.access_token ? { "Authorization": `Bearer ${session.access_token}` } : {}),
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Parse failed");
      const parsed = await res.json();
      if (parsed.error) throw new Error(parsed.error);
      const fieldsToFill: Record<string, string> = {};
      Object.entries(parsed).forEach(([key, value]) => {
        if (value && typeof value === "string" && value.trim()) fieldsToFill[key] = value.trim();
      });
      if (Object.keys(fieldsToFill).length > 0) {
        onAutoFill(fieldsToFill);
        toast.success(lang === "ar" ? `تم استخراج ${Object.keys(fieldsToFill).length} حقل تلقائياً ✨` : `Auto-filled ${Object.keys(fieldsToFill).length} fields ✨`);
      } else {
        toast.info(lang === "ar" ? "لم يتم العثور على بيانات قابلة للاستخراج" : "No extractable data found");
      }
    } catch {
      toast.error(lang === "ar" ? "تعذر استخراج البيانات. يرجى تعبئتها يدوياً" : "Could not extract data. Please fill manually.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-2">
        {lang === "ar" ? "كيف تريد التقديم؟" : "How would you like to apply?"}
      </h3>

      {/* ATS Quick Apply Card */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/30 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <p className="font-bold text-foreground text-base">
              {lang === "ar" ? "التقديم السريع بالذكاء الاصطناعي" : "Quick Apply with AI"}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              {lang === "ar"
                ? "ارفع سيرتك الذاتية (PDF) وسنقوم بتعبئة البيانات تلقائياً — الاسم، الخبرات، التعليم وغيرها"
                : "Upload your resume (PDF) and we'll auto-fill your details — name, experience, education and more"}
            </p>
          </div>
        </div>

        <div className="relative">
          <FormField
            label={lbl("resume", lang === "ar" ? "السيرة الذاتية" : "Resume/CV")}
            name="resume"
            type="file"
            required={show("resume") ? req("resume") : false}
            value=""
            onChange={onChange}
            onFileChange={(name, file) => handleResumeUpload(name, file)}
            accept=".pdf,.doc,.docx"
          />
          {isParsing && (
            <div className="mt-3 flex items-center gap-2 text-accent text-sm font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              {lang === "ar" ? "جاري تحليل السيرة الذاتية واستخراج البيانات..." : "Analyzing resume and extracting data..."}
            </div>
          )}
          {uploaded && !isParsing && (
            <p className="mt-2 text-xs text-muted-foreground">
              {lang === "ar" ? "✓ تم رفع السيرة الذاتية. يمكنك مراجعة وتعديل البيانات المستخرجة في الخطوات التالية" : "✓ Resume uploaded. You can review and edit extracted data in the following steps"}
            </p>
          )}
        </div>
      </div>

      {/* Manual Apply Option */}
      <div className="text-center">
        <button
          type="button"
          onClick={onSkip}
          className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4 transition-colors inline-flex items-center gap-1.5"
        >
          <PenLine className="w-3.5 h-3.5" />
          {lang === "ar" ? "تخطي وتعبئة البيانات يدوياً" : "Skip and fill manually"}
        </button>
      </div>
    </div>
  );
};

export default ResumeUploadStep;
