import FormField from "../FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDropdownOptions } from "@/hooks/useDropdownOptions";
import { useFieldConfig } from "@/hooks/useFieldConfig";

interface Props {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const ExperienceStep = ({ data, onChange }: Props) => {
  const { t, lang } = useLanguage();
  const dd = useDropdownOptions(lang);
  const fc = useFieldConfig();

  const yesNoOptions = dd.getYesNoOptions();
  const langLevelOptions = dd.getLanguageLevels();

  const show = fc.isVisible;
  const req = fc.isRequired;
  const lbl = (name: string, fallback: string) => fc.getLabel(name, lang, fallback);

  return (
    <div className="space-y-5 animate-fade-in">
      <h3 className="text-xl font-bold text-primary mb-6">{t("step.exp")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {show("yearsExperience") && <FormField label={lbl("yearsExperience", t("field.yearsExperience"))} name="yearsExperience" type="select" required={req("yearsExperience")} value={data.yearsExperience || ""} onChange={onChange} options={dd.getYearsOfExperience()} />}
        {show("currentlyEmployed") && <FormField label={lbl("currentlyEmployed", t("field.currentlyEmployed"))} name="currentlyEmployed" type="select" required={req("currentlyEmployed")} value={data.currentlyEmployed || ""} onChange={onChange} options={yesNoOptions} />}
        {show("currentTitle") && <FormField label={lbl("currentTitle", t("field.currentTitle"))} name="currentTitle" type="text" required={req("currentTitle")} value={data.currentTitle || ""} onChange={onChange} placeholder={t("ph.currentTitle")} />}
        {show("currentTasks") && <div className="md:col-span-2"><FormField label={lbl("currentTasks", t("field.currentTasks"))} name="currentTasks" type="textarea" required={req("currentTasks")} value={data.currentTasks || ""} onChange={onChange} placeholder={t("ph.currentTasks")} /></div>}
        {show("selfSummary") && <div className="md:col-span-2"><FormField label={lbl("selfSummary", t("field.selfSummary"))} name="selfSummary" type="textarea" required={req("selfSummary")} value={data.selfSummary || ""} onChange={onChange} placeholder={t("ph.selfSummary")} /></div>}
        {show("otherExperience") && <div className="md:col-span-2"><FormField label={lbl("otherExperience", t("field.otherExperience"))} name="otherExperience" type="textarea" required={req("otherExperience")} value={data.otherExperience || ""} onChange={onChange} placeholder={t("ph.otherExperience")} /></div>}
        {show("arabicLevel") && <FormField label={lbl("arabicLevel", t("field.arabicLevel"))} name="arabicLevel" type="select" required={req("arabicLevel")} value={data.arabicLevel || ""} onChange={onChange} options={langLevelOptions} />}
        {show("englishLevel") && <FormField label={lbl("englishLevel", t("field.englishLevel"))} name="englishLevel" type="select" required={req("englishLevel")} value={data.englishLevel || ""} onChange={onChange} options={langLevelOptions} />}
        {show("otherLanguage") && <FormField label={lbl("otherLanguage", t("field.otherLanguage"))} name="otherLanguage" type="text" required={req("otherLanguage")} value={data.otherLanguage || ""} onChange={onChange} placeholder={t("ph.otherLanguage")} />}
        {show("linkedin") && <FormField label={lbl("linkedin", t("field.linkedin"))} name="linkedin" type="text" required={req("linkedin")} value={data.linkedin || ""} onChange={onChange} placeholder={t("ph.linkedin")} />}
        {show("facilityManagementExp") && (
          <div className="md:col-span-2">
            <FormField label={lbl("facilityManagementExp", t("field.facilityManagementExp"))} name="facilityManagementExp" type="select" required={req("facilityManagementExp")} value={data.facilityManagementExp || ""} onChange={onChange} options={dd.getFacilityMgmtOptions()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceStep;
