"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HeartHandshake,
  FileCheck,
  Users,
  ShieldCheck,
  Plane,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";
import { useGetBadalsQuery, BadalItem } from "@/services/public/badal.service";
import BadalDetail from "./detail";
import { LocaleCode } from "@/lib/i18n";

export type ServiceType = "umrah" | "haji";

export interface ProcessedBadalPackage {
  id: number;
  type: ServiceType;
  title: string;
  executor: string;
  priceDisplay: string;
  shortDesc: string;
  features: string[];
  description: string;
}

interface UIText {
  title: string;
  subtitle: string;
  tabUmrah: string;
  tabHaji: string;
  by: string;
  choose: string;
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
    choose: "Pilih",
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

  const [activeTab, setActiveTab] = useState<ServiceType>("umrah");
  const [selectedPackage, setSelectedPackage] =
    useState<ProcessedBadalPackage | null>(null);

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetBadalsQuery({
    type: activeTab,
  });

  const rawData = apiResponse?.data || [];

  const formatCurrency = (amount: number, locale: string) => {
    return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
      style: "currency",
      currency: locale === "id" ? "IDR" : "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html.replace(/<[^>]*>?/gm, "");
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const displayedPackages = useMemo(() => {
    if (!rawData) return [];
    return rawData.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      executor: item.organizer?.name || "Organizer",
      priceDisplay: formatCurrency(item.price, safeLocale),
      shortDesc: stripHtml(item.description).substring(0, 80) + "...",
      features: item.check_tags.map((tag) => tag.badal_tag.name),
      description: item.description,
    }));
  }, [rawData, safeLocale]);

  if (selectedPackage) {
    return (
      <BadalDetail
        pkg={selectedPackage}
        locale={safeLocale}
        onBack={() => setSelectedPackage(null)}
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

      {/* CONTENT */}
      <main className="max-w-md mx-auto px-4 py-2 space-y-4">
        {/* Trust Banner Widget */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-awqaf-border-light/50 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center text-awqaf-primary flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-awqaf-primary font-bold text-sm font-comfortaa mb-0.5">
              {t.trustTitle}
            </h3>
            <p className="text-awqaf-foreground-secondary text-xs leading-relaxed font-comfortaa">
              {t.trustDesc}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-xl flex gap-2 border border-awqaf-border-light/50 shadow-sm">
          <button
            onClick={() => setActiveTab("umrah")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300 flex items-center justify-center gap-2
              ${
                activeTab === "umrah"
                  ? "bg-awqaf-primary text-white shadow-md"
                  : "text-awqaf-foreground-secondary hover:bg-accent-50 hover:text-awqaf-primary"
              }
            `}
          >
            <Plane className="w-4 h-4" />
            {t.tabUmrah}
          </button>
          <button
            onClick={() => setActiveTab("haji")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300 flex items-center justify-center gap-2
              ${
                activeTab === "haji"
                  ? "bg-awqaf-primary text-white shadow-md"
                  : "text-awqaf-foreground-secondary hover:bg-accent-50 hover:text-awqaf-primary"
              }
            `}
          >
            <HeartHandshake className="w-4 h-4" />
            {t.tabHaji}
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-awqaf-primary animate-spin mb-2" />
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
              {t.loading}
            </p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <Card className="border-red-200 bg-red-50">
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

        {/* Package List */}
        {!isLoading && !isError && displayedPackages.length > 0
          ? displayedPackages.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPackage(item)}
                className="group cursor-pointer"
              >
                <Card className="border-awqaf-border-light hover:border-awqaf-primary/50 shadow-sm hover:shadow-md transition-all duration-300 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-stretch">
                      {/* Color Stripe */}
                      <div
                        className={`w-1.5 ${
                          item.type === "haji"
                            ? "bg-awqaf-secondary"
                            : "bg-awqaf-primary"
                        }`}
                      ></div>

                      <div className="p-4 flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            className={`border-0 text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold ${item.type === "haji" ? "bg-awqaf-secondary/20 text-awqaf-primary" : "bg-awqaf-primary/10 text-awqaf-primary"}`}
                          >
                            {item.type}
                          </Badge>
                          <div className="text-right">
                            <p className="font-bold text-awqaf-primary text-base font-comfortaa">
                              {item.priceDisplay}
                            </p>
                          </div>
                        </div>

                        <h3 className="font-bold text-awqaf-primary text-lg mb-2 font-comfortaa line-clamp-1">
                          {item.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-awqaf-foreground-secondary mb-3 font-comfortaa">
                          <Users className="w-3.5 h-3.5 text-awqaf-secondary" />
                          <span className="truncate">
                            {t.by}: {item.executor}
                          </span>
                        </div>

                        {/* Features Chips */}
                        <div className="flex gap-2 mb-4 overflow-hidden">
                          {item.features.slice(0, 2).map((feat, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1 bg-accent-50 px-2 py-1 rounded-lg border border-accent-100 shrink-0"
                            >
                              <FileCheck className="w-3 h-3 text-awqaf-primary" />
                              <span className="text-[10px] text-awqaf-foreground-secondary font-medium font-comfortaa truncate max-w-[80px]">
                                {feat}
                              </span>
                            </div>
                          ))}
                          {item.features.length > 2 && (
                            <span className="text-[10px] text-awqaf-foreground-secondary/60 self-center font-comfortaa">
                              +{item.features.length - 2}
                            </span>
                          )}
                        </div>

                        <Button
                          size="sm"
                          className="w-full h-9 rounded-xl bg-white border border-awqaf-primary text-awqaf-primary hover:bg-awqaf-primary hover:text-white font-bold text-xs font-comfortaa transition-colors flex items-center justify-center gap-1"
                        >
                          {t.choose}
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          : !isLoading &&
            !isError && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartHandshake className="w-8 h-8 text-awqaf-foreground-secondary/50" />
                </div>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {t.empty}
                </p>
              </div>
            )}
      </main>
    </div>
  );
}