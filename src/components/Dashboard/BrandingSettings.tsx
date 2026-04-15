import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Palette, Upload, Save } from "lucide-react";
import { invalidateSiteSettingsCache } from "@/hooks/useSiteSettings";

interface Settings {
  id: string;
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
  site_name_ar: string;
  site_name_en: string;
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
    if (data) setSettings(data as Settings);
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
      })
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5" />
        <h3 className="text-lg font-bold">{lang === "ar" ? "تخصيص الهوية البصرية" : "Branding Settings"}</h3>
      </div>

      {/* Logo */}
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
            <div>
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
            </div>
          </div>
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
