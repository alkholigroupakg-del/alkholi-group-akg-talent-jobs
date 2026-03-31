import FormField from "../FormField";
import { educationLevels } from "@/data/jobPositions";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const EducationStep = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">المؤهل العلمي</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="المؤهل العلمي الحالي" name="educationLevel" type="select" required value={data.educationLevel || ""} onChange={onChange} options={educationLevels} />
        <FormField label="التخصص" name="major" type="text" required value={data.major || ""} onChange={onChange} placeholder="أدخل تخصصك" />
        <FormField label="الجامعة / المعهد" name="university" type="text" required value={data.university || ""} onChange={onChange} placeholder="اسم الجامعة أو المعهد" />
        <FormField label="سنة التخرج" name="graduationYear" type="text" required value={data.graduationYear || ""} onChange={onChange} placeholder="مثال: 2020" />
        <FormField label="المعدل التراكمي" name="gpa" type="text" required value={data.gpa || ""} onChange={onChange} placeholder="مثال: 4.5 من 5" />
        <FormField label="هل ملتحق حالياً بدراسة أخرى؟" name="currentlyStudying" type="select" required value={data.currentlyStudying || ""} onChange={onChange} options={["نعم", "لا"]} />
        {data.currentlyStudying === "نعم" && (
          <FormField label="ماهي الدراسة الحالية؟" name="currentStudy" type="text" required value={data.currentStudy || ""} onChange={onChange} placeholder="وصف الدراسة الحالية" />
        )}
      </div>
    </div>
  );
};

export default EducationStep;
