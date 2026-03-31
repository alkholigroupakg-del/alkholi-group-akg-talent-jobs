import FormField from "../FormField";
import { jobPositions, cities, hearAboutUs } from "@/data/jobPositions";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const JobPreferencesStep = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">التفضيلات الوظيفية</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <FormField label="الوظيفة المرغوب التقديم عليها" name="desiredPosition" type="select" required value={data.desiredPosition || ""} onChange={onChange} options={jobPositions} />
        </div>
        <FormField label="نوع الوظيفة" name="jobType" type="select" required value={data.jobType || ""} onChange={onChange} options={["دوام كامل", "دوام جزئي", "عن بُعد", "عقد مؤقت", "تدريب تعاوني", "تمهير"]} />
        <FormField label="المدينة التي ترغب بالعمل فيها" name="preferredCity" type="select" required value={data.preferredCity || ""} onChange={onChange} options={cities} />
        <div className="md:col-span-2">
          <FormField label="كيف سمعت عن هذه الفرصة؟" name="hearAbout" type="select" value={data.hearAbout || ""} onChange={onChange} options={hearAboutUs} />
        </div>
      </div>
    </div>
  );
};

export default JobPreferencesStep;
