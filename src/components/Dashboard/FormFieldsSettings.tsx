import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Eye, EyeOff, GripVertical, FormInput } from "lucide-react";
import { invalidateFieldConfigCache, type FieldConfig } from "@/hooks/useFieldConfig";

const STEP_LABELS_AR = ["البيانات الأساسية", "التفضيلات الوظيفية", "المؤهل العلمي", "الخبرات والمهارات", "التوقعات المالية", "المرفقات"];
const STEP_LABELS_EN = ["Basic Info", "Job Preferences", "Education", "Experience & Skills", "Financial", "Attachments"];

const FormFieldsSettings = () => {
  const { t, lang, dir } = useLanguage();
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [activeStep, setActiveStep] = useState("1");
  const [editField, setEditField] = useState<FieldConfig | null>(null);
  const [editForm, setEditForm] = useState({ label_ar: "", label_en: "", sort_order: 0 });

  useEffect(() => { fetchFields(); }, []);

  const fetchFields = async () => {
    const { data } = await supabase
      .from("form_field_config")
      .select("*")
      .order("step_number", { ascending: true })
      .order("sort_order", { ascending: true });
    if (data) setFields(data as FieldConfig[]);
  };

  const toggleVisible = async (id: string, visible: boolean) => {
    await supabase.from("form_field_config").update({ is_visible: visible }).eq("id", id);
    invalidateFieldConfigCache();
    fetchFields();
    toast.success(t("dash.saved"));
  };

  const toggleRequired = async (id: string, required: boolean) => {
    await supabase.from("form_field_config").update({ is_required: required }).eq("id", id);
    invalidateFieldConfigCache();
    fetchFields();
    toast.success(t("dash.saved"));
  };

  const openEdit = (f: FieldConfig) => {
    setEditField(f);
    setEditForm({ label_ar: f.label_ar || "", label_en: f.label_en || "", sort_order: f.sort_order });
  };

  const saveEdit = async () => {
    if (!editField) return;
    await supabase.from("form_field_config").update({
      label_ar: editForm.label_ar || null,
      label_en: editForm.label_en || null,
      sort_order: editForm.sort_order,
    }).eq("id", editField.id);
    invalidateFieldConfigCache();
    fetchFields();
    setEditField(null);
    toast.success(t("dash.saved"));
  };

  const stepLabels = lang === "ar" ? STEP_LABELS_AR : STEP_LABELS_EN;
  const stepFields = fields.filter(f => f.step_number === parseInt(activeStep));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FormInput className="w-5 h-5" />
        <h3 className="text-lg font-bold">{lang === "ar" ? "إدارة حقول نموذج التقديم" : "Manage Application Form Fields"}</h3>
      </div>

      <Tabs value={activeStep} onValueChange={setActiveStep} dir={dir}>
        <TabsList className="flex flex-wrap gap-1 h-auto">
          {stepLabels.map((label, i) => (
            <TabsTrigger key={i + 1} value={String(i + 1)} className="text-xs">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {stepLabels.map((_, i) => (
          <TabsContent key={i + 1} value={String(i + 1)} className="space-y-2 mt-4">
            {fields.filter(f => f.step_number === i + 1).map((f) => (
              <Card key={f.id} className={!f.is_visible ? "opacity-50" : ""}>
                <CardContent className="p-3 flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {lang === "ar" ? (f.label_ar || f.field_name) : (f.label_en || f.field_name)}
                    </p>
                    <p className="text-xs text-muted-foreground">{f.field_name}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5">
                      {f.is_visible ? <Eye className="w-3.5 h-3.5 text-green-600" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                      <Switch checked={f.is_visible} onCheckedChange={(v) => toggleVisible(f.id, v)} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant={f.is_required ? "default" : "outline"} className="text-[10px]">
                        {f.is_required ? (lang === "ar" ? "إلزامي" : "Required") : (lang === "ar" ? "اختياري" : "Optional")}
                      </Badge>
                      <Switch checked={f.is_required} onCheckedChange={(v) => toggleRequired(f.id, v)} />
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(f)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Label Dialog */}
      <Dialog open={!!editField} onOpenChange={(o) => !o && setEditField(null)}>
        <DialogContent className="max-w-md" dir={dir}>
          <DialogHeader>
            <DialogTitle>{lang === "ar" ? "تعديل تسمية الحقل" : "Edit Field Label"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{lang === "ar" ? "التسمية بالعربية" : "Arabic Label"}</Label>
              <Input value={editForm.label_ar} onChange={e => setEditForm(p => ({ ...p, label_ar: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "التسمية بالإنجليزية" : "English Label"}</Label>
              <Input value={editForm.label_en} onChange={e => setEditForm(p => ({ ...p, label_en: e.target.value }))} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "الترتيب" : "Sort Order"}</Label>
              <Input type="number" value={editForm.sort_order} onChange={e => setEditForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setEditField(null)}>{t("dash.cancel")}</Button>
              <Button onClick={saveEdit} className="gradient-accent text-accent-foreground">{t("dash.save")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormFieldsSettings;
