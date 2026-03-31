import FormField from "../FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { salaryRanges } from "@/data/jobPositions";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const FinancialsStep = ({ data, onChange }: Props) => {
  const { t } = useLanguage();

  const dateOptions = [
    t("opt.immediate"), t("opt.oneWeek"), t("opt.twoWeeks"),
    t("opt.oneMonth"), t("opt.twoMonths"), t("opt.moreThanTwo"),
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">{t("step.fin")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label={t("field.currentSalary")} name="currentSalary" type="select" required value={data.currentSalary || ""} onChange={onChange} options={salaryRanges} />
        <FormField label={t("field.expectedSalary")} name="expectedSalary" type="select" required value={data.expectedSalary || ""} onChange={onChange} options={salaryRanges} />
        <FormField label={t("field.availableDate")} name="availableDate" type="select" required value={data.availableDate || ""} onChange={onChange} options={dateOptions} />
      </div>
    </div>
  );
};

export default FinancialsStep;
