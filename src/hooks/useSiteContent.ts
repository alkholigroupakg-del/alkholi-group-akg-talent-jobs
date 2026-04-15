import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteContent {
  hero_title1_ar: string;
  hero_title1_en: string;
  hero_title2_ar: string;
  hero_title2_en: string;
  hero_desc_ar: string;
  hero_desc_en: string;
  employee_count: string;
  founding_year: string;
  projects_count: string;
  feature1_title_ar: string;
  feature1_title_en: string;
  feature1_desc_ar: string;
  feature1_desc_en: string;
  feature2_title_ar: string;
  feature2_title_en: string;
  feature2_desc_ar: string;
  feature2_desc_en: string;
  feature3_title_ar: string;
  feature3_title_en: string;
  feature3_desc_ar: string;
  feature3_desc_en: string;
  cta_title_ar: string;
  cta_title_en: string;
  cta_desc_ar: string;
  cta_desc_en: string;
  stats_section_title_ar: string;
  stats_section_title_en: string;
  show_stats_section: boolean;
  show_projects_section: boolean;
  site_name_ar: string;
  site_name_en: string;
  logo_url: string | null;
}

const DEFAULTS: SiteContent = {
  hero_title1_ar: "ابنِ مستقبلك المهني",
  hero_title1_en: "Build Your Career",
  hero_title2_ar: "مع مجموعة الخولي",
  hero_title2_en: "With AlKholi Group",
  hero_desc_ar: "نبحث عن كفاءات متميزة للانضمام لفريقنا.",
  hero_desc_en: "We are looking for exceptional talents to join our team.",
  employee_count: "2100",
  founding_year: "2006",
  projects_count: "50",
  feature1_title_ar: "بيئة عمل احترافية",
  feature1_title_en: "Professional Environment",
  feature1_desc_ar: "نوفر بيئة عمل محفزة.",
  feature1_desc_en: "We provide a stimulating environment.",
  feature2_title_ar: "فريق متميز",
  feature2_title_en: "Outstanding Team",
  feature2_desc_ar: "انضم لفريق من المحترفين.",
  feature2_desc_en: "Join a team of professionals.",
  feature3_title_ar: "فرص نمو حقيقية",
  feature3_title_en: "Real Growth Opportunities",
  feature3_desc_ar: "نؤمن بتطوير كوادرنا.",
  feature3_desc_en: "We believe in developing our workforce.",
  cta_title_ar: "جاهز للخطوة التالية؟",
  cta_title_en: "Ready for the Next Step?",
  cta_desc_ar: "تقديم الطلب يستغرق بضع دقائق فقط.",
  cta_desc_en: "Applying takes just a few minutes.",
  stats_section_title_ar: "أرقام تتحدث عنا",
  stats_section_title_en: "Numbers That Speak",
  show_stats_section: true,
  show_projects_section: true,
  site_name_ar: "مجموعة الخولي",
  site_name_en: "AlKholi Group",
  logo_url: null,
};

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("site_settings").select("*").limit(1).single().then(({ data }) => {
      if (data) setContent({ ...DEFAULTS, ...data } as SiteContent);
      setLoading(false);
    });
  }, []);

  return { content, loading };
};
