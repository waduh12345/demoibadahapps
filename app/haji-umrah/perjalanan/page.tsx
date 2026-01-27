"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Tent, // Mina/Arafah
  Moon, // Muzdalifah (Malam)
  Sun, // Arafah (Siang)
  CheckCircle2,
  ChevronRight,
  CircleDot,
  LucideIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// Import Service & Types
import { useGetJourneysQuery } from "@/services/public/journey.service";

// Import komponen detail
import JourneyDetail from "./detail";
import { LocaleCode } from "@/lib/i18n";
export interface DailyActivity {
  id: number;
  day: string; // Hijri Date
  phase: string; // Title
  location: string;
  description: string;
  activities: string[];
  status: "completed" | "current" | "upcoming";
}

interface UIText {
  title: string;
  subtitle: string;
  location: string;
  viewDetails: string;
  loading: string;
  error: string;
  retry: string;
  tabHajj: string;
  tabUmrah: string;
  totalDays: string;
  totalSteps: string;
}

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Perjalanan Ibadah",
    subtitle: "Timeline Ibadah",
    location: "Lokasi",
    viewDetails: "Lihat Detail",
    loading: "Memuat perjalanan...",
    error: "Gagal memuat data",
    retry: "Coba Lagi",
    tabHajj: "Haji",
    tabUmrah: "Umrah",
    totalDays: "Total Hari",
    totalSteps: "Total Langkah",
  },
  en: {
    title: "Pilgrimage Journey",
    subtitle: "Worship Timeline",
    location: "Location",
    viewDetails: "View Details",
    loading: "Loading journey...",
    error: "Failed to load data",
    retry: "Retry",
    tabHajj: "Hajj",
    tabUmrah: "Umrah",
    totalDays: "Total Days",
    totalSteps: "Total Steps",
  },
  ar: {
    title: "رحلة الحج والعمرة",
    subtitle: "الجدول الزمني",
    location: "الموقع",
    viewDetails: "التفاصيل",
    loading: "جار التحميل...",
    error: "فشل التحميل",
    retry: "أعد المحاولة",
    tabHajj: "الحج",
    tabUmrah: "العمرة",
    totalDays: "مجموع الأيام",
    totalSteps: "مجموع الخطوات",
  },
  fr: {
    title: "Voyage Pèlerinage",
    subtitle: "Chronologie",
    location: "Lieu",
    viewDetails: "Détails",
    loading: "Chargement...",
    error: "Échec",
    retry: "Réessayer",
    tabHajj: "Hajj",
    tabUmrah: "Omra",
    totalDays: "Jours Totaux",
    totalSteps: "Étapes Totales",
  },
  kr: {
    title: "순례 여정",
    subtitle: "일정",
    location: "위치",
    viewDetails: "자세히 보기",
    loading: "로딩 중...",
    error: "실패",
    retry: "재시도",
    tabHajj: "하지",
    tabUmrah: "움라",
    totalDays: "총 일수",
    totalSteps: "총 단계",
  },
  jp: {
    title: "巡礼の旅",
    subtitle: "タイムライン",
    location: "場所",
    viewDetails: "詳細",
    loading: "読み込み中...",
    error: "失敗",
    retry: "再試行",
    tabHajj: "ハッジ",
    tabUmrah: "ウムラ",
    totalDays: "合計日数",
    totalSteps: "合計ステップ",
  },
};

