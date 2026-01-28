"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  MessageCircleQuestion,
  User,
  ChevronRight,
  Loader2,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";
import {
  useGetFatwaSyaikhQuery,
  FatwaItem,
} from "@/services/public/fatwa.service";
import FatwaDetail from "./fatwa-detail";

type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface ProcessedFatwaItem {
  id: number;
  sheikh: string;
  category: string;
  question: string;
  answer: string;
}

interface UIText {
  title: string;
  subtitle: string;
  search: string;
  all: string;
  read: string;
  noData: string;
  loading: string;
  error: string;
  retry: string;
}

interface CategoryNames {
  ibadah: string;
  muamalah: string;
  aqidah: string;
  adab: string;
}

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Fatwa Ulama",
    subtitle: "Kumpulan Tanya Jawab",
    search: "Cari topik fatwa...",
    all: "Semua",
    read: "Baca",
    noData: "Fatwa tidak ditemukan",
    loading: "Memuat data...",
    error: "Gagal memuat data",
    retry: "Coba Lagi",
  },
  en: {
    title: "Scholars' Fatwa",
    subtitle: "Q&A Collection",
    search: "Search topic...",
    all: "All",
    read: "Read",
    noData: "No fatwa found",
    loading: "Loading data...",
    error: "Failed to load data",
    retry: "Retry",
  },
  ar: {
    title: "فتاوى العلماء",
    subtitle: "مجموعة أسئلة وأجوبة",
    search: "بحث...",
    all: "الكل",
    read: "اقرأ",
    noData: "لا توجد فتاوى",
    loading: "جار التحميل...",
    error: "فشل تحميل البيانات",
    retry: "أعد المحاولة",
  },
  fr: {
    title: "Fatwas des Savants",
    subtitle: "Collection Q&R",
    search: "Rechercher...",
    all: "Tout",
    read: "Lire",
    noData: "Aucune fatwa trouvée",
    loading: "Chargement...",
    error: "Échec du chargement",
    retry: "Réessayer",
  },
  kr: {
    title: "학자들의 파트와",
    subtitle: "Q&A 모음",
    search: "검색...",
    all: "전체",
    read: "읽다",
    noData: "결과 없음",
    loading: "로딩 중...",
    error: "데이터 로드 실패",
    retry: "재시도",
  },
  jp: {
    title: "学者のファトワ",
    subtitle: "Q&Aコレクション",
    search: "検索...",
    all: "すべて",
    read: "読む",
    noData: "見つかりません",
    loading: "読み込み中...",
    error: "読み込み失敗",
    retry: "再試行",
  },
};

const CATEGORIES: Record<LocaleCode, CategoryNames> = {
  id: {
    ibadah: "Ibadah",
    muamalah: "Muamalah",
    aqidah: "Aqidah",
    adab: "Adab",
  },
  en: {
    ibadah: "Worship",
    muamalah: "Transaction",
    aqidah: "Creed",
    adab: "Etiquette",
  },
  ar: {
    ibadah: "العبادات",
    muamalah: "المعاملات",
    aqidah: "العقيدة",
    adab: "الآداب",
  },
  fr: {
    ibadah: "Culte",
    muamalah: "Transactions",
    aqidah: "Croyance",
    adab: "Éthique",
  },
  kr: { ibadah: "예배", muamalah: "거래", aqidah: "신조", adab: "에티켓" },
  jp: { ibadah: "礼拝", muamalah: "取引", aqidah: "信条", adab: "作法" },
};

