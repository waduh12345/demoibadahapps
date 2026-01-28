"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Scroll,
  Star,
  Heart,
  Users,
  BookOpen,
  ChevronRight,
  Library,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";
import { useGetSirahQuery, SirahItem } from "@/services/public/sirah.service";
import SirahDetail from "./sirah-detail";

type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface ProcessedSirahItem {
  id: number;
  category: string;
  title: string;
  content: string;
  excerpt: string;
}

interface UIText {
  title: string;
  search: string;
  all: string;
  read: string;
  noData: string;
  loading: string;
  error: string;
  retry: string;
}

interface CategoryNames {
  nabi: string;
  muhammad: string;
  istri: string;
  sahabat: string;
  ulama: string;
}

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Sirah Nabawiyah",
    search: "Cari kisah...",
    all: "Semua",
    read: "Baca",
    noData: "Tidak ditemukan",
    loading: "Memuat data...",
    error: "Gagal memuat data",
    retry: "Coba Lagi",
  },
  en: {
    title: "Islamic History",
    search: "Search stories...",
    all: "All",
    read: "Read",
    noData: "Not found",
    loading: "Loading data...",
    error: "Failed to load data",
    retry: "Retry",
  },
  ar: {
    title: "السيرة النبوية",
    search: "بحث...",
    all: "الكل",
    read: "اقرأ",
    noData: "غير موجود",
    loading: "جار التحميل...",
    error: "فشل تحميل البيانات",
    retry: "أعد المحاولة",
  },
  fr: {
    title: "Histoire Islamique",
    search: "Rechercher...",
    all: "Tout",
    read: "Lire",
    noData: "Introuvable",
    loading: "Chargement...",
    error: "Échec du chargement",
    retry: "Réessayer",
  },
  kr: {
    title: "이슬람 역사",
    search: "검색...",
    all: "전체",
    read: "읽기",
    noData: "찾을 수 없음",
    loading: "로딩 중...",
    error: "데이터 로드 실패",
    retry: "재시도",
  },
  jp: {
    title: "イスラムの歴史",
    search: "検索...",
    all: "すべて",
    read: "読む",
    noData: "見つかりません",
    loading: "読み込み中...",
    error: "読み込み失敗",
    retry: "再試行",
  },
};

const CATEGORY_NAMES: Record<LocaleCode, CategoryNames> = {
  id: {
    nabi: "Nabi",
    muhammad: "Muhammad SAW",
    istri: "Istri",
    sahabat: "Sahabat",
    ulama: "Ulama",
  },
  en: {
    nabi: "Prophets",
    muhammad: "Muhammad PBUH",
    istri: "Wives",
    sahabat: "Companions",
    ulama: "Scholars",
  },
  ar: {
    nabi: "الأنبياء",
    muhammad: "محمد ﷺ",
    istri: "الزوجات",
    sahabat: "الصحابة",
    ulama: "العلماء",
  },
  fr: {
    nabi: "Prophètes",
    muhammad: "Muhammad PBSL",
    istri: "Épouses",
    sahabat: "Compagnons",
    ulama: "Savants",
  },
  kr: {
    nabi: "선지자",
    muhammad: "무함마드",
    istri: "아내",
    sahabat: "동료",
    ulama: "학자",
  },
  jp: {
    nabi: "預言者",
    muhammad: "ムハンマド",
    istri: "妻",
    sahabat: "教友",
    ulama: "学者",
  },
};

