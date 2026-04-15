import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useFieldConfig } from "@/hooks/useFieldConfig";
import StepIndicator from "./StepIndicator";
import ResumeUploadStep from "./steps/ResumeUploadStep";
import BasicInfoStep from "./steps/BasicInfoStep";
import JobPreferencesStep from "./steps/JobPreferencesStep";
import EducationStep from "./steps/EducationStep";
import ExperienceStep from "./steps/ExperienceStep";
import FinancialsStep from "./steps/FinancialsStep";
import AttachmentsStep from "./steps/AttachmentsStep";
import CustomQuestionsStep from "./steps/CustomQuestionsStep";

const STORAGE_KEY = "akg-application-draft";
const TOTAL_STEPS = 7;

interface Props {
  preSelectedPosition?: string;
}

const ApplicationForm = ({ preSelectedPosition }: Props) => {
  const { t, lang, dir } = useLanguage();
  const fc = useFieldConfig();

  const stepLabels = [
    lang === "ar" ? "التعبئة الذكية" : "Smart Apply",
    t("step.basic"), t("step.job"), t("step.edu"),
    t("step.exp"), t("step.fin"), t("step.attach"),
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!preSelectedPosition) return;
    setFormData((prev) =>
      prev.desiredPosition === preSelectedPosition
        ? prev
        : { ...prev, desiredPosition: preSelectedPosition }
    );
  }, [preSelectedPosition]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((name: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
  }, []);

  const validateStep = () => {
    if (currentStep === 1) return true;

    const fieldConfigStep = currentStep - 1;
    const required = fc.getRequiredFields(fieldConfigStep);
    const missing = required.filter((field) => !formData[field] && !files[field]);

    if (missing.length > 0) {
      console.log("Missing required fields:", missing);
      toast.error(t("validation.required"));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadFile = async (file: File, folder: string) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-file`,
        {
          method: "POST",
          headers: {
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            ...(session?.access_token ? { "Authorization": `Bearer ${session.access_token}` } : {}),
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Upload error:", err);
        return null;
      }

      const result = await res.json();
      return result.path;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    if (!files.resume) {
      toast.error(lang === "ar" ? "السيرة الذاتية مطلوبة في الخطوة الأخيرة قبل إرسال الطلب" : "Resume is required in the final step before submission");
      return;
    }

    setIsSubmitting(true);
    try {
      let resumeUrl = null;
      let degreeUrl = null;
      let experienceCertUrl = null;
      let trainingCertsUrl = null;
      let otherDocsUrl = null;

      if (files.resume) resumeUrl = await uploadFile(files.resume, "resumes");
      if (files.degreeCopy) degreeUrl = await uploadFile(files.degreeCopy, "degrees");
      if (files.experienceCert) experienceCertUrl = await uploadFile(files.experienceCert, "experience");
      if (files.trainingCerts) trainingCertsUrl = await uploadFile(files.trainingCerts, "training");
      if (files.otherDocs) otherDocsUrl = await uploadFile(files.otherDocs, "other");

      const { data: insertedData, error } = await supabase.from("applicants").insert({
        full_name: formData.fullName,
        gender: formData.gender,
        nationality: formData.nationality,
        birth_date: formData.birthDate,
        marital_status: formData.maritalStatus,
        dependents: parseInt(formData.dependents) || 0,
        phone: formData.phone,
        email: formData.email,
        current_city: formData.currentCity,
        has_transport: formData.hasTransport,
        desired_position: formData.desiredPosition,
        job_type: formData.jobType,
        preferred_city: formData.preferredCity,
        hear_about: formData.hearAbout,
        education_level: formData.educationLevel,
        major: formData.major,
        university: formData.university,
        graduation_year: formData.graduationYear,
        gpa: formData.gpa,
        currently_studying: formData.currentlyStudying,
        current_study: formData.currentStudy || null,
        years_experience: formData.yearsExperience,
        currently_employed: formData.currentlyEmployed,
        current_title: formData.currentTitle,
        current_tasks: formData.currentTasks,
        self_summary: formData.selfSummary,
        other_experience: formData.otherExperience || null,
        arabic_level: formData.arabicLevel,
        english_level: formData.englishLevel,
        other_language: formData.otherLanguage,
        linkedin: formData.linkedin,
        facility_management_exp: formData.facilityManagementExp || null,
        current_salary: formData.currentSalary,
        expected_salary: formData.expectedSalary,
        available_date: formData.availableDate,
        resume_url: resumeUrl,
        degree_url: degreeUrl,
        experience_cert_url: experienceCertUrl,
        training_certs_url: trainingCertsUrl,
        other_docs_url: otherDocsUrl,
      }).select("id").single();

      if (error) throw error;

      const customAnswers = Object.entries(formData)
        .filter(([key, val]) => key.startsWith("custom_") && val)
        .map(([key, val]) => ({
          applicant_id: insertedData.id,
          question_id: key.replace("custom_", ""),
          answer: val,
        }));

      if (customAnswers.length > 0) {
        await supabase.from("custom_answers").insert(customAnswers);
      }

      setIsSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
      toast.success(t("validation.success"));
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(t("validation.required"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const NextArrow = lang === "ar" ? ArrowLeft : ArrowRight;
  const PrevArrow = lang === "ar" ? ArrowRight : ArrowLeft;

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-full gradient-accent flex items-center justify-center">
            <Send className="w-10 h-10 text-accent-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-primary">{t("success.title")}</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">{t("success.desc")}</p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({});
              setFiles({});
              setCurrentStep(1);
            }}
            className="gradient-accent text-accent-foreground hover:opacity-90 px-8"
          >
            {t("btn.newApplication")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto" dir={dir}>
      <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} stepLabels={stepLabels} />

      <div className="bg-card rounded-xl shadow-elevated p-6 md:p-8 border border-border">
        {currentStep === 1 && <ResumeUploadStep />}
        {currentStep === 2 && <><BasicInfoStep data={formData} onChange={handleChange} /><CustomQuestionsStep stepNumber={1} data={formData} onChange={handleChange} /></>}
        {currentStep === 3 && <><JobPreferencesStep data={formData} onChange={handleChange} /><CustomQuestionsStep stepNumber={2} data={formData} onChange={handleChange} /></>}
        {currentStep === 4 && <><EducationStep data={formData} onChange={handleChange} /><CustomQuestionsStep stepNumber={3} data={formData} onChange={handleChange} /></>}
        {currentStep === 5 && <><ExperienceStep data={formData} onChange={handleChange} /><CustomQuestionsStep stepNumber={4} data={formData} onChange={handleChange} /></>}
        {currentStep === 6 && <><FinancialsStep data={formData} onChange={handleChange} /><CustomQuestionsStep stepNumber={5} data={formData} onChange={handleChange} /></>}
        {currentStep === 7 && <><AttachmentsStep onChange={handleChange} onFileChange={handleFileChange} hasResume={!!files.resume} /><CustomQuestionsStep stepNumber={6} data={formData} onChange={handleChange} /></>}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1} className="gap-2">
            <PrevArrow className="w-4 h-4" />
            {t("btn.prev")}
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button onClick={handleNext} className="gradient-primary text-primary-foreground hover:opacity-90 gap-2">
              {t("btn.next")}
              <NextArrow className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gradient-accent text-accent-foreground hover:opacity-90 gap-2 px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("btn.submitting")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t("btn.submit")}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
