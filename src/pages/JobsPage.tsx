import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase, ArrowLeft, ArrowRight, Search, Filter, LogIn, Flag, Hash } from "lucide-react";
import logo from "@/assets/logo.jpg";

interface JobPosting {
  id: string;
  title_ar: string;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  location: string;
  location_en: string | null;
  job_type: string;
  job_type_en: string | null;
  department: string | null;
  department_en: string | null;
  requirements_ar: string | null;
  requirements_en: string | null;
  is_active: boolean;
  nationality_required: string | null;
  nationality_required_en: string | null;
  vacancy_count: number;
  created_at: string;
}

const JobsPage = () => {
  const { t, dir, lang } = useLanguage();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!error && data) setJobs(data as JobPosting[]);
    setLoading(false);
  };

  const filtered = jobs.filter(job => {
    const title = lang === "ar" ? job.title_ar : (job.title_en || job.title_ar);
    const dept = lang === "ar" ? (job.department || "") : (job.department_en || job.department || "");
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const biField = (ar: string | null, en: string | null) =>
    lang === "ar" ? (ar || en || "") : (en || ar || "");


  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-6">
          <div className="flex items-center gap-6">
            <Link to="/">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-primary">ALKHOLI</span>
                <span className="text-xl font-black text-accent">GROUP</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                {t("nav.home")}
              </Link>
              <Link to="/jobs" className="text-accent font-semibold">
                {t("nav.jobs")}
              </Link>
            </div>
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

      {/* Hero Section */}
      <section className="bg-muted/30 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4">{t("jobs.title")}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("jobs.desc")}</p>
          {/* Job Count Badge */}
          <div className="mt-4 inline-flex items-center gap-2 bg-accent/10 text-accent border border-accent/20 rounded-full px-5 py-2 font-semibold">
            <Hash className="w-4 h-4" />
            {lang === "ar" 
              ? `${filtered.length} وظيفة متاحة حالياً`
              : `${filtered.length} jobs available now`
            }
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-6 -mt-6">
        <div className="bg-card rounded-xl border border-border shadow-sm p-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 w-5 h-5 text-muted-foreground" style={{ [dir === "rtl" ? "right" : "left"]: "0.75rem" }} />
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={t("jobs.searchPlaceholder")}
              className="border-0 bg-transparent shadow-none"
              style={{ [dir === "rtl" ? "paddingRight" : "paddingLeft"]: "2.5rem" }}
            />
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">{t("jobs.noJobs")}</p>
            <Link to="/apply" className="inline-block mt-6">
              <Button className="bg-foreground text-background hover:bg-foreground/90 gap-2 rounded-full px-8">
                {t("nav.apply")}
                <Arrow className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(job => {
              const title = lang === "ar" ? job.title_ar : (job.title_en || job.title_ar);
              const natLabel = getNationalityLabel(job.nationality_required);
              return (
                <div key={job.id} className="bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                  <div className="p-6 flex-1">
                    {/* Header with icon and badge */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <Badge className="bg-accent/10 text-accent border-0 font-medium">
                        {t("jobs.available")} · {job.vacancy_count} {t("jobs.vacancies")}
                      </Badge>
                    </div>

                    {/* Job Info */}
                    <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{getDeptLabel(job.department)}</p>
                    {(lang === "ar" ? job.description_ar : (job.description_en || job.description_ar)) && (
                      <p className="text-muted-foreground text-xs mb-4 line-clamp-2">
                        {lang === "ar" ? job.description_ar : (job.description_en || job.description_ar)}
                      </p>
                    )}

                    {/* Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-accent shrink-0" />
                        <span>{getLocationLabel(job.location)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-accent shrink-0" />
                        <span>{getJobTypeLabel(job.job_type)}</span>
                      </div>
                      {natLabel && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Flag className="w-4 h-4 text-accent shrink-0" />
                          <span>{natLabel}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="px-6 pb-6">
                    <Link to={`/apply?position=${encodeURIComponent(title)}`} className="block">
                      <Button className="w-full bg-foreground text-background hover:bg-foreground/90 gap-2 rounded-lg font-semibold py-5">
                        {t("jobs.applyNow")}
                        <Arrow className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

export default JobsPage;
