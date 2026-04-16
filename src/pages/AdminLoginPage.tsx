import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Shield, Mail, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.jpg";

const AdminLoginPage = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"credentials" | "waiting">("credentials");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Don't auto-redirect during the login flow (credentials → OTP)
      if (session && !isLoggingIn && step !== "otp") {
        navigate("/admin", { replace: true });
      }
      setChecking(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !isLoggingIn) navigate("/admin", { replace: true });
      setChecking(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate, step, isLoggingIn]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((v) => v - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleLogin = async () => {
    if (!email || !password) { toast.error(t("validation.required")); return; }
    setLoading(true);
    setIsLoggingIn(true);

    // Step 1: Verify credentials
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(t("dash.loginError"));
      setLoading(false);
      setIsLoggingIn(false);
      return;
    }

    // Step 2: Sign out and send OTP for 2FA
    await supabase.auth.signOut();

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (otpError) {
      toast.error(t("admin.otpSendError"));
      setLoading(false);
      setIsLoggingIn(false);
      return;
    }

    toast.success(t("admin.otpSent"));
    setStep("otp");
    setResendTimer(60);
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length < 6) { toast.error(t("validation.required")); return; }
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: "email",
    });

    if (error) {
      toast.error(t("admin.otpInvalid"));
      setOtpCode("");
      setLoading(false);
      return;
    }

    setIsLoggingIn(false);
    navigate("/admin", { replace: true });
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (error) {
      toast.error(t("admin.otpSendError"));
    } else {
      toast.success(t("admin.otpSent"));
      setResendTimer(60);
      setOtpCode("");
    }
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
          <p className="text-sm text-muted-foreground mt-2">
            {step === "credentials" ? t("admin.loginDesc") : t("admin.otpDesc")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "credentials" ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("dash.email")}</label>
                <Input value={email} onChange={e => setEmail(e.target.value)} type="email" dir="ltr" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("dash.password")}</label>
                <Input value={password} onChange={e => setPassword(e.target.value)} type="password" dir="ltr" onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
              <Button onClick={handleLogin} className="w-full gradient-primary text-primary-foreground gap-2" disabled={loading}>
                {loading ? "..." : (
                  <>
                    <Shield className="w-4 h-4" />
                    {t("dash.loginBtn")}
                  </>
                )}
              </Button>
              <div className="flex justify-center">
                <Link to="/admin/forgot-password" className="text-sm text-primary hover:underline">
                  {t("admin.forgotPassword")}
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-lg mb-4">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{email}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("admin.otpLabel")}</label>
                <div className="flex justify-center" dir="ltr">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={setOtpCode}
                    onComplete={handleVerifyOtp}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button onClick={handleVerifyOtp} className="w-full gradient-primary text-primary-foreground gap-2" disabled={loading || otpCode.length < 6}>
                {loading ? "..." : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    {t("admin.verifyOtp")}
                  </>
                )}
              </Button>

              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || loading}
                  className="text-sm"
                >
                  {resendTimer > 0
                    ? `${t("admin.resendOtp")} (${resendTimer}s)`
                    : t("admin.resendOtp")}
                </Button>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => { setStep("credentials"); setOtpCode(""); }}
                  className="text-sm text-muted-foreground"
                >
                  {t("admin.backToLogin")}
                </Button>
              </div>
            </>
          )}

          <div className="flex justify-center pt-2"><TopBar variant="dark" /></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
