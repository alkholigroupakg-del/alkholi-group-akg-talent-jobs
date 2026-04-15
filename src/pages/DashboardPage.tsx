import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, UserPlus, Phone, CheckCircle2, Download, LogOut, Search, Eye, BarChart3, Briefcase, FileText, ExternalLink, Plus, Pencil, Trash2, FolderOpen, Settings, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import * as XLSX from "xlsx";
import logo from "@/assets/logo.jpg";
import { Link } from "react-router-dom";
import CustomQuestionsSettings from "@/components/Dashboard/CustomQuestionsSettings";
import DropdownOptionsSettings from "@/components/Dashboard/DropdownOptionsSettings";
import BrandingSettings from "@/components/Dashboard/BrandingSettings";
import BackupSettings from "@/components/Dashboard/BackupSettings";

type ApplicantStatus = "new" | "reviewing" | "phone_interview" | "in_person_interview" | "accepted" | "hired" | "rejected" | "withdrawn";

interface Applicant {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  desired_position: string | null;
  preferred_city: string | null;
  status: ApplicantStatus;
  notes: string | null;
  created_at: string;
  gender: string | null;
  nationality: string | null;
  education_level: string | null;
  years_experience: string | null;
  current_salary: string | null;
  expected_salary: string | null;
  job_type: string | null;
  major: string | null;
  university: string | null;
  current_title: string | null;
  linkedin: string | null;
  arabic_level: string | null;
  english_level: string | null;
  available_date: string | null;
  birth_date: string | null;
  marital_status: string | null;
  has_transport: string | null;
  current_city: string | null;
  dependents: number | null;
  gpa: string | null;
  graduation_year: string | null;
  self_summary: string | null;
  current_tasks: string | null;
  other_experience: string | null;
  other_language: string | null;
  hear_about: string | null;
  currently_employed: string | null;
  currently_studying: string | null;
  current_study: string | null;
  resume_url: string | null;
  degree_url: string | null;
  experience_cert_url: string | null;
  training_certs_url: string | null;
  other_docs_url: string | null;
}

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

const STATUSES: ApplicantStatus[] = ["new", "reviewing", "phone_interview", "in_person_interview", "accepted", "hired", "rejected", "withdrawn"];
const ROLES = ["admin", "hr_manager", "recruitment_coordinator", "project_manager"] as const;

const STATUS_COLORS: Record<ApplicantStatus, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  reviewing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  phone_interview: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  in_person_interview: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  accepted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  hired: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  withdrawn: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

const CHART_COLORS = ["#3b82f6", "#eab308", "#a855f7", "#6366f1", "#22c55e", "#10b981", "#ef4444", "#6b7280"];

