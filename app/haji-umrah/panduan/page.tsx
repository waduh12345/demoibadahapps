"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Footprints, // Sa'i
  Repeat, // Tawaf
  Scissors, // Tahallul
  Shirt, // Ihram
  Tent, // Mina/Arafah
  ChevronRight,
  Map,
  LucideIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/app/hooks/useI18n";
import { useGetGuidesQuery, GuideItem } from "@/services/public/guide.service";
import GuideDetail from "./detail";

// --- Types & Helper ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";
export type GuideCategory = "umrah" | "hajj";

export interface ProcessedGuideStep {
  id: number;
  category: GuideCategory;
  stepNumber: number;
  title: string;
  summary: string;
  content: string;
}

interface UIText {
  title: string;
  subtitle: string;
  tabHajj: string;
  tabUmrah: string;
  loading: string;
  error: string;
  retry: string;
}

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Panduan Ibadah",
    subtitle: "Tata Cara & Manasik",
    tabHajj: "Haji",
    tabUmrah: "Umrah",
    loading: "Memuat panduan...",
    error: "Gagal memuat data",
    retry: "Coba Lagi",
  },
  en: {
    title: "Pilgrimage Guide",
    subtitle: "Rituals & Procedures",
    tabHajj: "Hajj",
    tabUmrah: "Umrah",
    loading: "Loading guides...",
    error: "Failed to load data",
    retry: "Retry",
  },
  ar: {
    title: "دليل المناسك",
    subtitle: "إجراءات وطقوس",
    tabHajj: "الحج",
    tabUmrah: "العمرة",
    loading: "جار التحميل...",
    error: "فشل التحميل",
    retry: "أعد المحاولة",
  },
  fr: {
    title: "Guide du Pèlerinage",
    subtitle: "Rituels et procédures",
    tabHajj: "Hajj",
    tabUmrah: "Omra",
    loading: "Chargement...",
    error: "Échec du chargement",
    retry: "Réessayer",
  },
  kr: {
    title: "순례 가이드",
    subtitle: "의식 및 절차",
    tabHajj: "하지",
    tabUmrah: "움라",
    loading: "로딩 중...",
    error: "로드 실패",
    retry: "재시도",
  },
  jp: {
    title: "巡礼ガイド",
    subtitle: "儀式と手順",
    tabHajj: "ハッジ",
    tabUmrah: "ウムラ",
    loading: "読み込み中...",
    error: "読み込み失敗",
    retry: "再試行",
  },
};

