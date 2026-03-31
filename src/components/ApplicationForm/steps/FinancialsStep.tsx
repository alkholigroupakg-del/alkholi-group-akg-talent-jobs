import FormField from "../FormField";
import { salaryRanges } from "@/data/jobPositions";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const FinancialsStep = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">التوقعات المالية والتوفر</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="الراتب الحالي (ريال)" name="currentSalary" type="select" required value={data.currentSalary || ""} onChange={onChange} options={salaryRanges} />
        <FormField label="الراتب المتوقع (ريال)" name="expectedSalary" type="select" required value={data.expectedSalary || ""} onChange={onChange} options={salaryRanges} />
        <FormField label="الموعد المتوقع للانضمام" name="availableDate" type="select" required value={data.availableDate || ""} onChange={onChange} options={["فوري", "خلال أسبوع", "خلال أسبوعين", "خلال شهر", "خلال شهرين", "أكثر من شهرين"]} />
      </div>
    </div>
  );
};

export default FinancialsStep;
