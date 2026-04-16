import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ALL_PERMISSIONS = [
  "view_applicants",
  "edit_applicants",
  "view_jobs",
  "edit_jobs",
  "view_projects",
  "edit_projects",
  "view_analytics",
  "manage_settings",
  "manage_users",
  "manage_backup",
] as const;

export type PermissionKey = (typeof ALL_PERMISSIONS)[number];

export const PERMISSION_LABELS: Record<PermissionKey, { ar: string; en: string }> = {
  view_applicants: { ar: "عرض المرشحين", en: "View Applicants" },
  edit_applicants: { ar: "تعديل المرشحين", en: "Edit Applicants" },
  view_jobs: { ar: "عرض الوظائف", en: "View Jobs" },
  edit_jobs: { ar: "تعديل الوظائف", en: "Edit Jobs" },
  view_projects: { ar: "عرض المشاريع", en: "View Projects" },
  edit_projects: { ar: "تعديل المشاريع", en: "Edit Projects" },
  view_analytics: { ar: "عرض الإحصائيات", en: "View Analytics" },
  manage_settings: { ar: "إدارة الإعدادات", en: "Manage Settings" },
  manage_users: { ar: "إدارة المستخدمين", en: "Manage Users" },
  manage_backup: { ar: "إدارة النسخ الاحتياطي", en: "Manage Backup" },
};

// Default permissions per role
const ROLE_DEFAULTS: Record<string, PermissionKey[]> = {
  admin: [...ALL_PERMISSIONS],
  hr_manager: ["view_applicants", "edit_applicants", "view_jobs", "edit_jobs", "view_projects", "view_analytics"],
  recruitment_coordinator: ["view_applicants", "edit_applicants", "view_jobs", "edit_jobs", "view_projects", "view_analytics"],
  project_manager: ["view_applicants", "view_jobs", "view_projects", "view_analytics"],
};

export const getDefaultPermissions = (role: string): PermissionKey[] => {
  return ROLE_DEFAULTS[role] || [];
};

export const useUserPermissions = () => {
  const [permissions, setPermissions] = useState<Record<PermissionKey, boolean>>({} as any);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // Get role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    const userRole = roleData?.role || "";
    setRole(userRole);
    const defaults = getDefaultPermissions(userRole);

    // Get custom overrides
    const { data: customPerms } = await supabase
      .from("user_permissions")
      .select("permission_key, granted")
      .eq("user_id", user.id);

    const overrides: Record<string, boolean> = {};
    customPerms?.forEach((p: any) => { overrides[p.permission_key] = p.granted; });

    // Build final permissions
    const result: Record<string, boolean> = {};
    ALL_PERMISSIONS.forEach(key => {
      if (key in overrides) {
        result[key] = overrides[key];
      } else {
        result[key] = defaults.includes(key);
      }
    });

    setPermissions(result as Record<PermissionKey, boolean>);
    setLoading(false);
  };

  const hasPermission = (key: PermissionKey): boolean => {
    return permissions[key] ?? false;
  };

  return { permissions, loading, role, hasPermission, reload: loadPermissions };
};
