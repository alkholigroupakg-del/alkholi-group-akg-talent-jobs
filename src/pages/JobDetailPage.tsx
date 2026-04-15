import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Clock, Briefcase, ArrowLeft, ArrowRight, Flag, Hash,
  GraduationCap, CalendarDays, FileText, LogIn, ChevronRight, ChevronLeft,
} from "lucide-react";
import logo from "@/assets/logo.jpg";

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, dir, lang } = useLanguage();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const BackArrow = lang === "ar" ? ArrowRight : ArrowLeft;
  const ForwardArrow = lang === "ar" ? ChevronLeft : ChevronRight;

  useEffect(() => {
    if (!id) return;
    supabase
      .from("job_postings")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setJob(data);
        setLoading(false);
      });
  }, [id]);

  const bi = (ar: string | null, en: string | null) =>
    lang === "ar" ? (ar || en || "") : (en || ar || "");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4" dir={dir}>
        <Briefcase className="w-16 h-16 text-muted-foreground" />
        <p className="text-xl text-muted-foreground">{t("jobDetail.notFound")}</p>
        <Link to="/jobs">
          <Button variant="outline">{t("jobDetail.backToJobs")}</Button>
        </Link>
      </div>
    );
  }

  const title = bi(job.title_ar, job.title_en);
  const description = bi(job.description_ar, job.description_en);
  const requirements = bi(job.requirements_ar, job.requirements_en);
  const department = bi(job.department, job.department_en);
  const location = bi(job.location, job.location_en);
  const jobType = bi(job.job_type, job.job_type_en);
  const nationality = bi(job.nationality_required, job.nationality_required_en);
  const experienceReq = bi(job.experience_required_ar, job.experience_required_en);
  const degreeReq = bi(job.degree_required_ar, job.degree_required_en);
  const additionalDetails = bi(job.additional_details_ar, job.additional_details_en);

  const infoItems = [
    { icon: MapPin, label: t("jobs.location"), value: location },
    { icon: Clock, label: t("jobs.type"), value: jobType },
    { icon: Briefcase, label: t("jobs.department"), value: department },
    { icon: Flag, label: t("dash.nationalityRequired"), value: nationality },
    { icon: CalendarDays, label: t("jobDetail.experienceRequired"), value: experienceReq },
    { icon: GraduationCap, label: t("jobDetail.degreeRequired"), value: degreeReq },
    { icon: Hash, label: t("jobDetail.vacancies"), value: `${job.vacancy_count}` },
  ].filter(item => item.value);

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/jobs")}>
              <BackArrow className="w-5 h-5" />
            </Button>
            <Link to="/">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-primary">ALKHOLI</span>
                <span className="text-xl font-black text-accent">GROUP</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <TopBar variant="dark" />
            <Link to="/dashboard">
              <Button className="bg-foreground text-background hover:bg-foreground/90 gap-2 font-semibold rounded-full px-6">
                <LogIn className="w-4 h-4" />
                {t("dash.login")}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-muted/30 py-12 px-6 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/jobs" className="hover:text-foreground transition-colors">{t("nav.jobs")}</Link>
            <ForwardArrow className="w-4 h-4" />
            <span className="text-foreground font-medium">{title}</span>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3">{title}</h1>
              {department && <p className="text-muted-foreground text-lg">{department}</p>}
            </div>
            <Badge className="bg-accent/10 text-accent border-0 font-semibold text-base px-4 py-2">
              {t("jobs.available")} · {job.vacancy_count} {t("jobs.vacancies")}
            </Badge>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {infoItems.map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-semibold text-sm text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            {description && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  {t("jobDetail.description")}
                </h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{description}</div>
              </div>
            )}

            {/* Requirements */}
            {requirements && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-accent" />
                  {t("jobDetail.requirements")}
                </h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{requirements}</div>
              </div>
            )}

            {/* Additional Details */}
            {additionalDetails && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-accent" />
                  {t("jobDetail.additionalDetails")}
                </h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{additionalDetails}</div>
              </div>
            )}
          </div>

          {/* Sidebar - Apply */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24 space-y-4">
              <h3 className="text-lg font-bold text-foreground">{t("jobDetail.interestedTitle")}</h3>
              <p className="text-sm text-muted-foreground">{t("jobDetail.interestedDesc")}</p>
              <Link to={`/apply?position=${encodeURIComponent(title)}`} className="block">
                <Button className="w-full bg-foreground text-background hover:bg-foreground/90 gap-2 rounded-lg font-semibold py-6 text-base">
                  {t("jobs.applyNow")}
                  <ForwardArrow className="w-5 h-5" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground text-center">
                {t("jobDetail.postedOn")} {new Date(job.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 px-4 mt-10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {t("footer.rights")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default JobDetailPage;