export default function HajjJourneyPage() {
  const { locale } = useI18n();
  const safeLocale = (
    UI_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TEXT[safeLocale];

  // STATE: Switcher Haji / Umrah
  const [journeyType, setJourneyType] = useState<"haji" | "umrah">("haji");

  // --- API HOOK ---
  // Otomatis fetch ulang saat journeyType berubah
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetJourneysQuery({
    type: journeyType,
  });

  const rawData = apiResponse?.data || [];

  // STATE Detail
  const [selectedDay, setSelectedDay] = useState<DailyActivity | null>(null);

  // Helper Icon
  const getIcon = (loc: string): LucideIcon => {
    const l = loc.toLowerCase();
    if (l.includes("arafah") || l.includes("عرفة")) return Sun;
    if (l.includes("muzdalifah") || l.includes("مزدلفة")) return Moon;
    return Tent;
  };

  // Helper Strip HTML
  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html.replace(/<[^>]*>?/gm, "");
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Process Data
  const journey = useMemo(() => {
    if (!rawData) return [];

    // Sort by order
    const sorted = [...rawData].sort((a, b) => a.order - b.order);

    return sorted.map((item, index) => {
      // Simulasi status sederhana (Logic realnya bisa berdasarkan tanggal saat ini vs hijri date)
      let status: "completed" | "current" | "upcoming" = "upcoming";
      if (index === 0) status = "completed";
      else if (index === 1) status = "current";

      return {
        id: item.id,
        day: item.hijri_date,
        phase: item.title,
        location: stripHtml(item.location),
        description: stripHtml(item.description),
        activities: item.activities.map((act) => act.activity),
        status: status,
      };
    });
  }, [rawData]);

  // RENDER DETAIL
  if (selectedDay) {
    return (
      <JourneyDetail
        data={selectedDay}
        locale={safeLocale}
        onBack={() => setSelectedDay(null)}
        icon={getIcon(selectedDay.location)}
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
        {/* Header */}
        <header className="bg-awqaf-primary sticky top-0 z-30 pb-8 pt-4 rounded-b-[32px] shadow-lg">
          <div className="px-4">
            {/* Top Bar */}
            <div className="flex items-center gap-3 mb-6">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-white/10 text-white rounded-full"
                >
                  <ArrowLeft
                    className={`w-6 h-6 ${safeLocale === "ar" ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white font-comfortaa">
                  {t.title}
                </h1>
                <p className="text-white/80 text-xs font-comfortaa mt-1">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* TAB SWITCHER (NEW) */}
            <div className="bg-awqaf-secondary/30 p-1 rounded-xl flex gap-1 backdrop-blur-sm mb-4 border border-white/10">
              <button
                onClick={() => setJourneyType("umrah")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300
                  ${
                    journeyType === "umrah"
                      ? "bg-white text-awqaf-primary shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {t.tabUmrah}
              </button>
              <button
                onClick={() => setJourneyType("haji")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300
                  ${
                    journeyType === "haji"
                      ? "bg-white text-awqaf-primary shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {t.tabHajj}
              </button>
            </div>

            {/* Summary Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-awqaf-secondary rounded-full flex items-center justify-center font-bold text-awqaf-primary shadow-md">
                  {journey.length}
                </div>
                <div>
                  <p className="text-xs text-white/80">
                    {journeyType === "haji" ? t.totalDays : t.totalSteps}
                  </p>
                  <p className="font-bold text-xs truncate max-w-[150px]">
                    {journey.length > 0
                      ? `${journey[0].day} - ${journey[journey.length - 1].day}`
                      : "-"}
                  </p>
                </div>
              </div>
              <MapPin className="w-6 h-6 text-awqaf-secondary opacity-80" />
            </div>
          </div>
        </header>

        {/* Timeline Content */}
        <main className="px-5 py-8 relative">
          {/* Vertical Line */}
          <div
            className={`absolute top-10 bottom-10 w-[2px] bg-gradient-to-b from-awqaf-primary via-accent-100 to-transparent ${safeLocale === "ar" ? "right-[2.35rem]" : "left-[2.35rem]"} z-0`}
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
            <div className="flex flex-col items-center justify-center py-10 relative z-10 bg-white rounded-xl shadow-sm border border-red-100 p-6 text-center mx-4">
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
            journey.map((item) => {
              const Icon = getIcon(item.location);
              const isCompleted = item.status === "completed";
              const isCurrent = item.status === "current";

              return (
                <div
                  key={item.id}
                  className="relative z-10 mb-8 last:mb-0 group cursor-pointer"
                  onClick={() => setSelectedDay(item)}
                >
                  <div className="flex gap-5 items-stretch">
                    {/* Timeline Dot/Icon */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div
                        className={`
                      w-10 h-10 rounded-full flex items-center justify-center shadow-md border-4 transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-awqaf-primary border-awqaf-primary text-white"
                          : isCurrent
                            ? "bg-white border-awqaf-secondary text-awqaf-primary scale-110 ring-4 ring-awqaf-secondary/20"
                            : "bg-white border-slate-200 text-slate-300"
                      }
                    `}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <CircleDot className="w-5 h-5" />
                        )}
                      </div>
                    </div>

                    {/* Content Card */}
                    <Card
                      className={`
                    flex-1 border-none shadow-sm transition-all duration-300 overflow-hidden
                    ${isCurrent ? "shadow-lg ring-1 ring-awqaf-secondary translate-x-1" : "hover:shadow-md hover:bg-slate-50"}
                  `}
                    >
                      <CardContent className="p-0">
                        {/* Date Header */}
                        <div
                          className={`
                        px-4 py-2 flex items-center justify-between text-xs font-bold
                        ${isCurrent ? "bg-awqaf-secondary/20 text-awqaf-primary" : "bg-slate-100 text-slate-500"}
                      `}
                        >
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>{item.day}</span>
                          </div>
                          {isCurrent && (
                            <Badge className="bg-awqaf-secondary text-awqaf-primary hover:bg-awqaf-secondary border-0 text-[10px] px-2 h-5">
                              NOW
                            </Badge>
                          )}
                        </div>

                        {/* Main Info */}
                        <div className="p-4">
                          <h3
                            className={`font-bold font-comfortaa text-lg mb-1 ${isCurrent ? "text-awqaf-primary" : "text-slate-800"}`}
                          >
                            {item.phase}
                          </h3>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                            <MapPin className="w-3.5 h-3.5 text-awqaf-secondary" />
                            <span className="text-slate-600">
                              {item.location}
                            </span>
                          </div>

                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3 font-comfortaa">
                            {item.description}
                          </p>

                          <div className="flex items-center text-xs font-bold text-awqaf-primary group-hover:underline decoration-awqaf-primary/30">
                            {t.viewDetails}
                            <ChevronRight
                              className={`w-3.5 h-3.5 ${safeLocale === "ar" ? "mr-1 rotate-180" : "ml-1"}`}
                            />
                          </div>
                        </div>
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