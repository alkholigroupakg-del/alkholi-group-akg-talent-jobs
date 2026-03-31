import FormField from "../FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { getNationalities } from "@/data/jobPositions";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const BasicInfoStep = ({ data, onChange }: Props) => {
  const { t, lang } = useLanguage();

  const genderOptions = [t("opt.male"), t("opt.female")];
  const maritalOptions = [t("opt.single"), t("opt.married"), t("opt.divorced"), t("opt.widowed")];
  const transportOptions = [t("opt.yes"), t("opt.no")];

  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">{t("step.basic")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label={t("field.fullName")} name="fullName" required value={data.fullName || ""} onChange={onChange} placeholder={t("ph.fullName")} />
        <FormField label={t("field.gender")} name="gender" type="select" required value={data.gender || ""} onChange={onChange} options={genderOptions} />
        <FormField label={t("field.nationality")} name="nationality" type="select" required value={data.nationality || ""} onChange={onChange} options={getNationalities(lang)} />
        <FormField label={t("field.birthDate")} name="birthDate" type="date" required value={data.birthDate || ""} onChange={onChange} />
        <FormField label={t("field.maritalStatus")} name="maritalStatus" type="select" required value={data.maritalStatus || ""} onChange={onChange} options={maritalOptions} />
        <FormField label={t("field.dependents")} name="dependents" type="number" required value={data.dependents || ""} onChange={onChange} placeholder={t("ph.dependents")} />
        <FormField label={t("field.phone")} name="phone" type="tel" required value={data.phone || ""} onChange={onChange} placeholder={t("ph.phone")} />
        <FormField label={t("field.email")} name="email" type="email" required value={data.email || ""} onChange={onChange} placeholder={t("ph.email")} />
        <FormField label={t("field.currentCity")} name="currentCity" type="text" required value={data.currentCity || ""} onChange={onChange} placeholder={t("ph.city")} />
        <FormField label={t("field.hasTransport")} name="hasTransport" type="select" required value={data.hasTransport || ""} onChange={onChange} options={transportOptions} />
      </div>
    </div>
  );
};

export default BasicInfoStep;
