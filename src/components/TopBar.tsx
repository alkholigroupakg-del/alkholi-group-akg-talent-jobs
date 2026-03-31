import { Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const TopBar = () => {
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        className="text-primary-foreground hover:bg-white/10"
        title={lang === "ar" ? "English" : "العربية"}
      >
        <Globe className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="text-primary-foreground hover:bg-white/10"
        title={theme === "light" ? "Dark Mode" : "Light Mode"}
      >
        {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </Button>
    </div>
  );
};

export default TopBar;
