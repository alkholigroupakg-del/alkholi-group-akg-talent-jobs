import FormField from "../FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { getNationalities, getSaudiCities } from "@/data/jobPositions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const BasicInfoStep = ({ data, onChange }: Props) => {
  const { t, lang, dir } = useLanguage();

  const genderOptions = [t("opt.male"), t("opt.female")];
  const maritalOptions = [t("opt.single"), t("opt.married"), t("opt.divorced"), t("opt.widowed")];
  const transportOptions = [t("opt.yes"), t("opt.no")];
  const nationalities = getNationalities(lang);
  const cities = getSaudiCities(lang);

  const otherLabel = lang === "ar" ? "أخرى" : "Other";
  const isOtherNationality = data.nationality === otherLabel;

  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">{t("step.basic")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label={t("field.fullName")} name="fullName" required value={data.fullName || ""} onChange={onChange} placeholder={t("ph.fullName")} />
        <FormField label={t("field.gender")} name="gender" type="select" required value={data.gender || ""} onChange={onChange} options={genderOptions} />
        <FormField label={t("field.nationality")} name="nationality" type="select" required value={data.nationality || ""} onChange={onChange} options={nationalities} />
        {isOtherNationality && (
          <div className="space-y-2">
            <Label htmlFor="nationalityOther" className="text-sm font-medium text-foreground">
              {lang === "ar" ? "حدد الجنسية" : "Specify Nationality"}
              <span className={`text-destructive ${dir === "rtl" ? "mr-1" : "ml-1"}`}>*</span>
            </Label>
            <Input
              id="nationalityOther"
              value={data.nationalityOther || ""}
              onChange={(e) => onChange("nationalityOther", e.target.value)}
              placeholder={lang === "ar" ? "اكتب جنسيتك" : "Enter your nationality"}
              className={`bg-background border-input focus:ring-ring ${dir === "rtl" ? "text-right" : "text-left"}`}
              dir={dir}
            />
          </div>
        )}
        <FormField label={t("field.birthDate")} name="birthDate" type="date" required value={data.birthDate || ""} onChange={onChange} />
        <FormField label={t("field.maritalStatus")} name="maritalStatus" type="select" required value={data.maritalStatus || ""} onChange={onChange} options={maritalOptions} />
        <FormField label={t("field.dependents")} name="dependents" type="number" required value={data.dependents || ""} onChange={onChange} placeholder={t("ph.dependents")} />
        <FormField label={t("field.phone")} name="phone" type="tel" required value={data.phone || ""} onChange={onChange} placeholder={t("ph.phone")} />
        <FormField label={t("field.email")} name="email" type="email" required value={data.email || ""} onChange={onChange} placeholder={t("ph.email")} />
        <FormField label={t("field.currentCity")} name="currentCity" type="select" required value={data.currentCity || ""} onChange={onChange} options={cities} />
        <FormField label={t("field.hasTransport")} name="hasTransport" type="select" required value={data.hasTransport || ""} onChange={onChange} options={transportOptions} />
      </div>
    </div>
  );
};

export default BasicInfoStep;
