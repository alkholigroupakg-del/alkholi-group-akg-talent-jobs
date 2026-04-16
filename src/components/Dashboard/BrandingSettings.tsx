import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Palette, Upload, Save, Image } from "lucide-react";
import { invalidateSiteSettingsCache } from "@/hooks/useSiteSettings";

interface Settings {
  id: string;
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
  site_name_ar: string;
  site_name_en: string;
  logo_height: string;
  logo_alignment: string;
  logo_border_radius: string;
  logo_bg_enabled: boolean;
}

const BrandingSettings = () => {
  const { lang, dir } = useLanguage();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();
    if (data) setSettings({
      id: data.id,
      logo_url: data.logo_url,
      primary_color: data.primary_color || "#1a365d",
      accent_color: data.accent_color || "#2f855a",
      site_name_ar: data.site_name_ar || "",
      site_name_en: data.site_name_en || "",
      logo_height: (data as any).logo_height || "56",
      logo_alignment: (data as any).logo_alignment || "start",
      logo_border_radius: (data as any).logo_border_radius || "8",
      logo_bg_enabled: (data as any).logo_bg_enabled ?? true,
    });
  };

  const handleLogoUpload = async (file: File) => {
    if (!settings) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `branding/logo_${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }

    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    const logoUrl = `${baseUrl}/storage/v1/object/public/resumes/${path}`;
    setSettings({ ...settings, logo_url: logoUrl });
    setUploading(false);
    toast.success(lang === "ar" ? "تم رفع الشعار" : "Logo uploaded");
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        logo_url: settings.logo_url,
        primary_color: settings.primary_color,
        accent_color: settings.accent_color,
        site_name_ar: settings.site_name_ar,
        site_name_en: settings.site_name_en,
        logo_height: settings.logo_height,
        logo_alignment: settings.logo_alignment,
        logo_border_radius: settings.logo_border_radius,
        logo_bg_enabled: settings.logo_bg_enabled,
      } as any)
      .eq("id", settings.id);

    if (error) {
      toast.error(error.message);
    } else {
      invalidateSiteSettingsCache();
      toast.success(lang === "ar" ? "تم حفظ الإعدادات" : "Settings saved");
    }
    setSaving(false);
  };

  if (!settings) return null;

  const logoH = parseInt(settings.logo_height) || 56;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5" />
        <h3 className="text-lg font-bold">{lang === "ar" ? "تخصيص الهوية البصرية" : "Branding Settings"}</h3>
      </div>

      {/* Logo Upload */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Label className="font-medium">{lang === "ar" ? "الشعار" : "Logo"}</Label>
          <div className="flex items-center gap-4">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-16 w-auto object-contain rounded border p-1" />
            ) : (
              <div className="h-16 w-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                {lang === "ar" ? "لا شعار" : "No logo"}
              </div>
            )}
            <div className="space-y-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
              />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} className="gap-2">
                <Upload className="w-4 h-4" />
                {uploading ? "..." : (lang === "ar" ? "رفع شعار جديد" : "Upload new logo")}
              </Button>
              {settings.logo_url && (
                <Button variant="ghost" size="sm" onClick={() => setSettings({ ...settings, logo_url: null })} className="text-destructive text-xs">
                  {lang === "ar" ? "إزالة الشعار" : "Remove logo"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo Customization */}
      <Card>
        <CardContent className="p-4 space-y-5">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            <Label className="font-medium">{lang === "ar" ? "تخصيص الشعار في الصفحة الرئيسية" : "Homepage Logo Customization"}</Label>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">{lang === "ar" ? "حجم الشعار (بكسل)" : "Logo Size (px)"}: {logoH}px</Label>
            <Slider
              value={[logoH]}
              onValueChange={([v]) => setSettings({ ...settings, logo_height: String(v) })}
              min={24}
              max={120}
              step={4}
            />
          </div>

          {/* Alignment */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">{lang === "ar" ? "محاذاة الشعار" : "Logo Alignment"}</Label>
            <Select value={settings.logo_alignment} onValueChange={v => setSettings({ ...settings, logo_alignment: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">{lang === "ar" ? "بداية (افتراضي)" : "Start (default)"}</SelectItem>
                <SelectItem value="center">{lang === "ar" ? "وسط" : "Center"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Border Radius */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">{lang === "ar" ? "استدارة الزوايا" : "Border Radius"}: {settings.logo_border_radius}px</Label>
            <Slider
              value={[parseInt(settings.logo_border_radius) || 8]}
              onValueChange={([v]) => setSettings({ ...settings, logo_border_radius: String(v) })}
              min={0}
              max={32}
              step={2}
            />
          </div>

          {/* Background */}
          <div className="flex items-center justify-between">
            <Label className="text-sm">{lang === "ar" ? "خلفية شفافة للشعار" : "Logo Background"}</Label>
            <div className="flex items-center gap-2">
              <Switch checked={settings.logo_bg_enabled} onCheckedChange={v => setSettings({ ...settings, logo_bg_enabled: v })} />
              <span className="text-xs text-muted-foreground">{settings.logo_bg_enabled ? (lang === "ar" ? "مفعّل" : "On") : (lang === "ar" ? "معطّل" : "Off")}</span>
            </div>
          </div>

          {/* Preview */}
          {settings.logo_url && (
            <div className="mt-3 p-4 rounded-lg border bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">{lang === "ar" ? "معاينة" : "Preview"}</p>
              <div className={`flex ${settings.logo_alignment === "center" ? "justify-center" : "justify-start"}`}>
                <img
                  src={settings.logo_url}
                  alt="Preview"
                  style={{
                    height: `${logoH}px`,
                    borderRadius: `${settings.logo_border_radius}px`,
                  }}
                  className={`object-contain ${settings.logo_bg_enabled ? "bg-card/80 backdrop-blur-sm px-4 py-2" : ""}`}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Site Name */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Label className="font-medium">{lang === "ar" ? "اسم الموقع" : "Site Name"}</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">{lang === "ar" ? "عربي" : "Arabic"}</Label>
              <Input
                value={settings.site_name_ar}
                onChange={(e) => setSettings({ ...settings, site_name_ar: e.target.value })}
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">{lang === "ar" ? "إنجليزي" : "English"}</Label>
              <Input
                value={settings.site_name_en}
                onChange={(e) => setSettings({ ...settings, site_name_en: e.target.value })}
                dir="ltr"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Label className="font-medium">{lang === "ar" ? "الألوان" : "Colors"}</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">{lang === "ar" ? "اللون الرئيسي" : "Primary Color"}</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="w-10 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  dir="ltr"
                  className="w-32"
                />
                <div className="h-10 flex-1 rounded" style={{ background: settings.primary_color }} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">{lang === "ar" ? "اللون الثانوي" : "Accent Color"}</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.accent_color}
                  onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                  className="w-10 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={settings.accent_color}
                  onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                  dir="ltr"
                  className="w-32"
                />
                <div className="h-10 flex-1 rounded" style={{ background: settings.accent_color }} />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 rounded-lg border" style={{ background: `linear-gradient(135deg, ${settings.primary_color}, ${settings.accent_color})` }}>
            <p className="text-white font-bold text-center">{lang === "ar" ? "معاينة الألوان" : "Color Preview"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving} className="gradient-accent text-accent-foreground gap-2">
          <Save className="w-4 h-4" />
          {saving ? "..." : (lang === "ar" ? "حفظ الإعدادات" : "Save Settings")}
        </Button>
      </div>
    </div>
  );
};

export default BrandingSettings;
