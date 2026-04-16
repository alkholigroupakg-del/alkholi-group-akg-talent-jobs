import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Pencil, List, RotateCcw, Plus, Trash2, GripVertical } from "lucide-react";
import { invalidateDropdownCache } from "@/hooks/useDropdownOptions";
import {
  getNationalities,
  getSaudiCities,
  getEducationLevels,
  getJobPositions,
  getYearsOfExperience,
  getSalaryRanges,
  getGenderOptions,
  getMaritalStatusOptions,
  getYesNoOptions,
  getLanguageLevels,
  getJobTypes,
  getHearAboutOptions,
  getAvailableDates,
  getFacilityMgmtOptions,
} from "@/data/jobPositions";

interface DropdownOption {
  id?: string;
  field_name: string;
  options_ar: string[];
  options_en: string[];
  is_active: boolean;
}

interface EditableOption {
  ar: string;
  en: string;
  enabled: boolean;
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
  const [items, setItems] = useState<EditableOption[]>([]);
  const [newAr, setNewAr] = useState("");
  const [newEn, setNewEn] = useState("");

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
    const defaultAr = field.getDefaultAr();
    const defaultEn = field.getDefaultEn();

    if (existing && existing.options_ar.length > 0) {
      // Build items from saved data - all saved items are enabled
      const savedItems: EditableOption[] = existing.options_ar.map((ar, i) => ({
        ar,
        en: existing.options_en[i] || ar,
        enabled: true,
      }));
      // Add default items that are not in saved data as disabled
      defaultAr.forEach((ar, i) => {
        const en = defaultEn[i] || ar;
        if (!savedItems.some(s => s.ar === ar || s.en === en)) {
          savedItems.push({ ar, en, enabled: false });
        }
      });
      setItems(savedItems);
    } else {
      // All defaults enabled
      setItems(defaultAr.map((ar, i) => ({ ar, en: defaultEn[i] || ar, enabled: true })));
    }
    setNewAr("");
    setNewEn("");
    setShowEditor(true);
  };

  const toggleItem = (index: number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, enabled: !item.enabled } : item));
  };

  const updateItem = (index: number, field: "ar" | "en", value: string) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    if (!newAr.trim() && !newEn.trim()) return;
    setItems(prev => [...prev, { ar: newAr.trim(), en: newEn.trim() || newAr.trim(), enabled: true }]);
    setNewAr("");
    setNewEn("");
  };

  const toggleAll = (enabled: boolean) => {
    setItems(prev => prev.map(item => ({ ...item, enabled })));
  };

  const saveOptions = async () => {
    if (!editingField) return;
    // Only save enabled items
    const enabledItems = items.filter(i => i.enabled);
    const optionsAr = enabledItems.map(i => i.ar).filter(Boolean);
    const optionsEn = enabledItems.map(i => i.en).filter(Boolean);

    if (optionsAr.length === 0) {
      toast.error(lang === "ar" ? "يجب تفعيل خيار واحد على الأقل" : "At least one option must be enabled");
      return;
    }

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
    const defaultAr = editingField.getDefaultAr();
    const defaultEn = editingField.getDefaultEn();
    setItems(defaultAr.map((ar, i) => ({ ar, en: defaultEn[i] || ar, enabled: true })));
  };

  const enabledCount = items.filter(i => i.enabled).length;

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
                    <span className="text-xs text-muted-foreground">{count} {lang === "ar" ? "خيار مفعّل" : "active"}</span>
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
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col" dir={dir}>
          <DialogHeader>
            <DialogTitle>
              {lang === "ar"
                ? `تعديل: ${editingField?.labelAr}`
                : `Edit: ${editingField?.labelEn}`}
            </DialogTitle>
          </DialogHeader>

          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">
              {enabledCount} / {items.length} {lang === "ar" ? "مفعّل" : "enabled"}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleAll(true)}>
                {lang === "ar" ? "تفعيل الكل" : "Enable All"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => toggleAll(false)}>
                {lang === "ar" ? "تعطيل الكل" : "Disable All"}
              </Button>
            </div>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[50vh] border rounded-lg p-3">
            {items.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${
                  item.enabled ? "bg-background border-border" : "bg-muted/50 border-muted opacity-60"
                }`}
              >
                <Switch
                  checked={item.enabled}
                  onCheckedChange={() => toggleItem(index)}
                />
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    value={item.ar}
                    onChange={(e) => updateItem(index, "ar", e.target.value)}
                    className="text-sm h-8"
                    dir="rtl"
                    placeholder={lang === "ar" ? "عربي" : "Arabic"}
                  />
                  <Input
                    value={item.en}
                    onChange={(e) => updateItem(index, "en", e.target.value)}
                    className="text-sm h-8"
                    dir="ltr"
                    placeholder={lang === "ar" ? "إنجليزي" : "English"}
                  />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeItem(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add new */}
          <div className="flex items-center gap-2 border rounded-lg p-3 bg-muted/30">
            <Plus className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input
                value={newAr}
                onChange={(e) => setNewAr(e.target.value)}
                className="text-sm h-8"
                dir="rtl"
                placeholder={lang === "ar" ? "اسم الخيار بالعربي" : "Option in Arabic"}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
              />
              <Input
                value={newEn}
                onChange={(e) => setNewEn(e.target.value)}
                className="text-sm h-8"
                dir="ltr"
                placeholder={lang === "ar" ? "اسم الخيار بالإنجليزي" : "Option in English"}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
              />
            </div>
            <Button variant="outline" size="sm" onClick={addItem} className="shrink-0">
              {lang === "ar" ? "إضافة" : "Add"}
            </Button>
          </div>

          {/* Actions */}
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
