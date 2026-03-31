import FormField from "../FormField";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onFileChange: (name: string, file: File | null) => void;
}

const AttachmentsStep = ({ data, onChange, onFileChange }: Props) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">{t("step.attach")}</h3>
      <div className="grid grid-cols-1 gap-5">
        <FormField label={t("field.resume")} name="resume" type="file" required value="" onChange={onChange} onFileChange={onFileChange} accept=".pdf,.doc,.docx" />
        <FormField label={t("field.degreeCopy")} name="degreeCopy" type="file" value="" onChange={onChange} onFileChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png" />
        <FormField label={t("field.experienceCert")} name="experienceCert" type="file" value="" onChange={onChange} onFileChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png" />
        <FormField label={t("field.trainingCerts")} name="trainingCerts" type="file" value="" onChange={onChange} onFileChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png" />
        <FormField label={t("field.otherDocs")} name="otherDocs" type="file" value="" onChange={onChange} onFileChange={onFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
      </div>
    </div>
  );
};

export default AttachmentsStep;
