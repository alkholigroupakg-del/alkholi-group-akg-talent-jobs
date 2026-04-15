import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Pencil, List, RotateCcw } from "lucide-react";
import { invalidateDropdownCache } from "@/hooks/useDropdownOptions";
import {
  getNationalities,
  getSaudiCities,
  getEducationLevels,
  getJobPositions,
  getYearsOfExperience,
  getSalaryRanges,
} from "@/data/jobPositions";

interface DropdownOption {
  id?: string;
  field_name: string;
  options_ar: string[];
  options_en: string[];
  is_active: boolean;
}

const FIELD_CONFIGS = [
  { key: "nationalities", labelAr: "الجنسيات", labelEn: "Nationalities", getDefaultAr: () => getNationalities("ar"), getDefaultEn: () => getNationalities("en") },
  { key: "cities", labelAr: "المدن", labelEn: "Cities", getDefaultAr: () => getSaudiCities("ar"), getDefaultEn: () => getSaudiCities("en") },
  { key: "education_levels", labelAr: "المؤهلات العلمية", labelEn: "Education Levels", getDefaultAr: () => getEducationLevels("ar"), getDefaultEn: () => getEducationLevels("en") },
  { key: "job_positions", labelAr: "المسميات الوظيفية", labelEn: "Job Positions", getDefaultAr: () => getJobPositions("ar"), getDefaultEn: () => getJobPositions("en") },
  { key: "years_experience", labelAr: "سنوات الخبرة", labelEn: "Years of Experience", getDefaultAr: () => getYearsOfExperience("ar"), getDefaultEn: () => getYearsOfExperience("en") },
  { key: "salary_ranges", labelAr: "نطاقات الرواتب", labelEn: "Salary Ranges", getDefaultAr: () => getSalaryRanges("ar"), getDefaultEn: () => getSalaryRanges("en") },
];

const DropdownOptionsSettings = () => {
  const { t, lang, dir } = useLanguage();
  const [dbOptions, setDbOptions] = useState<Record<string, DropdownOption>>({});
  const [showEditor, setShowEditor] = useState(false);
  const [editingField, setEditingField] = useState<typeof FIELD_CONFIGS[0] | null>(null);
  const [textAr, setTextAr] = useState("");
  const [textEn, setTextEn] = useState("");

  useEffect(() => { fetchOptions(); }, []);

  const fetchOptions = async () => {
    const { data } = await supabase.from("dropdown_options").select("*");
    const map: Record<string, DropdownOption> = {};
    (data || []).forEach((d: any) => { map[d.field_name] = d; });
    setDbOptions(map);
  };

  const openEditor = (field: typeof FIELD_CONFIGS[0]) => {
    setEditingField(field);
    const existing = dbOptions[field.key];
    if (existing && existing.options_ar.length > 0) {
      setTextAr(existing.options_ar.join("\n"));
      setTextEn(existing.options_en.join("\n"));
    } else {
      setTextAr(field.getDefaultAr().join("\n"));
      setTextEn(field.getDefaultEn().join("\n"));
    }
    setShowEditor(true);
  };

  const saveOptions = async () => {
    if (!editingField) return;
    const optionsAr = textAr.split("\n").map(s => s.trim()).filter(Boolean);
    const optionsEn = textEn.split("\n").map(s => s.trim()).filter(Boolean);

    const existing = dbOptions[editingField.key];
    if (existing?.id) {
      const { error } = await supabase
        .from("dropdown_options")
        .update({ options_ar: optionsAr, options_en: optionsEn })
        .eq("id", existing.id);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await supabase
        .from("dropdown_options")
        .insert({ field_name: editingField.key, options_ar: optionsAr, options_en: optionsEn });
      if (error) { toast.error(error.message); return; }
    }

    invalidateDropdownCache();
    toast.success(t("dash.saved"));
    fetchOptions();
    setShowEditor(false);
  };

  const resetToDefault = () => {
    if (!editingField) return;
    setTextAr(editingField.getDefaultAr().join("\n"));
    setTextEn(editingField.getDefaultEn().join("\n"));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5" />
        <h3 className="text-lg font-bold">{lang === "ar" ? "تخصيص القوائم المنسدلة" : "Customize Dropdown Lists"}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FIELD_CONFIGS.map((field) => {
          const existing = dbOptions[field.key];
          const count = existing?.options_ar?.length || (lang === "ar" ? field.getDefaultAr().length : field.getDefaultEn().length);
          const isCustomized = !!existing?.id;

          return (
            <Card key={field.key} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openEditor(field)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{lang === "ar" ? field.labelAr : field.labelEn}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{count} {lang === "ar" ? "خيار" : "options"}</span>
                    {isCustomized && <Badge variant="secondary" className="text-xs">{lang === "ar" ? "مخصص" : "Customized"}</Badge>}
                  </div>
                </div>
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={dir}>
          <DialogHeader>
            <DialogTitle>
              {lang === "ar"
                ? `تعديل: ${editingField?.labelAr}`
                : `Edit: ${editingField?.labelEn}`}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {lang === "ar" ? "كل سطر يمثل خيار واحد" : "Each line represents one option"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{lang === "ar" ? "الخيارات (عربي)" : "Options (Arabic)"}</Label>
              <Textarea
                value={textAr}
                onChange={(e) => setTextAr(e.target.value)}
                rows={15}
                className="font-mono text-sm"
                dir="rtl"
              />
              <span className="text-xs text-muted-foreground">
                {textAr.split("\n").filter(Boolean).length} {lang === "ar" ? "خيار" : "options"}
              </span>
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "الخيارات (إنجليزي)" : "Options (English)"}</Label>
              <Textarea
                value={textEn}
                onChange={(e) => setTextEn(e.target.value)}
                rows={15}
                className="font-mono text-sm"
                dir="ltr"
              />
              <span className="text-xs text-muted-foreground">
                {textEn.split("\n").filter(Boolean).length} {lang === "ar" ? "خيار" : "options"}
              </span>
            </div>
          </div>
          <div className="flex gap-3 justify-between">
            <Button variant="outline" onClick={resetToDefault} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              {lang === "ar" ? "استعادة الافتراضي" : "Reset to Default"}
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowEditor(false)}>{t("dash.cancel")}</Button>
              <Button onClick={saveOptions} className="gradient-accent text-accent-foreground">{t("dash.save")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DropdownOptionsSettings;
