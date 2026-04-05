import { Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

interface TopBarProps {
  variant?: "light" | "dark";
}

const TopBar = ({ variant = "dark" }: TopBarProps) => {
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const colorClass = variant === "light"
    ? "text-primary-foreground hover:bg-white/10"
    : "text-foreground hover:bg-muted";

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        className={colorClass}
        title={lang === "ar" ? "English" : "العربية"}
      >
        <Globe className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={colorClass}
        title={theme === "light" ? "Dark Mode" : "Light Mode"}
      >
        {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </Button>
    </div>
  );
};

export default TopBar;