export default function FatwaPage() {
  const { locale } = useI18n();
  const safeLocale = (
    UI_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TEXT[safeLocale];
  const cats = CATEGORIES[safeLocale];

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetFatwaSyaikhQuery({ page: 1 });
  const fatwaData = apiResponse?.data?.data || [];

  const [selectedFatwa, setSelectedFatwa] = useState<ProcessedFatwaItem | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const getTranslation = (item: FatwaItem, field: "question" | "answer") => {
    const trans = item.translations?.find((tr) => tr.locale === safeLocale);
    if (trans && trans[field]) return trans[field];
    const enTrans = item.translations?.find((tr) => tr.locale === "en");
    if (enTrans && enTrans[field]) return enTrans[field];
    if (field === "question") return item.question;
    return item.answer;
  };

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") {
      return html.replace(/<[^>]*>?/gm, "");
    }
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const displayedData = useMemo(() => {
    return fatwaData
      .filter((item) => {
        const itemQuestion = getTranslation(item, "question").toLowerCase();
        const matchSearch = itemQuestion.includes(searchQuery.toLowerCase());
        const matchCat =
          activeCategory === "all" ||
          item.category.toLowerCase().includes(activeCategory);
        return matchCat && matchSearch;
      })
      .map((item) => ({
        id: item.id,
        sheikh: item.name,
        category: item.category,
        question: stripHtml(getTranslation(item, "question")),
        answer: getTranslation(item, "answer"),
      }));
  }, [fatwaData, safeLocale, activeCategory, searchQuery]);

  if (selectedFatwa) {
    return (
      <FatwaDetail
        item={selectedFatwa}
        locale={safeLocale}
        onBack={() => setSelectedFatwa(null)}
        catLabel={
          cats[selectedFatwa.category.toLowerCase() as keyof CategoryNames] ||
          selectedFatwa.category
        }
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

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-2 space-y-4">
        {/* Search Bar Widget */}
        <div className="relative">
          <div className="relative bg-white/80 backdrop-blur rounded-xl shadow-sm border border-awqaf-border-light/50 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-awqaf-primary/20 focus-within:border-awqaf-primary">
            <Search
              className={`absolute ${
                safeLocale === "ar" ? "right-3" : "left-3"
              } top-1/2 -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary`}
            />
            <Input
              placeholder={t.search}
              className={`bg-transparent border-0 h-12 focus-visible:ring-0 ${
                safeLocale === "ar" ? "pr-10" : "pl-10"
              } placeholder:text-awqaf-foreground-secondary/70 text-awqaf-primary font-comfortaa text-sm`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { id: "all", label: t.all },
            { id: "aqidah", label: cats.aqidah },
            { id: "ibadah", label: cats.ibadah },
            { id: "muamalah", label: cats.muamalah },
            { id: "adab", label: cats.adab },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  px-4 py-2 rounded-full text-xs font-bold font-comfortaa whitespace-nowrap transition-all duration-200 border
                  ${
                    isActive
                      ? "bg-awqaf-primary text-white border-awqaf-primary shadow-md"
                      : "bg-white/80 text-awqaf-foreground-secondary border-awqaf-border-light/50 hover:bg-white"
                  }
                `}
              >
                {cat.label}
              </button>
            );
          })}
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

        {/* Fatwa List */}
        {!isLoading && !isError && displayedData.length > 0
          ? displayedData.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedFatwa(item)}
                className="cursor-pointer group"
              >
                <Card className="border-awqaf-border-light shadow-sm hover:shadow-md transition-all duration-300 bg-white/95 backdrop-blur-sm rounded-2xl hover:border-awqaf-primary/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="outline"
                        className="border-awqaf-primary/20 text-awqaf-primary bg-awqaf-primary/5 text-[10px] h-5 px-2 font-normal capitalize font-comfortaa"
                      >
                        {cats[
                          item.category.toLowerCase() as keyof CategoryNames
                        ] || item.category}
                      </Badge>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-accent-50 flex items-center justify-center text-awqaf-primary flex-shrink-0 mt-0.5 border border-accent-100">
                        <MessageCircleQuestion className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-awqaf-primary font-comfortaa text-sm leading-relaxed line-clamp-2">
                        {item.question}
                      </h3>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-awqaf-border-light/50 pt-3">
                      <div className="flex items-center gap-1.5 text-xs text-awqaf-foreground-secondary font-comfortaa">
                        <User className="w-3.5 h-3.5 text-awqaf-secondary" />
                        <span className="truncate max-w-[140px] font-medium">
                          {item.sheikh}
                        </span>
                      </div>
                      <div className="flex items-center text-[10px] font-bold text-awqaf-primary font-comfortaa group-hover:underline">
                        {t.read}
                        <ChevronRight
                          className={`w-3 h-3 ${safeLocale === "ar" ? "mr-1 rotate-180" : "ml-1"}`}
                        />
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
                  <BookOpen className="w-8 h-8 text-awqaf-foreground-secondary/50" />
                </div>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {t.noData}
                </p>
              </div>
            )}
      </main>
    </div>
  );
}