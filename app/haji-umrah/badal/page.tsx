"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HeartHandshake,
  FileCheck,
  Video,
  Users,
  ShieldCheck,
  Plane,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// Import Service & Types
import { useGetBadalsQuery, BadalItem } from "@/services/public/badal.service";

// Import komponen detail
import BadalDetail from "./detail";
import { LocaleCode } from "@/lib/i18n";
export type ServiceType = "umrah" | "haji";

// Interface untuk data yang sudah diproses agar lebih mudah dikonsumsi UI
export interface ProcessedBadalPackage {
  id: number;
  type: ServiceType;
  title: string;
  executor: string;
  priceDisplay: string;
  shortDesc: string; // Plain text stripped from HTML
  features: string[];
  description: string; // Full HTML
}

interface UIText {
  title: string;
  subtitle: string;
  tabUmrah: string;
  tabHaji: string;
  by: string; // "Oleh..."
  choose: string; // "Pilih Paket"
  loading: string;
  error: string;
  retry: string;
  trustTitle: string;
  trustDesc: string;
  empty: string;
}

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Badal Haji & Umrah",
    subtitle: "Amanah & Sesuai Sunnah",
    tabUmrah: "Umrah",
    tabHaji: "Haji",
    by: "Oleh",
    choose: "Pilih Paket",
    loading: "Memuat paket...",
    error: "Gagal memuat data",
    retry: "Coba Lagi",
    trustTitle: "Terpercaya & Amanah",
    trustDesc:
      "Dilaksanakan oleh penuntut ilmu dan asatidz yang bermukim di Tanah Suci.",
    empty: "Belum ada paket tersedia saat ini.",
  },
  en: {
    title: "Badal Hajj & Umrah",
    subtitle: "Trustworthy Services",
    tabUmrah: "Umrah",
    tabHaji: "Hajj",
    by: "By",
    choose: "Select",
    loading: "Loading packages...",
    error: "Failed to load data",
    retry: "Retry",
    trustTitle: "Trustworthy & Reliable",
    trustDesc: "Performed by students and scholars residing in the Holy Land.",
    empty: "No packages available at the moment.",
  },
  ar: {
    title: "البدل في الحج والعمرة",
    subtitle: "خدمات موثوقة",
    tabUmrah: "العمرة",
    tabHaji: "الحج",
    by: "بواسطة",
    choose: "اختر",
    loading: "جار التحميل...",
    error: "فشل التحميل",
    retry: "أعد المحاولة",
    trustTitle: "موثوق وأمين",
    trustDesc: "يقوم بها طلاب العلم والمشايخ المقيمون في البقاع المقدسة.",
    empty: "لا توجد باقات متاحة حاليا.",
  },
  fr: {
    title: "Badal Hajj & Omra",
    subtitle: "Services de Confiance",
    tabUmrah: "Omra",
    tabHaji: "Hajj",
    by: "Par",
    choose: "Choisir",
    loading: "Chargement...",
    error: "Échec",
    retry: "Réessayer",
    trustTitle: "Digne de Confiance",
    trustDesc:
      "Effectué par des étudiants et des savants résidant en Terre Sainte.",
    empty: "Aucun forfait disponible pour le moment.",
  },
  kr: {
    title: "바달 하지 & 움라",
    subtitle: "신뢰할 수 있는 서비스",
    tabUmrah: "움라",
    tabHaji: "하지",
    by: "대행",
    choose: "선택",
    loading: "로딩 중...",
    error: "실패",
    retry: "재시도",
    trustTitle: "신뢰할 수 있는",
    trustDesc: "성지에 거주하는 학생과 학자들이 수행합니다.",
    empty: "현재 사용 가능한 패키지가 없습니다.",
  },
  jp: {
    title: "バダル・ハッジ＆ウムラ",
    subtitle: "信頼できるサービス",
    tabUmrah: "ウムラ",
    tabHaji: "ハッジ",
    by: "代行",
    choose: "選択",
    loading: "読み込み中...",
    error: "失敗",
    retry: "再試行",
    trustTitle: "信頼と安心",
    trustDesc: "聖地に居住する学生や学者が代行します。",
    empty: "現在利用可能なパッケージはありません。",
  },
};

