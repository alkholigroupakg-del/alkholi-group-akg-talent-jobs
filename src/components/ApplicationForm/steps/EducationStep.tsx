import FormField from "../FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { educationLevels } from "@/data/jobPositions";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const EducationStep = ({ data, onChange }: Props) => {
  const { t } = useLanguage();

  const yesNoOptions = [t("opt.yes"), t("opt.no")];

  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">{t("step.edu")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label={t("field.educationLevel")} name="educationLevel" type="select" required value={data.educationLevel || ""} onChange={onChange} options={educationLevels} />
        <FormField label={t("field.major")} name="major" type="text" required value={data.major || ""} onChange={onChange} placeholder={t("ph.major")} />
        <FormField label={t("field.university")} name="university" type="text" required value={data.university || ""} onChange={onChange} placeholder={t("ph.university")} />
        <FormField label={t("field.graduationYear")} name="graduationYear" type="text" required value={data.graduationYear || ""} onChange={onChange} placeholder={t("ph.graduationYear")} />
        <FormField label={t("field.gpa")} name="gpa" type="text" required value={data.gpa || ""} onChange={onChange} placeholder={t("ph.gpa")} />
        <FormField label={t("field.currentlyStudying")} name="currentlyStudying" type="select" required value={data.currentlyStudying || ""} onChange={onChange} options={yesNoOptions} />
        {(data.currentlyStudying === "نعم" || data.currentlyStudying === "Yes") && (
          <FormField label={t("field.currentStudy")} name="currentStudy" type="text" required value={data.currentStudy || ""} onChange={onChange} placeholder={t("ph.currentStudy")} />
        )}
      </div>
    </div>
  );
};

export default EducationStep;
