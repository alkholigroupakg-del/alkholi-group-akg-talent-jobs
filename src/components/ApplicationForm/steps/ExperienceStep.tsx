import FormField from "../FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { getYearsOfExperience } from "@/data/jobPositions";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const ExperienceStep = ({ data, onChange }: Props) => {
  const { t, lang } = useLanguage();

  const yesNoOptions = [t("opt.yes"), t("opt.no")];
  const langLevelOptions = [
    t("opt.excellent"), t("opt.veryGood"), t("opt.good"),
    t("opt.average"), t("opt.beginner"),
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">{t("step.exp")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label={t("field.yearsExperience")} name="yearsExperience" type="select" required value={data.yearsExperience || ""} onChange={onChange} options={getYearsOfExperience(lang)} />
        <FormField label={t("field.currentlyEmployed")} name="currentlyEmployed" type="select" required value={data.currentlyEmployed || ""} onChange={onChange} options={yesNoOptions} />
        <FormField label={t("field.currentTitle")} name="currentTitle" type="text" required value={data.currentTitle || ""} onChange={onChange} placeholder={t("ph.currentTitle")} />
        <div className="md:col-span-2">
          <FormField label={t("field.currentTasks")} name="currentTasks" type="textarea" required value={data.currentTasks || ""} onChange={onChange} placeholder={t("ph.currentTasks")} />
        </div>
        <div className="md:col-span-2">
          <FormField label={t("field.selfSummary")} name="selfSummary" type="textarea" required value={data.selfSummary || ""} onChange={onChange} placeholder={t("ph.selfSummary")} />
        </div>
        <div className="md:col-span-2">
          <FormField label={t("field.otherExperience")} name="otherExperience" type="textarea" required value={data.otherExperience || ""} onChange={onChange} placeholder={t("ph.otherExperience")} />
        </div>
        <FormField label={t("field.arabicLevel")} name="arabicLevel" type="select" required value={data.arabicLevel || ""} onChange={onChange} options={langLevelOptions} />
        <FormField label={t("field.englishLevel")} name="englishLevel" type="select" required value={data.englishLevel || ""} onChange={onChange} options={langLevelOptions} />
        <FormField label={t("field.otherLanguage")} name="otherLanguage" type="text" value={data.otherLanguage || ""} onChange={onChange} placeholder={t("ph.otherLanguage")} />
        <FormField label={t("field.linkedin")} name="linkedin" type="text" required value={data.linkedin || ""} onChange={onChange} placeholder={t("ph.linkedin")} />
        <div className="md:col-span-2">
          <FormField
            label={t("field.facilityManagementExp")}
            name="facilityManagementExp"
            type="select"
            required
            value={data.facilityManagementExp || ""}
            onChange={onChange}
            options={[t("opt.facilityYes"), t("opt.facilityContractor"), t("opt.facilityNo")]}
          />
        </div>
      </div>
    </div>
  );
};

export default ExperienceStep;
