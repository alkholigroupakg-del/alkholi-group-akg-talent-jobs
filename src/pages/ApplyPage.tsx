import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ApplicationForm from "@/components/ApplicationForm/ApplicationForm";
import TopBar from "@/components/TopBar";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.jpg";

const ApplyPage = () => {
  const { t, dir } = useLanguage();
  const [searchParams] = useSearchParams();
  const preSelectedPosition = searchParams.get("position") || "";

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="gradient-hero py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img src={logo} alt="AlKholi Group" className="h-12 object-contain" />
          <div className="flex items-center gap-3">
            <TopBar variant="light" />
            <span className="text-primary-foreground/80 text-sm font-medium">{t("nav.formTitle")}</span>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <main className="py-10 px-4">
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">{t("apply.title")}</h1>
          <p className="text-muted-foreground text-lg">{t("apply.desc")}</p>
        </div>
        <ApplicationForm preSelectedPosition={preSelectedPosition} />
      </main>

      {/* Footer */}
      <footer className="gradient-hero py-6 px-4 mt-10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} {t("footer.rights")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ApplyPage;