export default function GuidePage() {
  const { locale } = useI18n();
  const safeLocale = (
    UI_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TEXT[safeLocale];

  // STATE
  const [activeTab, setActiveTab] = useState<GuideCategory>("umrah");
  const [selectedStep, setSelectedStep] = useState<ProcessedGuideStep | null>(
    null,
  );

  // API HOOK
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetGuidesQuery({
    type: activeTab,
  });

  const rawData = apiResponse?.data || [];

  // HELPERS
  const getTranslation = (
    item: GuideItem,
    field: "title" | "summary" | "description",
  ) => {
    const trans = item.translations?.find((tr) => tr.locale === safeLocale);
    if (trans && trans[field]) return trans[field];
    const enTrans = item.translations?.find((tr) => tr.locale === "en");
    if (enTrans && enTrans[field]) return enTrans[field];
    if (field === "title") return item.title;
    if (field === "summary") return item.summary;
    return item.description;
  };

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html.replace(/<[^>]*>?/gm, "");
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getIcon = (title: string): LucideIcon => {
    const lower = title.toLowerCase();
    if (lower.includes("ihram") || lower.includes("إحرام")) return Shirt;
    if (lower.includes("tawaf") || lower.includes("طواف")) return Repeat;
    if (lower.includes("sa'i") || lower.includes("سعي")) return Footprints;
    if (
      lower.includes("tahallul") ||
      lower.includes("cukur") ||
      lower.includes("halq")
    )
      return Scissors;
    if (
      lower.includes("wukuf") ||
      lower.includes("mina") ||
      lower.includes("arafah")
    )
      return Tent;
    return Map;
  };

  const steps = useMemo(() => {
    if (!rawData) return [];
    const sorted = [...rawData].sort((a, b) => a.order - b.order);
    return sorted.map((item) => ({
      id: item.id,
      category: item.type,
      stepNumber: item.order,
      title: getTranslation(item, "title"),
      summary: stripHtml(getTranslation(item, "summary")),
      content: getTranslation(item, "description"),
    }));
  }, [rawData, safeLocale]);

  // RENDER DETAIL
  if (selectedStep) {
    return (
      <GuideDetail
        step={selectedStep}
        locale={safeLocale}
        onBack={() => setSelectedStep(null)}
        totalSteps={steps.length}
        icon={getIcon(selectedStep.title)}
      />
    );
  }

  // RENDER LIST
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={safeLocale === "ar" ? "rtl" : "ltr"}
    >
      {/* HEADER: Floating Glass */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                >
                  <ArrowLeft
                    className={`w-5 h-5 ${safeLocale === "ar" ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t.title}
                </h1>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {t.subtitle}
                </p>
              </div>
              <div className="w-10 h-10" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-2 relative">
        {/* TAB SWITCHER */}
        <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-xl flex gap-2 border border-awqaf-border-light/50 shadow-sm mb-8 z-20 relative">
          <button
            onClick={() => setActiveTab("umrah")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300
              ${
                activeTab === "umrah"
                  ? "bg-awqaf-primary text-white shadow-md"
                  : "text-awqaf-foreground-secondary hover:bg-accent-50 hover:text-awqaf-primary"
              }
            `}
          >
            {t.tabUmrah}
          </button>
          <button
            onClick={() => setActiveTab("hajj")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300
              ${
                activeTab === "hajj"
                  ? "bg-awqaf-primary text-white shadow-md"
                  : "text-awqaf-foreground-secondary hover:bg-accent-50 hover:text-awqaf-primary"
              }
            `}
          >
            {t.tabHajj}
          </button>
        </div>

        {/* TIMELINE */}
        <div className="relative">
          {/* Vertical Line */}
          <div
            className={`absolute top-4 bottom-10 w-0.5 bg-awqaf-primary/20 ${
              safeLocale === "ar" ? "right-[1.65rem]" : "left-[1.65rem]"
            } z-0`}
          ></div>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 relative z-10">
              <Loader2 className="w-8 h-8 text-awqaf-primary animate-spin mb-2" />
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {t.loading}
              </p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <Card className="border-red-200 bg-red-50 relative z-10">
              <CardContent className="p-6 text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <p className="text-sm text-red-700 font-comfortaa mb-4">
                  {t.error}
                </p>
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  className="bg-white border-red-200 text-red-600 hover:bg-red-50 font-comfortaa"
                >
                  {t.retry}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* List Items */}
          {!isLoading &&
            !isError &&
            steps.map((item) => {
              const Icon = getIcon(item.title);
              return (
                <div
                  key={item.id}
                  className="relative z-10 mb-5 last:mb-0 group cursor-pointer"
                  onClick={() => setSelectedStep(item)}
                >
                  <div className="flex gap-4 items-stretch">
                    {/* Step Number Badge */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-white border-4 border-accent-50 flex items-center justify-center shadow-sm group-hover:border-awqaf-primary group-hover:scale-105 transition-all duration-300 z-10">
                        <span className="text-lg font-bold text-awqaf-primary font-comfortaa">
                          {item.stepNumber}
                        </span>
                      </div>
                    </div>

                    {/* Content Card */}
                    <Card className="flex-1 border-awqaf-border-light shadow-sm hover:shadow-md transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-2xl group-hover:border-awqaf-primary/50">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center text-awqaf-primary flex-shrink-0 group-hover:bg-awqaf-primary group-hover:text-white transition-colors duration-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-awqaf-primary font-comfortaa text-base mb-1 truncate">
                            {item.title}
                          </h3>
                          <p className="text-xs text-awqaf-foreground-secondary font-comfortaa line-clamp-2 leading-relaxed">
                            {item.summary}
                          </p>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 text-awqaf-foreground-secondary/50 group-hover:text-awqaf-primary transition-colors ${
                            safeLocale === "ar" ? "rotate-180" : ""
                          }`}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}