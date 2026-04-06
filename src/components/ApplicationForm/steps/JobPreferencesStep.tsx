import FormField from "../FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { getJobPositions, getSaudiCities, getJobPositionTranslation } from "@/data/jobPositions";
import { useEffect } from "react";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const JobPreferencesStep = ({ data, onChange }: Props) => {
  const { t, lang } = useLanguage();

  const cityOptions = getSaudiCities(lang);
  const jobTypeOptions = [
    t("opt.fulltime"), t("opt.parttime"), t("opt.remote"),
    t("opt.contract"), t("opt.coop"), t("opt.tamheer"),
  ];
  const hearOptions = [
    t("opt.linkedin"), t("opt.twitter"), t("opt.website"),
    t("opt.friend"), t("opt.jobPlatform"), t("opt.other"),
  ];

  // Build position options, ensuring pre-selected value is always included
  const basePositions = getJobPositions(lang);
  const currentValue = data.desiredPosition || "";
  const positionOptions = currentValue && !basePositions.includes(currentValue)
    ? [currentValue, ...basePositions]
    : basePositions;

  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">{t("step.job")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <FormField label={t("field.desiredPosition")} name="desiredPosition" type="select" required value={currentValue} onChange={onChange} options={positionOptions} />
        </div>
        <FormField label={t("field.jobType")} name="jobType" type="select" required value={data.jobType || ""} onChange={onChange} options={jobTypeOptions} />
        <FormField label={t("field.preferredCity")} name="preferredCity" type="select" required value={data.preferredCity || ""} onChange={onChange} options={cityOptions} />
        <div className="md:col-span-2">
          <FormField label={t("field.hearAbout")} name="hearAbout" type="select" required value={data.hearAbout || ""} onChange={onChange} options={hearOptions} />
        </div>
      </div>
    </div>
  );
};

export default JobPreferencesStep;
