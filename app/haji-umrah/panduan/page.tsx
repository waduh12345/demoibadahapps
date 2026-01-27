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

// Import Service & Types
import { useGetGuidesQuery, GuideItem } from "@/services/public/guide.service";

// Import komponen detail
import GuideDetail from "./detail";

// --- Types & Helper ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";
export type GuideCategory = "umrah" | "hajj";

export interface ProcessedGuideStep {
  id: number;
  category: GuideCategory;
  stepNumber: number;
  title: string;
  summary: string; // Short description (cleaned)
  content: string; // Full HTML content
}

interface UIText {
  title: string;
  tabHajj: string;
  tabUmrah: string;
  step: string;
  read: string;
  loading: string;
  error: string;
  retry: string;
}

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Panduan Ibadah",
    tabHajj: "Haji",
    tabUmrah: "Umrah",
    step: "Langkah",
    read: "Lihat Detail",
    loading: "Memuat panduan...",
    error: "Gagal memuat data",
    retry: "Coba Lagi",
  },
  en: {
    title: "Pilgrimage Guide",
    tabHajj: "Hajj",
    tabUmrah: "Umrah",
    step: "Step",
    read: "View Details",
    loading: "Loading guides...",
    error: "Failed to load data",
    retry: "Retry",
  },
  ar: {
    title: "دليل المناسك",
    tabHajj: "الحج",
    tabUmrah: "العمرة",
    step: "خطوة",
    read: "التفاصيل",
    loading: "جار التحميل...",
    error: "فشل التحميل",
    retry: "أعد المحاولة",
  },
  fr: {
    title: "Guide du Pèlerinage",
    tabHajj: "Hajj",
    tabUmrah: "Omra",
    step: "Étape",
    read: "Détails",
    loading: "Chargement...",
    error: "Échec du chargement",
    retry: "Réessayer",
  },
  kr: {
    title: "순례 가이드",
    tabHajj: "하지",
    tabUmrah: "움라",
    step: "단계",
    read: "자세히 보기",
    loading: "로딩 중...",
    error: "로드 실패",
    retry: "재시도",
  },
  jp: {
    title: "巡礼ガイド",
    tabHajj: "ハッジ",
    tabUmrah: "ウムラ",
    step: "ステップ",
    read: "詳細を見る",
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

  // --- API HOOK ---
  // Mengambil data berdasarkan activeTab (umrah / hajj)
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetGuidesQuery({
    type: activeTab,
  });

  const rawData = apiResponse?.data || [];

  // --- HELPER: Get Translation ---
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

  // Helper Icon
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
    return Map; // Default
  };

  // Process Data
  const steps = useMemo(() => {
    if (!rawData) return [];

    // Sort by order
    const sorted = [...rawData].sort((a, b) => a.order - b.order);

    return sorted.map((item) => ({
      id: item.id,
      category: item.type,
      stepNumber: item.order,
      title: getTranslation(item, "title"),
      summary: stripHtml(getTranslation(item, "summary")), // Cleaned short desc
      content: getTranslation(item, "description"), // Full HTML
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
      className="min-h-screen bg-slate-50"
      dir={safeLocale === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-20">
        {/* Header with Tabs */}
        <header className="bg-awqaf-primary sticky top-0 z-30 pb-6 rounded-b-[30px] shadow-lg">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-6">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-white/10 text-white"
                >
                  <ArrowLeft
                    className={`w-6 h-6 ${safeLocale === "ar" ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-white font-comfortaa">
                {t.title}
              </h1>
            </div>

            {/* Tab Switcher */}
            <div className="bg-awqaf-secondary/30 p-1 rounded-xl flex gap-1 backdrop-blur-sm">
              <button
                onClick={() => setActiveTab("umrah")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300
                  ${
                    activeTab === "umrah"
                      ? "bg-white text-awqaf-primary shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
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
                      ? "bg-white text-awqaf-primary shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {t.tabHajj}
              </button>
            </div>
          </div>
        </header>

        {/* Timeline Content */}
        <main className="px-5 py-6 space-y-0 relative">
          {/* Vertical Line */}
          <div
            className={`absolute top-6 bottom-10 w-0.5 bg-accent-100 ${safeLocale === "ar" ? "right-[2.6rem]" : "left-[2.6rem]"} z-0`}
          ></div>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 relative z-10 bg-white/80 rounded-xl">
              <Loader2 className="w-8 h-8 text-awqaf-primary animate-spin mb-2" />
              <p className="text-sm text-slate-500">{t.loading}</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-10 relative z-10 bg-white rounded-xl shadow-sm border border-red-100 p-6 text-center mx-4 mt-4">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <p className="text-sm text-slate-600 mb-4">{t.error}</p>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                {t.retry}
              </Button>
            </div>
          )}

          {/* List Items */}
          {!isLoading &&
            !isError &&
            steps.map((item) => {
              const Icon = getIcon(item.title);
              return (
                <div
                  key={item.id}
                  className="relative z-10 mb-6 last:mb-0 group cursor-pointer"
                  onClick={() => setSelectedStep(item)}
                >
                  <div className="flex gap-4 items-start">
                    {/* Step Number */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-accent-100 flex items-center justify-center shadow-sm group-hover:border-awqaf-primary group-hover:scale-110 transition-all duration-300">
                        <span className="text-sm font-bold text-awqaf-primary">
                          {item.stepNumber}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <Card className="flex-1 border-none shadow-sm hover:shadow-md transition-all duration-200 bg-white ring-1 ring-slate-100 rounded-xl overflow-hidden group-hover:bg-accent-50/30">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2.5 bg-accent-50 rounded-lg text-awqaf-primary group-hover:bg-white group-hover:shadow-sm transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-awqaf-primary font-comfortaa text-base mb-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                            {item.summary}
                          </p>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-slate-300 group-hover:text-awqaf-primary ${safeLocale === "ar" ? "rotate-180" : ""}`}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
        </main>
      </div>
    </div>
  );
}