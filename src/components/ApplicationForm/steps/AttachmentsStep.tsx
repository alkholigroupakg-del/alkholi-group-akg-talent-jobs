import FormField from "../FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFieldConfig } from "@/hooks/useFieldConfig";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onFileChange: (name: string, file: File | null) => void;
}

const AttachmentsStep = ({ data, onChange, onFileChange }: Props) => {
  const { t, lang } = useLanguage();
  const fc = useFieldConfig();

  const show = fc.isVisible;
  const req = fc.isRequired;
  const lbl = (name: string, fallback: string) => fc.getLabel(name, lang, fallback);

  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-2">{t("step.attach")}</h3>
      <p className="text-muted-foreground text-sm">
        {lang === "ar" ? "ارفع المستندات المطلوبة (السيرة الذاتية تم رفعها في الخطوة الأولى)" : "Upload required documents (resume was uploaded in the first step)"}
      </p>
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
