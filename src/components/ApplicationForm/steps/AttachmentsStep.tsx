import { useState } from "react";
import FormField from "../FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFieldConfig } from "@/hooks/useFieldConfig";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onFileChange: (name: string, file: File | null) => void;
  onAutoFill?: (fields: Record<string, string>) => void;
}

const AttachmentsStep = ({ data, onChange, onFileChange, onAutoFill }: Props) => {
  const { t, lang } = useLanguage();
  const fc = useFieldConfig();
  const [isParsing, setIsParsing] = useState(false);

  const show = fc.isVisible;
  const req = fc.isRequired;
  const lbl = (name: string, fallback: string) => fc.getLabel(name, lang, fallback);

  const handleResumeUpload = async (name: string, file: File | null) => {
    onFileChange(name, file);
    if (!file || !onAutoFill) return;
    if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) return;

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
        toast.success(lang === "ar" ? `تم استخراج ${Object.keys(fieldsToFill).length} حقل تلقائياً` : `Auto-filled ${Object.keys(fieldsToFill).length} fields`);
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
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-2">{t("step.attach")}</h3>
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-foreground text-sm">{lang === "ar" ? "التقديم السريع (ATS)" : "Quick Apply (ATS)"}</p>
          <p className="text-muted-foreground text-xs mt-1">{lang === "ar" ? "ارفع سيرتك الذاتية بصيغة PDF وسيتم تعبئة الحقول تلقائياً" : "Upload your resume as PDF and fields will be auto-filled"}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5">
        {show("resume") && (
          <div className="relative">
            <FormField label={lbl("resume", t("field.resume"))} name="resume" type="file" required={req("resume")} value="" onChange={onChange} onFileChange={(name, file) => handleResumeUpload(name, file)} accept=".pdf,.doc,.docx" />
            {isParsing && (
              <div className="mt-2 flex items-center gap-2 text-accent text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                {lang === "ar" ? "جاري استخراج البيانات..." : "Extracting data..."}
              </div>
            )}
          </div>
        )}
        {show("degreeCopy") && <FormField label={lbl("degreeCopy", t("field.degreeCopy"))} name="degreeCopy" type="file" required={req("degreeCopy")} value="" onChange={onChange} onFileChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png" />}
        {show("experienceCert") && <FormField label={lbl("experienceCert", t("field.experienceCert"))} name="experienceCert" type="file" required={req("experienceCert")} value="" onChange={onChange} onFileChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png" />}
        {show("trainingCerts") && <FormField label={lbl("trainingCerts", t("field.trainingCerts"))} name="trainingCerts" type="file" required={req("trainingCerts")} value="" onChange={onChange} onFileChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png" />}
        {show("otherDocs") && <FormField label={lbl("otherDocs", t("field.otherDocs"))} name="otherDocs" type="file" required={req("otherDocs")} value="" onChange={onChange} onFileChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />}
      </div>
    </div>
  );
};

export default AttachmentsStep;
