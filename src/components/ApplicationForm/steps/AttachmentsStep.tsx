import FormField from "../FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFieldConfig } from "@/hooks/useFieldConfig";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onFileChange: (name: string, file: File | null) => void;
  hasResume?: boolean;
}

const AttachmentsStep = ({ data, onChange, onFileChange, hasResume }: Props) => {
  const { t, lang } = useLanguage();
  const fc = useFieldConfig();

  const show = fc.isVisible;
  const req = fc.isRequired;
  const lbl = (name: string, fallback: string) => fc.getLabel(name, lang, fallback);

  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-2">{t("step.attach")}</h3>

      {/* Resume - always required */}
      <div className="space-y-2">
        {hasResume ? (
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">✓</div>
            <div>
              <p className="font-medium text-foreground text-sm">{lang === "ar" ? "تم إرفاق السيرة الذاتية" : "Resume attached"}</p>
              <p className="text-muted-foreground text-xs">{lang === "ar" ? "تم رفعها في الخطوة الأولى — يمكنك استبدالها أدناه" : "Uploaded in step 1 — you can replace it below"}</p>
            </div>
          </div>
        ) : (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive text-sm font-bold">!</div>
            <p className="font-medium text-destructive text-sm">{lang === "ar" ? "السيرة الذاتية مطلوبة — يرجى إرفاقها" : "Resume is required — please attach it"}</p>
          </div>
        )}
        <FormField
          label={lbl("resume", lang === "ar" ? "السيرة الذاتية" : "Resume/CV")}
          name="resume"
          type="file"
          required={!hasResume}
          value=""
          onChange={onChange}
          onFileChange={onFileChange}
          accept=".pdf,.doc,.docx"
        />
      </div>

      <div className="grid grid-cols-1 gap-5">
        {show("degreeCopy") && <FormField label={lbl("degreeCopy", t("field.degreeCopy"))} name="degreeCopy" type="file" required={req("degreeCopy")} value="" onChange={onChange} onFileChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png" />}
        {show("experienceCert") && <FormField label={lbl("experienceCert", t("field.experienceCert"))} name="experienceCert" type="file" required={req("experienceCert")} value="" onChange={onChange} onFileChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png" />}
        {show("trainingCerts") && <FormField label={lbl("trainingCerts", t("field.trainingCerts"))} name="trainingCerts" type="file" required={req("trainingCerts")} value="" onChange={onChange} onFileChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png" />}
        {show("otherDocs") && <FormField label={lbl("otherDocs", t("field.otherDocs"))} name="otherDocs" type="file" required={req("otherDocs")} value="" onChange={onChange} onFileChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />}
      </div>
    </div>
  );
};

export default AttachmentsStep;
