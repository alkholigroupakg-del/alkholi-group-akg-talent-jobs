import { useMemo, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area,
} from "recharts";
import {
  Users, MapPin, DollarSign, GraduationCap, Globe, Briefcase,
  TrendingUp, Building2, Printer, FileDown,
} from "lucide-react";
import * as XLSX from "xlsx";

const COLORS = [
  "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#ef4444",
  "#06b6d4", "#f97316", "#ec4899", "#6366f1", "#14b8a6",
];

interface Applicant {
  id: string;
  full_name: string;
  nationality: string | null;
  current_city: string | null;
  preferred_city: string | null;
  current_salary: string | null;
  expected_salary: string | null;
  desired_position: string | null;
  education_level: string | null;
  gender: string | null;
  years_experience: string | null;
  status: string;
  created_at: string;
  job_type: string | null;
  major: string | null;
  marital_status: string | null;
}

interface Props {
  applicants: Applicant[];
}

const groupBy = (arr: any[], key: string) => {
  const map: Record<string, number> = {};
  arr.forEach(item => {
    const val = item[key] || "N/A";
    map[val] = (map[val] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
};

const AdvancedAnalytics = ({ applicants }: Props) => {
  const { lang } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);

  // Data computations
  const nationalityData = useMemo(() => groupBy(applicants, "nationality").slice(0, 10), [applicants]);
  const cityData = useMemo(() => groupBy(applicants, "current_city").slice(0, 10), [applicants]);
  const preferredCityData = useMemo(() => groupBy(applicants, "preferred_city").slice(0, 10), [applicants]);
  const educationData = useMemo(() => groupBy(applicants, "education_level"), [applicants]);
  const genderData = useMemo(() => groupBy(applicants, "gender"), [applicants]);
  const jobTypeData = useMemo(() => groupBy(applicants, "job_type"), [applicants]);
  const majorData = useMemo(() => groupBy(applicants, "major").slice(0, 8), [applicants]);
  const experienceData = useMemo(() => groupBy(applicants, "years_experience"), [applicants]);

  const saudiCount = useMemo(() =>
    applicants.filter(a => a.nationality?.includes("سعود") || a.nationality?.toLowerCase().includes("saudi")).length,
    [applicants]
  );
  const nonSaudiCount = applicants.length - saudiCount;

  const saudizationData = useMemo(() => [
    { name: lang === "ar" ? "سعودي" : "Saudi", value: saudiCount },
    { name: lang === "ar" ? "غير سعودي" : "Non-Saudi", value: nonSaudiCount },
  ], [saudiCount, nonSaudiCount, lang]);

  // Average salary per position
  const salaryByPosition = useMemo(() => {
    const posMap: Record<string, { total: number; count: number }> = {};
    applicants.forEach(a => {
      if (!a.desired_position || !a.expected_salary) return;
      const salary = parseInt(a.expected_salary.replace(/[^\d]/g, ""));
      if (isNaN(salary) || salary === 0) return;
      if (!posMap[a.desired_position]) posMap[a.desired_position] = { total: 0, count: 0 };
      posMap[a.desired_position].total += salary;
      posMap[a.desired_position].count += 1;
    });
    return Object.entries(posMap)
      .map(([name, { total, count }]) => ({ name: name.substring(0, 20), avg: Math.round(total / count) }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 8);
  }, [applicants]);

  // Applications per day (last 30 days)
  const dailyTrend = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days[d.toISOString().split("T")[0]] = 0;
    }
    applicants.forEach(a => {
      const day = a.created_at.split("T")[0];
      if (day in days) days[day]++;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { day: "numeric", month: "short" }),
      count,
    }));
  }, [applicants, lang]);

  // Quick stats
  const stats = useMemo(() => {
    const totalPositions = new Set(applicants.map(a => a.desired_position).filter(Boolean)).size;
    const totalCities = new Set(applicants.map(a => a.current_city).filter(Boolean)).size;
    const saudizationRate = applicants.length > 0 ? Math.round((saudiCount / applicants.length) * 100) : 0;
    return { totalPositions, totalCities, saudizationRate };
  }, [applicants, saudiCount]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportAnalytics = () => {
    const wb = XLSX.utils.book_new();
    const addSheet = (data: any[], name: string) => {
      if (data.length > 0) {
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), name.substring(0, 31));
      }
    };
    addSheet(nationalityData, lang === "ar" ? "الجنسيات" : "Nationalities");
    addSheet(cityData, lang === "ar" ? "المدن الحالية" : "Current Cities");
    addSheet(preferredCityData, lang === "ar" ? "المدن المفضلة" : "Preferred Cities");
    addSheet(educationData, lang === "ar" ? "المؤهلات" : "Education");
    addSheet(salaryByPosition, lang === "ar" ? "متوسط الرواتب" : "Avg Salary");
    addSheet(genderData, lang === "ar" ? "الجنس" : "Gender");
    addSheet(majorData, lang === "ar" ? "التخصصات" : "Majors");
    XLSX.writeFile(wb, `analytics_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
    <Card className="hover:shadow-elevated transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div ref={printRef} className="space-y-6 print:space-y-4">
      {/* Action Buttons */}
      <div className="flex items-center justify-between print:hidden">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {lang === "ar" ? "تحليلات متقدمة" : "Advanced Analytics"}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportAnalytics}>
            <FileDown className="w-4 h-4" />
            {lang === "ar" ? "تصدير Excel" : "Export Excel"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            {lang === "ar" ? "طباعة PDF" : "Print PDF"}
          </Button>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Users} label={lang === "ar" ? "إجمالي المتقدمين" : "Total Applicants"} value={applicants.length} color="bg-blue-500" />
        <StatCard icon={Globe} label={lang === "ar" ? "نسبة السعودة" : "Saudization Rate"} value={`${stats.saudizationRate}%`} color="bg-green-500" />
        <StatCard icon={Briefcase} label={lang === "ar" ? "وظائف مطلوبة" : "Positions Applied"} value={stats.totalPositions} color="bg-purple-500" />
        <StatCard icon={MapPin} label={lang === "ar" ? "مدن مختلفة" : "Different Cities"} value={stats.totalCities} color="bg-orange-500" />
      </div>

      {/* Row 1: Saudization + Nationality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {lang === "ar" ? "نسبة السعودة" : "Saudization Ratio"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={saudizationData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    <Cell fill="#22c55e" />
                    <Cell fill="#3b82f6" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <Badge className="bg-green-100 text-green-800 border-0">{lang === "ar" ? `سعودي: ${saudiCount}` : `Saudi: ${saudiCount}`}</Badge>
              <Badge className="bg-blue-100 text-blue-800 border-0">{lang === "ar" ? `غير سعودي: ${nonSaudiCount}` : `Non-Saudi: ${nonSaudiCount}`}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {lang === "ar" ? "توزيع الجنسيات" : "Nationality Distribution"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nationalityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {nationalityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Cities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {lang === "ar" ? "مدينة السكن الحالية" : "Current City"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={cityData} dataKey="value" cx="50%" cy="50%" outerRadius={80}
                    label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                    {cityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {lang === "ar" ? "المدينة المفضلة للعمل" : "Preferred Work City"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={preferredCityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Salary + Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {lang === "ar" ? "متوسط الراتب المتوقع لكل وظيفة" : "Avg Expected Salary per Position"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {salaryByPosition.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">{lang === "ar" ? "لا توجد بيانات رواتب كافية" : "Not enough salary data"}</p>
            ) : (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryByPosition} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(val: number) => [`${val.toLocaleString()} SAR`, lang === "ar" ? "متوسط" : "Average"]} />
                    <Bar dataKey="avg" fill="#22c55e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              {lang === "ar" ? "المستوى التعليمي" : "Education Level"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={educationData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {educationData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Trend + Gender + Experience */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {lang === "ar" ? "حركة التقديم (آخر 30 يوم)" : "Application Trend (Last 30 Days)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{lang === "ar" ? "الجنس" : "Gender"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genderData} dataKey="value" cx="50%" cy="50%" outerRadius={70}
                    label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                    <Cell fill="#3b82f6" />
                    <Cell fill="#ec4899" />
                    {genderData.slice(2).map((_, i) => <Cell key={i + 2} fill={COLORS[(i + 2) % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 5: Major + Experience + Job Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{lang === "ar" ? "التخصصات الأكثر طلباً" : "Top Majors"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {majorData.map((m, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1">{m.name}</span>
                  <Badge variant="secondary" className="shrink-0">{m.value}</Badge>
                </div>
              ))}
              {majorData.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">-</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{lang === "ar" ? "سنوات الخبرة" : "Years of Experience"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={experienceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{lang === "ar" ? "نوع العمل" : "Job Type"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={jobTypeData} dataKey="value" cx="50%" cy="50%" outerRadius={70}
                    label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                    {jobTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
