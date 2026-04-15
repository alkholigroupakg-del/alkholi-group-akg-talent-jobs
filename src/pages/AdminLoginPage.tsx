import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import logo from "@/assets/logo.jpg";

const AdminLoginPage = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/admin", { replace: true });
      }
      setChecking(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin", { replace: true });
      setChecking(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) { toast.error(t("validation.required")); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(t("dash.loginError"));
    setLoading(false);
  };

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center" dir={dir}>
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <img src={logo} alt="AlKholi Group" className="h-16 mx-auto mb-4 object-contain" />
          <CardTitle className="text-2xl">{t("dash.login")}</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">{t("admin.loginDesc")}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("dash.email")}</label>
            <Input value={email} onChange={e => setEmail(e.target.value)} type="email" dir="ltr" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("dash.password")}</label>
            <Input value={password} onChange={e => setPassword(e.target.value)} type="password" dir="ltr" onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <Button onClick={handleLogin} className="w-full gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? "..." : t("dash.loginBtn")}
          </Button>
          <div className="flex justify-center">
            <Link to="/admin/forgot-password" className="text-sm text-primary hover:underline">
              {t("admin.forgotPassword")}
            </Link>
          </div>
          <div className="flex justify-center pt-2"><TopBar variant="dark" /></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
