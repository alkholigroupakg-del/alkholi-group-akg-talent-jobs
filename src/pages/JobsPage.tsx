import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Building2, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.jpg";

interface JobPosting {
  id: string;
  title_ar: string;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  location: string;
  job_type: string;
  department: string | null;
  requirements_ar: string | null;
  requirements_en: string | null;
  is_active: boolean;
  created_at: string;
}

const JobsPage = () => {
  const { t, dir, lang } = useLanguage();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="gradient-hero py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/">
            <img src={logo} alt="AlKholi Group" className="h-12 object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <TopBar />
            <Link to="/apply">
              <Button className="gradient-accent text-accent-foreground hover:opacity-90 gap-2 font-semibold">
                {t("nav.apply")}
                <Arrow className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black text-primary-foreground mb-4">{t("jobs.title")}</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">{t("jobs.desc")}</p>
        </div>
      </section>

      {/* Jobs Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">{t("jobs.noJobs")}</p>
            <Link to="/apply" className="inline-block mt-6">
              <Button className="gradient-accent text-accent-foreground hover:opacity-90 gap-2">
                {t("nav.apply")}
                <Arrow className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <Card key={job.id} className="group hover:shadow-elevated transition-all duration-300 border-border hover:border-accent/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="gradient-primary p-4">
                    <h3 className="text-lg font-bold text-primary-foreground">
                      {lang === "ar" ? job.title_ar : (job.title_en || job.title_ar)}
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {(lang === "ar" ? job.description_ar : (job.description_en || job.description_ar)) && (
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {lang === "ar" ? job.description_ar : (job.description_en || job.description_ar)}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <MapPin className="w-3 h-3" />{job.location}
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Briefcase className="w-3 h-3" />{job.job_type}
                      </Badge>
                      {job.department && (
                        <Badge variant="secondary" className="gap-1">
                          <Building2 className="w-3 h-3" />{job.department}
                        </Badge>
                      )}
                    </div>
                    {(lang === "ar" ? job.requirements_ar : (job.requirements_en || job.requirements_ar)) && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {lang === "ar" ? job.requirements_ar : (job.requirements_en || job.requirements_ar)}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(job.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                      </span>
                      <Link to="/apply">
                        <Button size="sm" className="gradient-accent text-accent-foreground hover:opacity-90 gap-1 text-xs">
                          {t("jobs.applyNow")}
                          <Arrow className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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

export default JobsPage;
