"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircleHeart, // Syahadat
  Timer, // Shalat
  HandCoins, // Zakat
  Moon, // Puasa
  MapPin, // Haji
  ChevronRight,
  LayoutGrid, // Default Icon
  LucideIcon,
  Loader2, // Loading Spinner
  AlertCircle, // Error Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";
import {
  useGetRukunIslamQuery,
  RukunIslamItem,
} from "@/services/public/rukun-islam.service";
import IslamDetail from "./islam-detail";
import { LocaleCode } from "@/lib/i18n";

interface UIText {
  title: string;
  subtitle: string;
  read: string;
  back: string;
  loading: string;
  error: string;
  retry: string;
}

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Rukun Islam",
    subtitle: "5 Pilar Tindakan",
    read: "Pelajari",
    back: "Kembali",
    loading: "Memuat data...",
    error: "Gagal memuat data",
    retry: "Coba Lagi",
  },
  en: {
    title: "Pillars of Islam",
    subtitle: "5 Pillars of Action",
    read: "Learn",
    back: "Back",
    loading: "Loading data...",
    error: "Failed to load data",
    retry: "Retry",
  },
  ar: {
    title: "أركان الإسلام",
    subtitle: "٥ أركان عملية",
    read: "تعلم",
    back: "رجوع",
    loading: "جار التحميل...",
    error: "فشل تحميل البيانات",
    retry: "أعد المحاولة",
  },
  fr: {
    title: "Piliers de l'Islam",
    subtitle: "5 Piliers d'Action",
    read: "Apprendre",
    back: "Retour",
    loading: "Chargement...",
    error: "Échec du chargement",
    retry: "Réessayer",
  },
  kr: {
    title: "이슬람의 기둥",
    subtitle: "5가지 실천",
    read: "배우기",
    back: "뒤로",
    loading: "로딩 중...",
    error: "데이터 로드 실패",
    retry: "재시도",
  },
  jp: {
    title: "イスラムの柱",
    subtitle: "5つの行い",
    read: "学ぶ",
    back: "戻る",
    loading: "読み込み中...",
    error: "読み込み失敗",
    retry: "再試行",
  },
};

export default function RukunIslamPage() {
  const { locale } = useI18n();
  const safeLocale = (
    UI_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TEXT[safeLocale];

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetRukunIslamQuery({ page: 1 });
  const rukunData = apiResponse?.data?.data || [];

  const [selectedItem, setSelectedItem] = useState<RukunIslamItem | null>(null);

  const getTranslation = (
    item: RukunIslamItem,
    field: "title" | "description",
  ) => {
    const trans = item.translations?.find((tr) => tr.locale === safeLocale);
    if (trans && trans[field]) return trans[field];
    const enTrans = item.translations?.find((tr) => tr.locale === "en");
    if (enTrans && enTrans[field]) return enTrans[field];
    if (field === "title") return item.title;
    return item.description;
  };

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html.replace(/<[^>]*>?/gm, "");
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getIcon = (order: number): LucideIcon => {
    switch (order) {
      case 1:
        return MessageCircleHeart;
      case 2:
        return Timer;
      case 3:
        return HandCoins;
      case 4:
        return Moon;
      case 5:
        return MapPin;
      default:
        return LayoutGrid;
    }
  };

  if (selectedItem) {
    const detailTitle = getTranslation(selectedItem, "title");
    const detailContent = getTranslation(selectedItem, "description");

    const processedItem = {
      ...selectedItem,
      title: detailTitle,
      content: detailContent,
      shortDesc: stripHtml(detailContent).substring(0, 100) + "...",
    };

    return (
      <IslamDetail
        item={processedItem}
        locale={safeLocale}
        onBack={() => setSelectedItem(null)}
        icon={getIcon(selectedItem.order)}
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
                <p className="text-xs text-awqaf-foreground-primary font-comfortaa">
                  {t.subtitle}
                </p>
              </div>
              <div className="w-10 h-10" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-2 space-y-4">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-awqaf-primary animate-spin mb-2" />
            <p className="text-sm text-awqaf-foreground-primary font-comfortaa">
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

        {/* List Items */}
        {!isLoading &&
          !isError &&
          rukunData.map((item) => {
            const Icon = getIcon(item.order);
            const title = getTranslation(item, "title");
            const rawDesc = getTranslation(item, "description");
            const shortDesc =
              rawDesc.replace(/<[^>]*>?/gm, "").substring(0, 80) + "...";

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="cursor-pointer group"
              >
                <Card className="border-awqaf-border-light hover:border-awqaf-primary/30 shadow-sm hover:shadow-md transition-all duration-300 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden hover:-translate-y-1">
                  <CardContent className="p-4 flex gap-4">
                    {/* Icon Box */}
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <div className="absolute inset-0 bg-accent-50 rounded-xl rotate-3 group-hover:rotate-6 transition-transform border border-accent-100"></div>
                      <div className="absolute inset-0 bg-white border border-awqaf-border-light rounded-xl flex items-center justify-center shadow-sm z-10 group-hover:border-awqaf-primary/50 transition-colors">
                        <Icon className="w-6 h-6 text-awqaf-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <Badge className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-awqaf-primary text-white text-[10px] z-20 border-2 border-white shadow-sm font-bold font-comfortaa">
                        {item.order}
                      </Badge>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-awqaf-primary font-comfortaa mb-1 group-hover:text-awqaf-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-xs text-awqaf-foreground-primary line-clamp-2 font-comfortaa leading-relaxed">
                        {shortDesc}
                      </p>

                      <div className="mt-2 flex items-center justify-end">
                        <span className="text-[10px] font-bold text-awqaf-primary flex items-center gap-1 group-hover:gap-2 transition-all font-comfortaa">
                          {t.read}{" "}
                          <ChevronRight
                            className={`w-3 h-3 ${safeLocale === "ar" ? "rotate-180" : ""}`}
                          />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
      </main>
    </div>
  );
}