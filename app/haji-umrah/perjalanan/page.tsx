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
  Loader2,
  AlertCircle,
  Footprints,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";
import { useGetJourneysQuery } from "@/services/public/journey.service";
import JourneyDetail from "./detail";
import { LocaleCode } from "@/lib/i18n";

export interface DailyActivity {
  id: number;
  day: string;
  phase: string;
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

  const [journeyType, setJourneyType] = useState<"haji" | "umrah">("haji");

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetJourneysQuery({
    type: journeyType,
  });

  const rawData = apiResponse?.data || [];
  const [selectedDay, setSelectedDay] = useState<DailyActivity | null>(null);

  const getIcon = (loc: string) => {
    const l = loc.toLowerCase();
    if (l.includes("arafah") || l.includes("عرفة")) return Sun;
    if (l.includes("muzdalifah") || l.includes("مزدلفة")) return Moon;
    return Tent;
  };

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html.replace(/<[^>]*>?/gm, "");
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const journey = useMemo(() => {
    if (!rawData) return [];
    const sorted = [...rawData].sort((a, b) => a.order - b.order);
    return sorted.map((item, index) => {
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
        {/* TABS */}
        <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-xl flex gap-2 border border-awqaf-border-light/50 shadow-sm mb-4">
          <button
            onClick={() => setJourneyType("umrah")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300
              ${
                journeyType === "umrah"
                  ? "bg-awqaf-primary text-white shadow-md"
                  : "text-awqaf-foreground-secondary hover:bg-accent-50 hover:text-awqaf-primary"
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
                  ? "bg-awqaf-primary text-white shadow-md"
                  : "text-awqaf-foreground-secondary hover:bg-accent-50 hover:text-awqaf-primary"
              }
            `}
          >
            {t.tabHajj}
          </button>
        </div>

        {/* STATS WIDGET (Moved from Header) */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Card className="border-awqaf-border-light bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-awqaf-primary">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {t.totalDays}
                </p>
                <p className="font-bold text-awqaf-primary font-comfortaa">
                  {journey.length > 0
                    ? `${journey[0].day.split(" ")[0]} - ${journey[journey.length - 1].day.split(" ")[0]}`
                    : "-"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-awqaf-border-light bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-awqaf-primary">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {t.totalSteps}
                </p>
                <p className="font-bold text-awqaf-primary font-comfortaa">
                  {journey.length} {safeLocale === "en" ? "Steps" : "Tahap"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TIMELINE */}
        <div className="relative">
          {/* Vertical Line */}
          <div
            className={`absolute top-4 bottom-10 w-0.5 bg-awqaf-primary/20 ${
              safeLocale === "ar" ? "right-[1.15rem]" : "left-[1.15rem]"
            } z-0`}
          ></div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 relative z-10">
              <Loader2 className="w-8 h-8 text-awqaf-primary animate-spin mb-2" />
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {t.loading}
              </p>
            </div>
          )}

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

          {!isLoading &&
            !isError &&
            journey.map((item) => {
              const isCompleted = item.status === "completed";
              const isCurrent = item.status === "current";

              return (
                <div
                  key={item.id}
                  className="relative z-10 mb-6 last:mb-0 group cursor-pointer"
                  onClick={() => setSelectedDay(item)}
                >
                  <div className="flex gap-4 items-stretch">
                    {/* Timeline Dot */}
                    <div className="flex-shrink-0 flex flex-col items-center pt-1">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 shadow-sm
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
                        ) : isCurrent ? (
                          <Clock className="w-5 h-5 animate-pulse" />
                        ) : (
                          <CircleDot className="w-5 h-5" />
                        )}
                      </div>
                    </div>

                    {/* Content Card */}
                    <Card
                      className={`
                        flex-1 border-awqaf-border-light shadow-sm transition-all duration-300 overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl
                        ${
                          isCurrent
                            ? "border-awqaf-secondary/50 shadow-lg shadow-awqaf-secondary/10"
                            : "hover:shadow-md hover:border-awqaf-primary/30"
                        }
                      `}
                    >
                      <CardContent className="p-0">
                        {/* Header Card */}
                        <div
                          className={`
                            px-4 py-2 flex items-center justify-between text-xs font-bold font-comfortaa
                            ${
                              isCurrent
                                ? "bg-awqaf-secondary/10 text-awqaf-primary"
                                : "bg-accent-50/50 text-awqaf-foreground-secondary"
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>{item.day}</span>
                          </div>
                          {isCurrent && (
                            <Badge className="bg-awqaf-secondary text-white hover:bg-awqaf-secondary border-0 text-[10px] px-2 h-5">
                              NOW
                            </Badge>
                          )}
                        </div>

                        {/* Body Card */}
                        <div className="p-4">
                          <h3
                            className={`font-bold font-comfortaa text-lg mb-1 leading-tight ${
                              isCurrent
                                ? "text-awqaf-primary"
                                : "text-card-foreground"
                            }`}
                          >
                            {item.phase}
                          </h3>

                          <div className="flex items-center gap-1.5 text-xs text-awqaf-foreground-secondary font-medium mb-3">
                            <MapPin className="w-3.5 h-3.5 text-awqaf-secondary" />
                            <span>{item.location}</span>
                          </div>

                          <p className="text-sm text-awqaf-foreground-secondary/80 leading-relaxed line-clamp-2 mb-3 font-comfortaa">
                            {item.description}
                          </p>

                          <div className="flex items-center text-xs font-bold text-awqaf-primary group-hover:underline decoration-awqaf-primary/30 font-comfortaa">
                            {t.viewDetails}
                            <ChevronRight
                              className={`w-3.5 h-3.5 ${
                                safeLocale === "ar" ? "mr-1 rotate-180" : "ml-1"
                              }`}
                            />
                          </div>
                        </div>
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