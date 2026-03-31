import FormField from "../FormField";
import { nationalities } from "@/data/jobPositions";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const BasicInfoStep = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">البيانات الأساسية</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="الاسم الكامل" name="fullName" required value={data.fullName || ""} onChange={onChange} placeholder="أدخل اسمك الكامل" />
        <FormField label="الجنس" name="gender" type="select" required value={data.gender || ""} onChange={onChange} options={["ذكر", "أنثى"]} />
        <FormField label="الجنسية" name="nationality" type="select" required value={data.nationality || ""} onChange={onChange} options={nationalities} />
        <FormField label="تاريخ الميلاد" name="birthDate" type="date" required value={data.birthDate || ""} onChange={onChange} />
        <FormField label="الحالة الاجتماعية" name="maritalStatus" type="select" required value={data.maritalStatus || ""} onChange={onChange} options={["أعزب/عزباء", "متزوج/ة", "مطلق/ة", "أرمل/ة"]} />
        <FormField label="عدد المعالين (إذا كنت متزوج)" name="dependents" type="number" required value={data.dependents || ""} onChange={onChange} placeholder="0" />
        <FormField label="رقم الجوال" name="phone" type="tel" required value={data.phone || ""} onChange={onChange} placeholder="05XXXXXXXX" />
        <FormField label="البريد الإلكتروني" name="email" type="email" required value={data.email || ""} onChange={onChange} placeholder="example@email.com" />
        <FormField label="مقر السكن الحالي" name="currentCity" type="text" required value={data.currentCity || ""} onChange={onChange} placeholder="المدينة" />
        <FormField label="هل لديك وسيلة مواصلات؟" name="hasTransport" type="select" required value={data.hasTransport || ""} onChange={onChange} options={["نعم", "لا"]} />
      </div>
    </div>
  );
};

export default BasicInfoStep;
