import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, Save, RotateCcw } from "lucide-react";
import {
  ALL_PERMISSIONS,
  PERMISSION_LABELS,
  getDefaultPermissions,
  type PermissionKey,
} from "@/hooks/useUserPermissions";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  userRole: string;
}

const UserPermissionsDialog = ({ open, onOpenChange, userId, userName, userRole }: Props) => {
  const { lang } = useLanguage();
  const [perms, setPerms] = useState<Record<PermissionKey, boolean | null>>({} as any);
  const [saving, setSaving] = useState(false);

  const defaults = getDefaultPermissions(userRole);

  useEffect(() => {
    if (open) loadCustomPerms();
  }, [open, userId]);

  const loadCustomPerms = async () => {
    const { data } = await supabase
      .from("user_permissions")
      .select("permission_key, granted")
      .eq("user_id", userId);

    const result: Record<string, boolean | null> = {};
    ALL_PERMISSIONS.forEach(k => { result[k] = null; }); // null = use default
    data?.forEach((p: any) => { result[p.permission_key] = p.granted; });
    setPerms(result as any);
  };

  const getEffective = (key: PermissionKey): boolean => {
    if (perms[key] !== null && perms[key] !== undefined) return perms[key]!;
    return defaults.includes(key);
  };

  const isCustomized = (key: PermissionKey): boolean => {
    return perms[key] !== null && perms[key] !== undefined;
  };

  const togglePerm = (key: PermissionKey) => {
    const current = getEffective(key);
    setPerms(prev => ({ ...prev, [key]: !current }));
  };

  const resetToDefault = (key: PermissionKey) => {
    setPerms(prev => ({ ...prev, [key]: null }));
  };

  const resetAll = () => {
    const result: Record<string, boolean | null> = {};
    ALL_PERMISSIONS.forEach(k => { result[k] = null; });
    setPerms(result as any);
  };

  const savePerms = async () => {
    setSaving(true);
    // Delete all existing custom permissions for this user
    await supabase.from("user_permissions").delete().eq("user_id", userId);

    // Insert only customized ones
    const inserts = ALL_PERMISSIONS
      .filter(k => perms[k] !== null && perms[k] !== undefined)
      .map(k => ({ user_id: userId, permission_key: k, granted: perms[k]! }));

    if (inserts.length > 0) {
      const { error } = await supabase.from("user_permissions").insert(inserts);
      if (error) { toast.error(error.message); setSaving(false); return; }
    }

    toast.success(lang === "ar" ? "تم حفظ الصلاحيات" : "Permissions saved");
    setSaving(false);
    onOpenChange(false);
  };

  const permGroups = [
    { label: lang === "ar" ? "المرشحين" : "Applicants", keys: ["view_applicants", "edit_applicants"] as PermissionKey[] },
    { label: lang === "ar" ? "الوظائف" : "Jobs", keys: ["view_jobs", "edit_jobs"] as PermissionKey[] },
    { label: lang === "ar" ? "المشاريع" : "Projects", keys: ["view_projects", "edit_projects"] as PermissionKey[] },
    { label: lang === "ar" ? "الإحصائيات" : "Analytics", keys: ["view_analytics"] as PermissionKey[] },
    { label: lang === "ar" ? "النظام" : "System", keys: ["manage_settings", "manage_users", "manage_backup"] as PermissionKey[] },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {lang === "ar" ? `صلاحيات: ${userName}` : `Permissions: ${userName}`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">{lang === "ar" ? `الدور: ${userRole}` : `Role: ${userRole}`}</Badge>
          <Button variant="ghost" size="sm" onClick={resetAll} className="gap-1 text-xs">
            <RotateCcw className="w-3 h-3" />
            {lang === "ar" ? "إعادة للافتراضي" : "Reset to defaults"}
          </Button>
        </div>

        <div className="space-y-5">
          {permGroups.map(group => (
            <div key={group.label}>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">{group.label}</h4>
              <div className="space-y-2">
                {group.keys.map(key => {
                  const effective = getEffective(key);
                  const custom = isCustomized(key);
                  const isDefault = defaults.includes(key);
                  return (
                    <div key={key} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={effective}
                          onCheckedChange={() => togglePerm(key)}
                        />
                        <Label className="text-sm cursor-pointer" onClick={() => togglePerm(key)}>
                          {lang === "ar" ? PERMISSION_LABELS[key].ar : PERMISSION_LABELS[key].en}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        {custom ? (
                          <>
                            <Badge variant="secondary" className="text-[10px]">
                              {lang === "ar" ? "مخصص" : "Custom"}
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => resetToDefault(key)}>
                              <RotateCcw className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            {lang === "ar" ? "افتراضي" : "Default"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={savePerms} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? "..." : (lang === "ar" ? "حفظ الصلاحيات" : "Save Permissions")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;
