import FormField from "../FormField";
import { languageLevels, yearsOfExperience } from "@/data/jobPositions";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const ExperienceStep = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">الخبرات والمهارات</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="عدد سنوات الخبرة" name="yearsExperience" type="select" required value={data.yearsExperience || ""} onChange={onChange} options={yearsOfExperience} />
        <FormField label="هل أنت على رأس العمل؟" name="currentlyEmployed" type="select" required value={data.currentlyEmployed || ""} onChange={onChange} options={["نعم", "لا"]} />
        <FormField label="المسمى الوظيفي الحالي" name="currentTitle" type="text" required value={data.currentTitle || ""} onChange={onChange} placeholder="المسمى الوظيفي" />
        <div className="md:col-span-2">
          <FormField label="نبذة عن المهام الحالية" name="currentTasks" type="textarea" required value={data.currentTasks || ""} onChange={onChange} placeholder="اذكر أبرز مهامك الحالية..." />
        </div>
        <div className="md:col-span-2">
          <FormField label="نبذة عن نفسك (ملخص مهني)" name="selfSummary" type="textarea" required value={data.selfSummary || ""} onChange={onChange} placeholder="اكتب ملخصاً مهنياً موجزاً عن نفسك..." />
        </div>
        <div className="md:col-span-2">
          <FormField label="ماهي الخبرات المصاحبة في مجال غير التخصص؟" name="otherExperience" type="textarea" required value={data.otherExperience || ""} onChange={onChange} placeholder="اذكر أي خبرات إضافية..." />
        </div>
        <FormField label="مستوى اللغة العربية" name="arabicLevel" type="select" required value={data.arabicLevel || ""} onChange={onChange} options={languageLevels} />
        <FormField label="مستوى اللغة الإنجليزية" name="englishLevel" type="select" required value={data.englishLevel || ""} onChange={onChange} options={languageLevels} />
        <FormField label="لغة أخرى" name="otherLanguage" type="text" required value={data.otherLanguage || ""} onChange={onChange} placeholder="حدد اللغة ومستواك" />
        <FormField label="رابط LinkedIn" name="linkedin" type="text" required value={data.linkedin || ""} onChange={onChange} placeholder="https://linkedin.com/in/..." />
      </div>
    </div>
  );
};

export default ExperienceStep;
