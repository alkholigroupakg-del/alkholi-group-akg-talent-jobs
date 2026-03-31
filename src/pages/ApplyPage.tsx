import ApplicationForm from "@/components/ApplicationForm/ApplicationForm";
import logo from "@/assets/logo.jpg";

const ApplyPage = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="gradient-hero py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img src={logo} alt="AlKholi Group" className="h-12 object-contain" />
          <span className="text-primary-foreground/80 text-sm font-medium">نموذج التقديم الوظيفي</span>
        </div>
      </header>

      {/* Form Section */}
      <main className="py-10 px-4">
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            انضم لفريق مجموعة الخولي
          </h1>
          <p className="text-muted-foreground text-lg">
            يرجى تعبئة النموذج التالي بدقة. سيتم التواصل معك بعد مراجعة طلبك.
          </p>
        </div>
        <ApplicationForm />
      </main>

      {/* Footer */}
      <footer className="gradient-hero py-6 px-4 mt-10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} مجموعة الخولي — جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ApplyPage;