const DashboardPage = () => {
  const { t, dir, lang } = useLanguage();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [activeTab, setActiveTab] = useState("applicants");

  // Job form state
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [jobForm, setJobForm] = useState({
    title_ar: "", title_en: "", description_ar: "", description_en: "",
    location: "الرياض، المملكة العربية السعودية", location_en: "Riyadh, Saudi Arabia",
    job_type: "دوام كامل", job_type_en: "Full-time",
    department: "", department_en: "", requirements_ar: "", requirements_en: "",
    is_active: true, nationality_required: "", nationality_required_en: "", vacancy_count: 1,
    experience_required_ar: "", experience_required_en: "",
    degree_required_ar: "", degree_required_en: "",
    additional_details_ar: "", additional_details_en: "",
  });

  // User form state
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState<string>("recruitment_coordinator");
  const [users, setUsers] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);

  // Project form state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ name_ar: "", name_en: "", description_ar: "" });
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchApplicants();
    fetchJobs();
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchApplicants = async () => {
    const { data, error } = await supabase
      .from("applicants")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setApplicants(data as Applicant[]);
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setJobs(data as JobPosting[]);
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data);
  };

  const fetchUsers = async () => {
    const { data: profilesData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: rolesData } = await supabase.from("user_roles").select("*");
    if (profilesData) setUsers(profilesData);
    if (rolesData) setUserRoles(rolesData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  const updateStatus = async (id: string, status: ApplicantStatus) => {
    const { error } = await supabase.from("applicants").update({ status }).eq("id", id);
    if (!error) {
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      if (selectedApplicant?.id === id) setSelectedApplicant(prev => prev ? { ...prev, status } : null);
      toast.success(t("dash.updateStatus"));
    }
  };

  const saveNotes = async (id: string) => {
    const { error } = await supabase.from("applicants").update({ notes: editNotes }).eq("id", id);
    if (!error) {
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, notes: editNotes } : a));
      toast.success(t("dash.saveNotes"));
    }
  };

  const getFileUrl = (path: string | null) => {
    if (!path) return "";
    // Already a full URL
    if (path.startsWith("http")) return path;
    // Build public URL from storage path
    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `${baseUrl}/storage/v1/object/public/resumes/${path}`;
  };

  const exportExcel = () => {
    const rows = applicants.map(a => ({
      [t("dash.name")]: a.full_name,
      [t("field.email")]: a.email,
      [t("field.phone")]: a.phone,
      [t("field.gender")]: a.gender,
      [t("field.nationality")]: a.nationality,
      [t("field.birthDate")]: a.birth_date,
      [t("field.maritalStatus")]: a.marital_status,
      [t("field.dependents")]: a.dependents,
      [t("field.currentCity")]: a.current_city,
      [t("field.hasTransport")]: a.has_transport,
      [t("dash.position")]: a.desired_position,
      [t("field.jobType")]: a.job_type,
      [t("dash.city")]: a.preferred_city,
      [t("field.hearAbout")]: a.hear_about,
      [t("field.educationLevel")]: a.education_level,
      [t("field.major")]: a.major,
      [t("field.university")]: a.university,
      [t("field.graduationYear")]: a.graduation_year,
      [t("field.gpa")]: a.gpa,
      [t("field.currentlyStudying")]: a.currently_studying,
      [t("field.currentStudy")]: a.current_study,
      [t("field.yearsExperience")]: a.years_experience,
      [t("field.currentlyEmployed")]: a.currently_employed,
      [t("field.currentTitle")]: a.current_title,
      [t("field.currentTasks")]: a.current_tasks,
      [t("field.selfSummary")]: a.self_summary,
      [t("field.otherExperience")]: a.other_experience,
      [t("field.arabicLevel")]: a.arabic_level,
      [t("field.englishLevel")]: a.english_level,
      [t("field.otherLanguage")]: a.other_language,
      [t("field.linkedin")]: a.linkedin,
      [t("field.currentSalary")]: a.current_salary,
      [t("field.expectedSalary")]: a.expected_salary,
      [t("field.availableDate")]: a.available_date,
      [t("dash.status")]: t(`status.${a.status}`),
      [t("dash.date")]: new Date(a.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US"),
      [t("dash.notes")]: a.notes,
      [t("field.resume")]: getFileUrl(a.resume_url),
      [t("field.degreeCopy")]: getFileUrl(a.degree_url),
      [t("field.experienceCert")]: getFileUrl(a.experience_cert_url),
      [t("field.trainingCerts")]: getFileUrl(a.training_certs_url),
      [t("field.otherDocs")]: getFileUrl(a.other_docs_url),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t("dash.applicants"));
    XLSX.writeFile(wb, `applicants_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  // Job CRUD
  const openJobForm = (job?: JobPosting) => {
    if (job) {
      setEditingJob(job);
      setJobForm({
        title_ar: job.title_ar,
        title_en: job.title_en || "",
        description_ar: job.description_ar || "",
        description_en: job.description_en || "",
        location: job.location,
        location_en: (job as any).location_en || "",
        job_type: job.job_type,
        job_type_en: (job as any).job_type_en || "",
        department: job.department || "",
        department_en: (job as any).department_en || "",
        requirements_ar: job.requirements_ar || "",
        requirements_en: job.requirements_en || "",
        is_active: job.is_active,
        nationality_required: job.nationality_required || "",
        nationality_required_en: (job as any).nationality_required_en || "",
        vacancy_count: (job as any).vacancy_count || 1,
        experience_required_ar: (job as any).experience_required_ar || "",
        experience_required_en: (job as any).experience_required_en || "",
        degree_required_ar: (job as any).degree_required_ar || "",
        degree_required_en: (job as any).degree_required_en || "",
        additional_details_ar: (job as any).additional_details_ar || "",
        additional_details_en: (job as any).additional_details_en || "",
      });
    } else {
      setEditingJob(null);
      setJobForm({
        title_ar: "", title_en: "", description_ar: "", description_en: "",
        location: "الرياض، المملكة العربية السعودية", location_en: "Riyadh, Saudi Arabia",
        job_type: "دوام كامل", job_type_en: "Full-time",
        department: "", department_en: "", requirements_ar: "", requirements_en: "",
        is_active: true, nationality_required: "", nationality_required_en: "", vacancy_count: 1,
        experience_required_ar: "", experience_required_en: "",
        degree_required_ar: "", degree_required_en: "",
        additional_details_ar: "", additional_details_en: "",
      });
    }
    setShowJobForm(true);
  };

  const saveJob = async () => {
    if (!jobForm.title_ar) { toast.error(t("validation.required")); return; }
    const payload = {
      title_ar: jobForm.title_ar,
      title_en: jobForm.title_en || null,
      description_ar: jobForm.description_ar || null,
      description_en: jobForm.description_en || null,
      location: jobForm.location,
      location_en: jobForm.location_en || null,
      job_type: jobForm.job_type,
      job_type_en: jobForm.job_type_en || null,
      department: jobForm.department || null,
      department_en: jobForm.department_en || null,
      requirements_ar: jobForm.requirements_ar || null,
      requirements_en: jobForm.requirements_en || null,
      is_active: jobForm.is_active,
      nationality_required: jobForm.nationality_required || null,
      nationality_required_en: jobForm.nationality_required_en || null,
      vacancy_count: jobForm.vacancy_count || 1,
      experience_required_ar: jobForm.experience_required_ar || null,
      experience_required_en: jobForm.experience_required_en || null,
      degree_required_ar: jobForm.degree_required_ar || null,
      degree_required_en: jobForm.degree_required_en || null,
      additional_details_ar: jobForm.additional_details_ar || null,
      additional_details_en: jobForm.additional_details_en || null,
    };

    if (editingJob) {
      const { error } = await supabase.from("job_postings").update(payload).eq("id", editingJob.id);
      if (!error) { toast.success(t("dash.saved")); fetchJobs(); setShowJobForm(false); }
    } else {
      const { error } = await supabase.from("job_postings").insert(payload);
      if (!error) { toast.success(t("dash.saved")); fetchJobs(); setShowJobForm(false); }
    }
  };

  const deleteJob = async (id: string) => {
    const { error } = await supabase.from("job_postings").delete().eq("id", id);
    if (!error) { toast.success(t("dash.deleted")); fetchJobs(); }
  };

  const toggleJobActive = async (id: string, active: boolean) => {
    const { error } = await supabase.from("job_postings").update({ is_active: active }).eq("id", id);
    if (!error) { fetchJobs(); toast.success(t("dash.saved")); }
  };

  const callManageUser = async (body: any) => {
    const { data: { session: s } } = await supabase.auth.getSession();
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          ...(s?.access_token ? { Authorization: `Bearer ${s.access_token}` } : {}),
        },
        body: JSON.stringify(body),
      }
    );
    return res.json();
  };

  const addUser = async () => {
    if (!newUserEmail || !newUserPassword) { toast.error(t("validation.required")); return; }
    const result = await callManageUser({
      action: "create_user",
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
      display_name: newUserName || newUserEmail,
    });
    if (result.error) { toast.error(result.error); return; }
    toast.success(t("dash.userAdded"));
    setShowUserForm(false);
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserName("");
    fetchUsers();
  };

  const updateUserRole = async (userId: string, role: string) => {
    const result = await callManageUser({ action: "update_role", user_id: userId, role });
    if (result.error) { toast.error(result.error); return; }
    toast.success(t("dash.roleUpdated"));
    fetchUsers();
  };

  const toggleUserActive = async (userId: string, isActive: boolean) => {
    const result = await callManageUser({ action: "toggle_active", user_id: userId, is_active: isActive });
    if (result.error) { toast.error(result.error); return; }
    toast.success(t("dash.statusUpdated"));
    fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    if (!confirm(t("dash.confirmDelete"))) return;
    const result = await callManageUser({ action: "delete_user", user_id: userId });
    if (result.error) { toast.error(result.error); return; }
    toast.success(t("dash.userDeleted"));
    fetchUsers();
  };

  // Project management
  const saveProject = async () => {
    if (!projectForm.name_ar) { toast.error(t("validation.required")); return; }
    const { error } = await supabase.from("projects").insert({
      name_ar: projectForm.name_ar,
      name_en: projectForm.name_en || null,
      description_ar: projectForm.description_ar || null,
    });
    if (!error) { toast.success(t("dash.saved")); fetchProjects(); setShowProjectForm(false); setProjectForm({ name_ar: "", name_en: "", description_ar: "" }); }
  };

  const filtered = applicants.filter(a => {
    const matchSearch = a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.desired_position || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Chart data
  const statusData = STATUSES.map((s, i) => ({
    name: t(`status.${s}`), value: applicants.filter(a => a.status === s).length, fill: CHART_COLORS[i],
  })).filter(d => d.value > 0);

  const positionData = Object.entries(
    applicants.reduce((acc, a) => { const pos = a.desired_position || "N/A"; acc[pos] = (acc[pos] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name: name.substring(0, 20), value }));

  const monthlyData = (() => {
    const months: Record<string, number> = {};
    applicants.forEach(a => { const m = new Date(a.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { month: "short", year: "numeric" }); months[m] = (months[m] || 0) + 1; });
    return Object.entries(months).map(([name, value]) => ({ name, value })).reverse().slice(0, 12).reverse();
  })();


  const stats = [
    { label: t("dash.totalApplicants"), value: applicants.length, icon: Users, color: "text-blue-500" },
    { label: t("dash.newApplicants"), value: applicants.filter(a => a.status === "new").length, icon: UserPlus, color: "text-yellow-500" },
    { label: t("dash.inInterview"), value: applicants.filter(a => ["phone_interview", "in_person_interview"].includes(a.status)).length, icon: Phone, color: "text-purple-500" },
    { label: t("dash.hired"), value: applicants.filter(a => a.status === "hired").length, icon: CheckCircle2, color: "text-green-500" },
  ];

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="gradient-hero py-4 px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/"><img src={logo} alt="AlKholi Group" className="h-10 object-contain" /></Link>
            <h1 className="text-primary-foreground font-bold text-lg hidden md:block">{t("dash.title")}</h1>
          </div>
          <div className="flex items-center gap-3">
            <TopBar variant="light" />
            <Link to="/jobs">
              <Button variant="ghost" className="text-primary-foreground hover:bg-white/10 gap-2">
                <Briefcase className="w-4 h-4" /><span className="hidden md:inline">{t("nav.jobs")}</span>
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="text-primary-foreground hover:bg-white/10 gap-2">
              <LogOut className="w-4 h-4" /><span className="hidden md:inline">{t("dash.logout")}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="hover:shadow-elevated transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs md:text-sm">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 md:w-10 md:h-10 ${stat.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full max-w-2xl">
            <TabsTrigger value="applicants">{t("dash.tab.applicants")}</TabsTrigger>
            <TabsTrigger value="jobs">{t("dash.tab.jobs")}</TabsTrigger>
            <TabsTrigger value="users">{t("dash.tab.users")}</TabsTrigger>
            <TabsTrigger value="projects">{t("dash.tab.projects")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("dash.tab.analytics")}</TabsTrigger>
            <TabsTrigger value="settings">{t("dash.tab.settings")}</TabsTrigger>
          </TabsList>

          {/* APPLICANTS TAB */}
          <TabsContent value="applicants">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />{t("dash.applicants")}</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute top-2.5 w-4 h-4 text-muted-foreground" style={{ [dir === "rtl" ? "right" : "left"]: "0.75rem" }} />
                      <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t("dash.search")} className="w-full sm:w-64" style={{ [dir === "rtl" ? "paddingRight" : "paddingLeft"]: "2.5rem" }} />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder={t("dash.filterStatus")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("dash.all")}</SelectItem>
                        {STATUSES.map(s => <SelectItem key={s} value={s}>{t(`status.${s}`)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button onClick={exportExcel} variant="outline" className="gap-2"><Download className="w-4 h-4" />{t("dash.export")}</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("dash.name")}</TableHead>
                        <TableHead>{t("dash.position")}</TableHead>
                        <TableHead>{t("dash.city")}</TableHead>
                        <TableHead>{t("dash.status")}</TableHead>
                        <TableHead>{t("dash.date")}</TableHead>
                        <TableHead>{t("dash.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length === 0 ? (
                        <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{t("dash.search")}</TableCell></TableRow>
                      ) : filtered.map(a => (
                        <TableRow key={a.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelectedApplicant(a); setEditNotes(a.notes || ""); }}>
                          <TableCell className="font-medium">{a.full_name}</TableCell>
                          <TableCell>{a.desired_position}</TableCell>
                          <TableCell>{a.preferred_city}</TableCell>
                          <TableCell><Badge className={`${STATUS_COLORS[a.status]} border-0`}>{t(`status.${a.status}`)}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</TableCell>
                          <TableCell><Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelectedApplicant(a); setEditNotes(a.notes || ""); }}><Eye className="w-4 h-4" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* JOBS TAB */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5" />{t("dash.manageJobs")}</CardTitle>
                  <Button onClick={() => openJobForm()} className="gradient-accent text-accent-foreground gap-2"><Plus className="w-4 h-4" />{t("dash.addJob")}</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("dash.jobTitle")}</TableHead>
                        <TableHead>{t("dash.jobLocation")}</TableHead>
                        <TableHead>{t("dash.jobType")}</TableHead>
                        <TableHead>{t("dash.status")}</TableHead>
                        <TableHead>{t("dash.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map(job => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{lang === "ar" ? job.title_ar : (job.title_en || job.title_ar)}</TableCell>
                          <TableCell>{lang === "ar" ? job.location : ((job as any).location_en || job.location)}</TableCell>
                          <TableCell>{lang === "ar" ? job.job_type : ((job as any).job_type_en || job.job_type)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch checked={job.is_active} onCheckedChange={(v) => toggleJobActive(job.id, v)} />
                              <span className="text-xs">{job.is_active ? t("dash.jobActive") : t("dash.jobInactive")}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => openJobForm(job)}><Pencil className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteJob(job.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />{t("dash.manageUsers")}</CardTitle>
                  <Button onClick={() => setShowUserForm(true)} className="gradient-accent text-accent-foreground gap-2"><Plus className="w-4 h-4" />{t("dash.addUser")}</Button>
                </div>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">{t("dash.noUsers")}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("dash.userName")}</TableHead>
                          <TableHead>{t("dash.userEmail")}</TableHead>
                          <TableHead>{t("dash.userRole")}</TableHead>
                          <TableHead>{t("dash.userStatus")}</TableHead>
                          <TableHead>{t("dash.actions")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user: any) => {
                          const userRole = userRoles.find((r: any) => r.user_id === user.user_id);
                          const isCurrentUser = false; // handled by AdminGuard
                          return (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.display_name || user.email}</TableCell>
                              <TableCell dir="ltr" className="text-sm">{user.email}</TableCell>
                              <TableCell>
                                <Select
                                  value={userRole?.role || ""}
                                  onValueChange={(v) => updateUserRole(user.user_id, v)}
                                  disabled={isCurrentUser}
                                >
                                  <SelectTrigger className="w-40"><SelectValue placeholder="-" /></SelectTrigger>
                                  <SelectContent>
                                    {ROLES.map(r => <SelectItem key={r} value={r}>{t(`role.${r}`)}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={user.is_active !== false}
                                    onCheckedChange={(v) => toggleUserActive(user.user_id, v)}
                                    disabled={isCurrentUser}
                                  />
                                  <span className="text-xs">
                                    {user.is_active !== false ? t("dash.userActive") : t("dash.userInactive")}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {!isCurrentUser && (
                                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteUser(user.user_id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROJECTS TAB */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><FolderOpen className="w-5 h-5" />{t("dash.projects")}</CardTitle>
                  <Button onClick={() => setShowProjectForm(true)} className="gradient-accent text-accent-foreground gap-2"><Plus className="w-4 h-4" />{t("dash.addProject")}</Button>
                </div>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">{lang === "ar" ? "لا توجد مشاريع بعد" : "No projects yet"}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((p: any) => (
                      <Card key={p.id}>
                        <CardContent className="p-4">
                          <h3 className="font-bold">{lang === "ar" ? p.name_ar : (p.name_en || p.name_ar)}</h3>
                          {p.description_ar && <p className="text-muted-foreground text-sm mt-1">{p.description_ar}</p>}
                          <Badge className="mt-2" variant={p.is_active ? "default" : "secondary"}>{p.is_active ? t("dash.jobActive") : t("dash.jobInactive")}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><BarChart3 className="w-4 h-4" />{t("dash.byStatus")}</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                          {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{t("dash.byPosition")}</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={positionData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(145, 58%, 45%)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{t("dash.timeline")}</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="hsl(220, 55%, 18%)" strokeWidth={2} dot={{ fill: "hsl(145, 58%, 45%)" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6">
                <CustomQuestionsSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Applicant Detail Dialog */}
      <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={dir}>
          {selectedApplicant && (
            <>
              <DialogHeader><DialogTitle className="text-xl">{selectedApplicant.full_name}</DialogTitle></DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("dash.updateStatus")}</label>
                  <Select value={selectedApplicant.status} onValueChange={(v) => updateStatus(selectedApplicant.id, v as ApplicantStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{t(`status.${s}`)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {([
                    ["field.email", selectedApplicant.email],
                    ["field.phone", selectedApplicant.phone],
                    ["field.gender", selectedApplicant.gender],
                    ["field.nationality", selectedApplicant.nationality],
                    ["field.birthDate", selectedApplicant.birth_date],
                    ["field.maritalStatus", selectedApplicant.marital_status],
                    ["field.currentCity", selectedApplicant.current_city],
                    ["field.hasTransport", selectedApplicant.has_transport],
                    ["field.jobType", selectedApplicant.job_type],
                    ["field.educationLevel", selectedApplicant.education_level],
                    ["field.major", selectedApplicant.major],
                    ["field.university", selectedApplicant.university],
                    ["field.graduationYear", selectedApplicant.graduation_year],
                    ["field.gpa", selectedApplicant.gpa],
                    ["field.yearsExperience", selectedApplicant.years_experience],
                    ["field.currentlyEmployed", selectedApplicant.currently_employed],
                    ["field.currentTitle", selectedApplicant.current_title],
                    ["field.arabicLevel", selectedApplicant.arabic_level],
                    ["field.englishLevel", selectedApplicant.english_level],
                    ["field.otherLanguage", selectedApplicant.other_language],
                    ["field.currentSalary", selectedApplicant.current_salary],
                    ["field.expectedSalary", selectedApplicant.expected_salary],
                    ["field.availableDate", selectedApplicant.available_date],
                    ["field.hearAbout", selectedApplicant.hear_about],
                    ["field.facilityManagementExp", (selectedApplicant as any).facility_management_exp],
                  ] as [string, string | null][]).filter(([, val]) => val).map(([key, val]) => (
                    <div key={key} className="border border-border rounded-lg p-2">
                      <p className="text-muted-foreground text-xs">{t(key)}</p>
                      <p className="font-medium">{val}</p>
                    </div>
                  ))}
                </div>

                {selectedApplicant.linkedin && (
                  <div className="border border-border rounded-lg p-2">
                    <p className="text-muted-foreground text-xs">{t("field.linkedin")}</p>
                    <a href={selectedApplicant.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">{selectedApplicant.linkedin}</a>
                  </div>
                )}

                {selectedApplicant.self_summary && (
                  <div className="border border-border rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">{t("field.selfSummary")}</p>
                    <p className="text-sm">{selectedApplicant.self_summary}</p>
                  </div>
                )}

                {selectedApplicant.current_tasks && (
                  <div className="border border-border rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">{t("field.currentTasks")}</p>
                    <p className="text-sm">{selectedApplicant.current_tasks}</p>
                  </div>
                )}

                {selectedApplicant.other_experience && (
                  <div className="border border-border rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">{t("field.otherExperience")}</p>
                    <p className="text-sm">{selectedApplicant.other_experience}</p>
                  </div>
                )}

                {/* Attachments */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2"><FileText className="w-4 h-4" />{t("dash.attachments")}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {([
                      ["field.resume", selectedApplicant.resume_url],
                      ["field.degreeCopy", selectedApplicant.degree_url],
                      ["field.experienceCert", selectedApplicant.experience_cert_url],
                      ["field.trainingCerts", selectedApplicant.training_certs_url],
                      ["field.otherDocs", selectedApplicant.other_docs_url],
                    ] as [string, string | null][]).filter(([, val]) => val).map(([key, val]) => (
                      <button key={key} onClick={async () => {
                        const { data } = await supabase.storage.from("resumes").createSignedUrl(val!, 3600);
                        if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                        else toast.error("Could not open file");
                      }} className="flex items-center gap-2 border border-border rounded-lg p-2 hover:bg-muted/50 transition-colors text-sm cursor-pointer">
                        <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                        <span className="truncate">{t(key)}</span>
                      </button>
                    ))}
                    {![selectedApplicant.resume_url, selectedApplicant.degree_url, selectedApplicant.experience_cert_url, selectedApplicant.training_certs_url, selectedApplicant.other_docs_url].some(Boolean) && (
                      <p className="text-muted-foreground text-xs col-span-2">{t("dash.noAttachments")}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("dash.notes")}</label>
                  <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={3} />
                  <Button size="sm" onClick={() => saveNotes(selectedApplicant.id)} className="gradient-accent text-accent-foreground">{t("dash.saveNotes")}</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Job Form Dialog */}
      <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={dir}>
          <DialogHeader><DialogTitle>{editingJob ? t("dash.editJob") : t("dash.addJob")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("dash.jobTitle")} *</Label>
                <Input value={jobForm.title_ar} onChange={e => setJobForm(p => ({ ...p, title_ar: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t("dash.jobTitleEn")}</Label>
                <Input value={jobForm.title_en} onChange={e => setJobForm(p => ({ ...p, title_en: e.target.value }))} dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("dash.jobLocation")} ({t("dash.arabic")})</Label>
                <Input value={jobForm.location} onChange={e => setJobForm(p => ({ ...p, location: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t("dash.jobLocation")} ({t("dash.english")})</Label>
                <Input value={jobForm.location_en} onChange={e => setJobForm(p => ({ ...p, location_en: e.target.value }))} dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("dash.jobType")} ({t("dash.arabic")})</Label>
                <Input value={jobForm.job_type} onChange={e => setJobForm(p => ({ ...p, job_type: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t("dash.jobType")} ({t("dash.english")})</Label>
                <Input value={jobForm.job_type_en} onChange={e => setJobForm(p => ({ ...p, job_type_en: e.target.value }))} dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("dash.jobDept")} ({t("dash.arabic")})</Label>
                <Input value={jobForm.department} onChange={e => setJobForm(p => ({ ...p, department: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t("dash.jobDept")} ({t("dash.english")})</Label>
                <Input value={jobForm.department_en} onChange={e => setJobForm(p => ({ ...p, department_en: e.target.value }))} dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("dash.nationalityRequired")} ({t("dash.arabic")})</Label>
                <Input value={jobForm.nationality_required} onChange={e => setJobForm(p => ({ ...p, nationality_required: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t("dash.nationalityRequired")} ({t("dash.english")})</Label>
                <Input value={jobForm.nationality_required_en} onChange={e => setJobForm(p => ({ ...p, nationality_required_en: e.target.value }))} dir="ltr" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("dash.jobDesc")}</Label>
              <Textarea value={jobForm.description_ar} onChange={e => setJobForm(p => ({ ...p, description_ar: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>{t("dash.jobDescEn")}</Label>
              <Textarea value={jobForm.description_en} onChange={e => setJobForm(p => ({ ...p, description_en: e.target.value }))} rows={3} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>{t("dash.jobReq")}</Label>
              <Textarea value={jobForm.requirements_ar} onChange={e => setJobForm(p => ({ ...p, requirements_ar: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>{t("dash.jobReqEn")}</Label>
              <Textarea value={jobForm.requirements_en} onChange={e => setJobForm(p => ({ ...p, requirements_en: e.target.value }))} rows={3} dir="ltr" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("jobDetail.experienceRequired")} ({t("dash.arabic")})</Label>
                <Input value={jobForm.experience_required_ar} onChange={e => setJobForm(p => ({ ...p, experience_required_ar: e.target.value }))} placeholder={lang === "ar" ? "مثال: 3 سنوات" : "e.g. 3 years"} />
              </div>
              <div className="space-y-2">
                <Label>{t("jobDetail.experienceRequired")} ({t("dash.english")})</Label>
                <Input value={jobForm.experience_required_en} onChange={e => setJobForm(p => ({ ...p, experience_required_en: e.target.value }))} dir="ltr" placeholder="e.g. 3 years" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("jobDetail.degreeRequired")} ({t("dash.arabic")})</Label>
                <Input value={jobForm.degree_required_ar} onChange={e => setJobForm(p => ({ ...p, degree_required_ar: e.target.value }))} placeholder={lang === "ar" ? "مثال: بكالوريوس هندسة" : "e.g. B.Sc Engineering"} />
              </div>
              <div className="space-y-2">
                <Label>{t("jobDetail.degreeRequired")} ({t("dash.english")})</Label>
                <Input value={jobForm.degree_required_en} onChange={e => setJobForm(p => ({ ...p, degree_required_en: e.target.value }))} dir="ltr" placeholder="e.g. B.Sc Engineering" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("jobDetail.additionalDetails")} ({t("dash.arabic")})</Label>
              <Textarea value={jobForm.additional_details_ar} onChange={e => setJobForm(p => ({ ...p, additional_details_ar: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>{t("jobDetail.additionalDetails")} ({t("dash.english")})</Label>
              <Textarea value={jobForm.additional_details_en} onChange={e => setJobForm(p => ({ ...p, additional_details_en: e.target.value }))} rows={3} dir="ltr" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("dash.vacancyCount")}</Label>
                <Input type="number" min={1} value={jobForm.vacancy_count} onChange={e => setJobForm(p => ({ ...p, vacancy_count: parseInt(e.target.value) || 1 }))} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={jobForm.is_active} onCheckedChange={v => setJobForm(p => ({ ...p, is_active: v }))} />
                <Label>{jobForm.is_active ? t("dash.jobActive") : t("dash.jobInactive")}</Label>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowJobForm(false)}>{t("dash.cancel")}</Button>
              <Button onClick={saveJob} className="gradient-accent text-accent-foreground">{t("dash.save")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
        <DialogContent dir={dir}>
          <DialogHeader><DialogTitle>{t("dash.addUser")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("dash.displayName")}</Label>
              <Input value={newUserName} onChange={e => setNewUserName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t("dash.signupEmail")}</Label>
              <Input value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} type="email" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>{t("dash.signupPassword")}</Label>
              <Input value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} type="password" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>{t("dash.role")}</Label>
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => <SelectItem key={r} value={r}>{t(`role.${r}`)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowUserForm(false)}>{t("dash.cancel")}</Button>
              <Button onClick={addUser} className="gradient-accent text-accent-foreground">{t("dash.save")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Form Dialog */}
      <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
        <DialogContent dir={dir}>
          <DialogHeader><DialogTitle>{t("dash.addProject")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("dash.projectName")} *</Label>
              <Input value={projectForm.name_ar} onChange={e => setProjectForm(p => ({ ...p, name_ar: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>{t("dash.projectNameEn")}</Label>
              <Input value={projectForm.name_en} onChange={e => setProjectForm(p => ({ ...p, name_en: e.target.value }))} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>{t("dash.projectDesc")}</Label>
              <Textarea value={projectForm.description_ar} onChange={e => setProjectForm(p => ({ ...p, description_ar: e.target.value }))} rows={3} />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowProjectForm(false)}>{t("dash.cancel")}</Button>
              <Button onClick={saveProject} className="gradient-accent text-accent-foreground">{t("dash.save")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
