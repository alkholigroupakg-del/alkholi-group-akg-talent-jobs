import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import StepIndicator from "./StepIndicator";
import BasicInfoStep from "./steps/BasicInfoStep";
import JobPreferencesStep from "./steps/JobPreferencesStep";
import EducationStep from "./steps/EducationStep";
import ExperienceStep from "./steps/ExperienceStep";
import FinancialsStep from "./steps/FinancialsStep";
import AttachmentsStep from "./steps/AttachmentsStep";

const STORAGE_KEY = "akg-application-draft";

const stepLabels = [
  "البيانات الأساسية",
  "التفضيلات الوظيفية",
  "المؤهل العلمي",
  "الخبرات والمهارات",
  "التوقعات المالية",
  "المرفقات",
];

const ApplicationForm = () => {
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

  // Auto-save to localStorage
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
    const requiredByStep: Record<number, string[]> = {
      1: ["fullName", "gender", "nationality", "birthDate", "phone", "email"],
      2: ["desiredPosition"],
      3: ["educationLevel", "major"],
      4: [],
      5: [],
      6: [],
    };

    const required = requiredByStep[currentStep] || [];
    const missing = required.filter((field) => !formData[field]);
    if (missing.length > 0) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 6));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("تم إرسال طلبك بنجاح!");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-full gradient-accent flex items-center justify-center">
            <Send className="w-10 h-10 text-accent-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-primary">تم إرسال طلبك بنجاح!</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            شكراً لتقديمك على الوظيفة في مجموعة الخولي. سيتم مراجعة طلبك والتواصل معك في أقرب وقت.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({});
              setFiles({});
              setCurrentStep(1);
            }}
            className="gradient-accent text-accent-foreground hover:opacity-90 px-8"
          >
            تقديم طلب جديد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto" dir="rtl">
      <StepIndicator currentStep={currentStep} totalSteps={6} stepLabels={stepLabels} />

      <div className="bg-card rounded-xl shadow-elevated p-6 md:p-8 border border-border">
        {currentStep === 1 && <BasicInfoStep data={formData} onChange={handleChange} />}
        {currentStep === 2 && <JobPreferencesStep data={formData} onChange={handleChange} />}
        {currentStep === 3 && <EducationStep data={formData} onChange={handleChange} />}
        {currentStep === 4 && <ExperienceStep data={formData} onChange={handleChange} />}
        {currentStep === 5 && <FinancialsStep data={formData} onChange={handleChange} />}
        {currentStep === 6 && <AttachmentsStep data={formData} onChange={handleChange} onFileChange={handleFileChange} />}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            السابق
          </Button>

          {currentStep < 6 ? (
            <Button onClick={handleNext} className="gradient-primary text-primary-foreground hover:opacity-90 gap-2">
              التالي
              <ArrowLeft className="w-4 h-4" />
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
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  إرسال الطلب
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
