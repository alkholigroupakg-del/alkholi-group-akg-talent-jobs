import { useState, useEffect, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  children: ReactNode;
}

const AdminGuard = ({ children }: Props) => {
  const [session, setSession] = useState<any>(undefined); // undefined = loading
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    supabase
      .from("profiles")
      .select("is_active")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setIsActive(data?.is_active ?? false);
      });
  }, [session]);

  if (session === undefined || (session && isActive === undefined)) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;
  }

  if (!session || !isActive) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
