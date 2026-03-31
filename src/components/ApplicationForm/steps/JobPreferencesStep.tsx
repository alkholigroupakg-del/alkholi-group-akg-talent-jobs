import FormField from "../FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { jobPositions } from "@/data/jobPositions";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const JobPreferencesStep = ({ data, onChange }: Props) => {
  const { t } = useLanguage();

  const cityOptions = [t("opt.riyadh"), t("opt.jeddah"), t("opt.eastern")];
  const jobTypeOptions = [
    t("opt.fulltime"), t("opt.parttime"), t("opt.remote"),
    t("opt.contract"), t("opt.coop"), t("opt.tamheer"),
  ];
  const hearOptions = [
    t("opt.linkedin"), t("opt.twitter"), t("opt.website"),
    t("opt.friend"), t("opt.jobPlatform"), t("opt.other"),
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">{t("step.job")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <FormField label={t("field.desiredPosition")} name="desiredPosition" type="select" required value={data.desiredPosition || ""} onChange={onChange} options={jobPositions} />
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
