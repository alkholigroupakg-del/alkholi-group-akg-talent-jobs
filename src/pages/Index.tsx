import { Link } from "react-router-dom";
import { ArrowLeft, Users, Briefcase, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-20 py-5 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img src={logo} alt="AlKholi Group" className="h-10 md:h-14 object-contain bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2" />
          <Link to="/apply">
            <Button className="gradient-accent text-accent-foreground hover:opacity-90 gap-2 font-semibold">
              تقدم الآن
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 gradient-hero opacity-85" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-black text-primary-foreground leading-tight">
              ابنِ مستقبلك المهني
              <br />
              <span className="text-accent">مع مجموعة الخولي</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-lg">
              نبحث عن كفاءات متميزة للانضمام لفريقنا. قدّم طلبك الآن واكتشف الفرص الوظيفية المتاحة.
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/apply">
                <Button size="lg" className="gradient-accent text-accent-foreground hover:opacity-90 gap-2 text-lg px-8 py-6 font-bold shadow-glow">
                  تقدم للوظيفة
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-4">لماذا مجموعة الخولي؟</h2>
          <p className="text-muted-foreground text-center mb-14 text-lg max-w-xl mx-auto">
            نقدم بيئة عمل محفزة وفرص نمو حقيقية لكل فرد في فريقنا
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "بيئة عمل احترافية",
                desc: "نوفر بيئة عمل محفزة تساعدك على الإبداع والتطور المهني المستمر.",
              },
              {
                icon: Users,
                title: "فريق متميز",
                desc: "انضم لفريق من المحترفين والخبراء في مختلف المجالات والتخصصات.",
              },
              {
                icon: Briefcase,
                title: "فرص نمو حقيقية",
                desc: "نؤمن بتطوير كوادرنا ونقدم مسارات وظيفية واضحة للترقي.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-8 shadow-card border border-border hover:shadow-elevated transition-shadow duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mx-auto mb-5">
                  <feature.icon className="w-7 h-7 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero py-16 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            جاهز للخطوة التالية؟
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            تقديم الطلب يستغرق بضع دقائق فقط. بياناتك تُحفظ تلقائياً.
          </p>
          <Link to="/apply">
            <Button size="lg" className="gradient-accent text-accent-foreground hover:opacity-90 gap-2 text-lg px-10 py-6 font-bold shadow-glow mt-4">
              ابدأ التقديم الآن
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={logo} alt="AlKholi Group" className="h-8 object-contain" />
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} مجموعة الخولي — جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