export default function SirahPage() {
  const { locale } = useI18n();
  const safeLocale = (
    UI_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TEXT[safeLocale];
  const cats = CATEGORY_NAMES[safeLocale];

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetSirahQuery({ page: 1 });
  const sirahData = apiResponse?.data?.data || [];

  const [selectedStory, setSelectedStory] = useState<ProcessedSirahItem | null>(
    null,
  );
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getTranslation = (item: SirahItem, field: "title" | "content") => {
    const trans = item.translations?.find((tr) => tr.locale === safeLocale);
    if (trans && trans[field]) return trans[field];
    const enTrans = item.translations?.find((tr) => tr.locale === "en");
    if (enTrans && enTrans[field]) return enTrans[field];
    if (field === "title") return item.title;
    return item.content;
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
    return sirahData
      .filter((item) => {
        const itemTitle = getTranslation(item, "title").toLowerCase();
        const matchSearch = itemTitle.includes(searchQuery.toLowerCase());
        const matchCat =
          activeCategory === "all" ||
          item.category.toLowerCase().includes(activeCategory);
        return matchCat && matchSearch;
      })
      .map((item) => ({
        id: item.id,
        category: item.category,
        title: getTranslation(item, "title"),
        content: getTranslation(item, "content"),
        excerpt:
          stripHtml(getTranslation(item, "content")).substring(0, 100) + "...",
      }));
  }, [sirahData, safeLocale, activeCategory, searchQuery]);

  if (selectedStory) {
    return (
      <SirahDetail
        story={selectedStory}
        locale={safeLocale}
        onBack={() => setSelectedStory(null)}
        categoryLabel={selectedStory.category}
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
              className={`absolute ${safeLocale === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-awqaf-foreground-primary`}
            />
            <Input
              placeholder={t.search}
              className={`bg-transparent border-0 h-12 focus-visible:ring-0 ${safeLocale === "ar" ? "pr-10" : "pl-10"} placeholder:text-awqaf-foreground-primary/70 text-awqaf-primary font-comfortaa text-sm`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute ${safeLocale === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-accent-100 hover:bg-accent-200 flex items-center justify-center transition-colors`}
              >
                <X className="w-3 h-3 text-awqaf-primary" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { id: "all", label: t.all, icon: Library },
            { id: "nabi", label: cats.nabi, icon: Scroll },
            { id: "muhammad", label: cats.muhammad, icon: Star },
            { id: "istri", label: cats.istri, icon: Heart },
            { id: "sahabat", label: cats.sahabat, icon: Users },
            { id: "ulama", label: cats.ulama, icon: BookOpen },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-comfortaa whitespace-nowrap transition-all border
                  ${
                    isActive
                      ? "bg-awqaf-primary text-white border-awqaf-primary shadow-md"
                      : "bg-white/80 text-awqaf-foreground-primary border-awqaf-border-light hover:bg-white"
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Content List */}
        <div className="space-y-3">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-awqaf-primary animate-spin mb-2" />
              <p className="text-sm text-awqaf-foreground-primary font-comfortaa">
                {t.loading}
              </p>
            </div>
          )}

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

          {!isLoading && !isError && displayedData.length > 0
            ? displayedData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedStory(item)}
                  className="cursor-pointer group"
                >
                  <Card className="border-awqaf-border-light shadow-sm hover:shadow-md transition-all duration-300 bg-white/95 backdrop-blur-sm rounded-2xl hover:border-awqaf-primary/30">
                    <CardContent className="p-4 flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0 border border-accent-100 group-hover:bg-awqaf-primary group-hover:text-white transition-colors duration-300 text-awqaf-primary">
                        {item.category.toLowerCase().includes("nabi") && (
                          <Scroll className="w-6 h-6" />
                        )}
                        {item.category.toLowerCase().includes("muhammad") && (
                          <Star className="w-6 h-6" />
                        )}
                        {item.category.toLowerCase().includes("istri") && (
                          <Heart className="w-6 h-6" />
                        )}
                        {!item.category
                          .toLowerCase()
                          .match(/nabi|muhammad|istri/) && (
                          <BookOpen className="w-6 h-6" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <Badge
                            variant="outline"
                            className="border-awqaf-primary/20 text-awqaf-primary bg-awqaf-primary/5 capitalize text-[10px] h-5 px-2 font-normal font-comfortaa"
                          >
                            {item.category}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-awqaf-primary font-comfortaa text-sm mb-1 line-clamp-1 group-hover:text-awqaf-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[10px] text-awqaf-foreground-primary line-clamp-2 font-comfortaa leading-relaxed">
                          {item.excerpt}
                        </p>

                        <div className="mt-3 flex items-center justify-end text-[10px] font-bold text-awqaf-primary font-comfortaa group-hover:underline decoration-awqaf-primary/30">
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
                  <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-awqaf-border-light">
                    <Search className="w-8 h-8 text-awqaf-foreground-primary/50" />
                  </div>
                  <p className="text-sm text-awqaf-foreground-primary font-comfortaa">
                    {t.noData}
                  </p>
                </div>
              )}
        </div>
      </main>
    </div>
  );
}