export default function BadalPage() {
  const { locale } = useI18n();
  const safeLocale = (
    UI_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TEXT[safeLocale];

  // STATE
  const [activeTab, setActiveTab] = useState<ServiceType>("umrah");
  const [selectedPackage, setSelectedPackage] =
    useState<ProcessedBadalPackage | null>(null);

  // --- API HOOK ---
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetBadalsQuery({
    type: activeTab,
  });

  const rawData = apiResponse?.data || [];

  // Helper Format Currency
  const formatCurrency = (amount: number, locale: string) => {
    // Sederhana: IDR default, bisa disesuaikan jika API support multi-currency
    return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
      style: "currency",
      currency: locale === "id" ? "IDR" : "USD", // Asumsi simplifikasi, idealnya dari API currency code
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper Strip HTML
  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html.replace(/<[^>]*>?/gm, "");
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Process Data
  const displayedPackages = useMemo(() => {
    if (!rawData) return [];

    return rawData.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      executor: item.organizer?.name || "Organizer",
      priceDisplay: formatCurrency(item.price, safeLocale),
      // Ambil short description dari description (first sentence or substring)
      shortDesc: stripHtml(item.description).substring(0, 80) + "...",
      // Map features dari check_tags
      features: item.check_tags.map((tag) => tag.badal_tag.name),
      description: item.description,
    }));
  }, [rawData, safeLocale]);

  // RENDER DETAIL
  if (selectedPackage) {
    return (
      <BadalDetail
        pkg={selectedPackage}
        locale={safeLocale}
        onBack={() => setSelectedPackage(null)}
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
        {/* Header & Hero */}
        <div className="bg-awqaf-primary pb-8 rounded-b-[32px] shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

          <div className="px-4 pt-4 relative z-10">
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

            {/* Trust Banner */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex items-start gap-3">
              <div className="bg-awqaf-secondary p-2 rounded-lg text-awqaf-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">
                  {t.trustTitle}
                </h3>
                <p className="text-white/80 text-xs leading-relaxed">
                  {t.trustDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 -mt-6 relative z-20">
          <div className="bg-white rounded-xl shadow-md p-1.5 flex gap-1 border border-slate-100">
            <button
              onClick={() => setActiveTab("umrah")}
              className={`flex-1 py-3 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300 flex items-center justify-center gap-2
                  ${
                    activeTab === "umrah"
                      ? "bg-awqaf-primary text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50"
                  }
                `}
            >
              <Plane
                className={`w-4 h-4 ${activeTab === "umrah" ? "text-awqaf-secondary" : "text-slate-400"}`}
              />
              {t.tabUmrah}
            </button>
            <button
              onClick={() => setActiveTab("haji")}
              className={`flex-1 py-3 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300 flex items-center justify-center gap-2
                  ${
                    activeTab === "haji"
                      ? "bg-awqaf-primary text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50"
                  }
                `}
            >
              <HeartHandshake
                className={`w-4 h-4 ${activeTab === "haji" ? "text-awqaf-secondary" : "text-slate-400"}`}
              />
              {t.tabHaji}
            </button>
          </div>
        </div>

        {/* List Content */}
        <main className="px-5 py-6 space-y-4">
          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-awqaf-primary animate-spin mb-2" />
              <p className="text-sm text-slate-500">{t.loading}</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-xl shadow-sm border border-red-100 p-6 text-center">
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

          {/* Data List */}
          {!isLoading && !isError && displayedPackages.length > 0
            ? displayedPackages.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPackage(item)}
                  className="group cursor-pointer"
                >
                  <Card className="border-none shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white ring-1 ring-slate-100 rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Left Side: Color Bar */}
                        <div
                          className={`w-2 ${item.type === "haji" ? "bg-awqaf-secondary" : "bg-awqaf-primary"}`}
                        ></div>

                        {/* Main Content */}
                        <div className="p-5 flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <Badge
                              variant="secondary"
                              className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider"
                            >
                              {item.type}
                            </Badge>
                            <p className="font-bold text-awqaf-primary text-base">
                              {item.priceDisplay}
                            </p>
                          </div>

                          <h3 className="font-bold text-slate-800 text-lg mb-2 font-comfortaa line-clamp-1 group-hover:text-awqaf-primary transition-colors">
                            {item.title}
                          </h3>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                            <Users className="w-3.5 h-3.5 text-awqaf-secondary" />
                            <span className="truncate">
                              {t.by}: {item.executor}
                            </span>
                          </div>

                          {/* Features Preview */}
                          <div className="flex gap-2 mb-4 overflow-hidden">
                            {item.features.slice(0, 2).map((feat, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1 bg-accent-50 px-2 py-1 rounded-md border border-accent-100 shrink-0"
                              >
                                <FileCheck className="w-3 h-3 text-awqaf-primary" />
                                <span className="text-[10px] text-slate-700 font-medium truncate max-w-[80px]">
                                  {feat}
                                </span>
                              </div>
                            ))}
                            {item.features.length > 2 && (
                              <span className="text-[10px] text-slate-400 self-center">
                                +{item.features.length - 2}
                              </span>
                            )}
                          </div>

                          <Button
                            size="sm"
                            className="w-full h-9 rounded-lg bg-white border border-awqaf-primary text-awqaf-primary hover:bg-awqaf-primary hover:text-white font-bold text-xs transition-colors"
                          >
                            {t.choose}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            : !isLoading &&
              !isError && (
                <div className="text-center py-12 text-slate-400">
                  <HeartHandshake className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t.empty}</p>
                </div>
              )}
        </main>
      </div>
    </div>
  );
}