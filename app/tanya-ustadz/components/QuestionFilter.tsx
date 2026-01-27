"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Clock, Calendar, User } from "lucide-react";
import { Ustadz } from "@/types/public/kajian";
import { useI18n } from "@/app/hooks/useI18n";

// --- 1. TRANSLATION DICTIONARY ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface TranslationKeys {
  searchPlaceholder: string;
  filterButton: string;
  clearFilter: string;
  selectUstadz: string;
  allUstadz: string;
  sortBy: string;
  newest: string;
  oldest: string;
  searchLabel: string; // For the badge
}

const UI_TRANSLATIONS: Record<LocaleCode, TranslationKeys> = {
  id: {
    searchPlaceholder: "Cari pertanyaan, penanya, atau ustadz...",
    filterButton: "Filter",
    clearFilter: "Hapus Filter",
    selectUstadz: "Pilih Ustadz",
    allUstadz: "Semua Ustadz",
    sortBy: "Urutkan Berdasarkan",
    newest: "Terbaru",
    oldest: "Terlama",
    searchLabel: "Pencarian",
  },
  en: {
    searchPlaceholder: "Search questions, askers, or ustadz...",
    filterButton: "Filter",
    clearFilter: "Clear Filter",
    selectUstadz: "Select Ustadz",
    allUstadz: "All Ustadz",
    sortBy: "Sort By",
    newest: "Newest",
    oldest: "Oldest",
    searchLabel: "Search",
  },
  ar: {
    searchPlaceholder: "ابحث عن الأسئلة، السائلين، أو الأستاذ...",
    filterButton: "تصفية",
    clearFilter: "مسح التصفية",
    selectUstadz: "اختر الأستاذ",
    allUstadz: "كل الأساتذة",
    sortBy: "ترتيب حسب",
    newest: "الأحدث",
    oldest: "الأقدم",
    searchLabel: "بحث",
  },
  fr: {
    searchPlaceholder: "Rechercher des questions...",
    filterButton: "Filtrer",
    clearFilter: "Effacer",
    selectUstadz: "Sélectionner un Oustaz",
    allUstadz: "Tous les Oustaz",
    sortBy: "Trier par",
    newest: "Plus récent",
    oldest: "Plus ancien",
    searchLabel: "Recherche",
  },
  kr: {
    searchPlaceholder: "질문, 질문자 또는 우스타즈 검색...",
    filterButton: "필터",
    clearFilter: "필터 지우기",
    selectUstadz: "우스타즈 선택",
    allUstadz: "모든 우스타즈",
    sortBy: "정렬 기준",
    newest: "최신순",
    oldest: "오래된순",
    searchLabel: "검색",
  },
  jp: {
    searchPlaceholder: "質問、質問者、またはウスタズを検索...",
    filterButton: "フィルター",
    clearFilter: "フィルターをクリア",
    selectUstadz: "ウスタズを選択",
    allUstadz: "すべてのウスタズ",
    sortBy: "並べ替え",
    newest: "新しい順",
    oldest: "古い順",
    searchLabel: "検索",
  },
};

export type SortOption = "newest" | "oldest" | "popular" | "most-liked";

interface QuestionFilterProps {
  searchQuery: string;
  selectedCategory: string; // This now represents selected Ustadz ID
  sortBy: SortOption;
  onSearchChange: (query: string) => void;
  onCategoryChange: (ustadzId: string) => void;
  onSortChange: (sort: SortOption) => void;
  onClearFilters: () => void;
  ustadzList: Ustadz[];
}

export default function QuestionFilter({
  searchQuery,
  selectedCategory,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onClearFilters,
  ustadzList,
}: QuestionFilterProps) {
  const { locale } = useI18n();

  // Safe locale access
  const currentLocale = (
    UI_TRANSLATIONS[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TRANSLATIONS[currentLocale];
  const isRtl = currentLocale === "ar";

  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: "newest", label: t.newest, icon: Clock },
    { value: "oldest", label: t.oldest, icon: Calendar },
  ] as const;

  const hasActiveFilters =
    searchQuery || selectedCategory || sortBy !== "newest";

  // Helper untuk mendapatkan nama ustadz dari ID
  const selectedUstadzName = ustadzList.find(
    (u) => u.id.toString() === selectedCategory,
  )?.name;

  return (
    <Card className="border-awqaf-border-light" dir={isRtl ? "rtl" : "ltr"}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-awqaf-foreground-secondary w-4 h-4`}
            />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`${isRtl ? "pr-10" : "pl-10"} font-comfortaa`}
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="font-comfortaa"
            >
              <Filter className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`} />
              {t.filterButton}
              {hasActiveFilters && (
                <Badge
                  className={`bg-awqaf-primary text-white text-xs ${isRtl ? "mr-2" : "ml-2"}`}
                >
                  {
                    [
                      searchQuery,
                      selectedCategory,
                      sortBy !== "newest" ? sortBy : "",
                    ].filter(Boolean).length
                  }
                </Badge>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-awqaf-foreground-secondary hover:text-awqaf-primary font-comfortaa"
              >
                <X className={`w-4 h-4 ${isRtl ? "ml-1" : "mr-1"}`} />
                {t.clearFilter}
              </Button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="space-y-4 pt-4 border-t border-awqaf-border-light">
              {/* Ustadz Filter */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-card-foreground font-comfortaa">
                  {t.selectUstadz}
                </h4>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto mobile-scroll pb-2">
                  <button
                    onClick={() => onCategoryChange("")}
                    className={`px-3 py-1 rounded-full text-xs font-comfortaa transition-colors ${
                      selectedCategory === ""
                        ? "bg-awqaf-primary text-white"
                        : "bg-awqaf-border-light text-awqaf-foreground-secondary hover:bg-awqaf-primary/10"
                    }`}
                  >
                    {t.allUstadz}
                  </button>
                  {ustadzList.map((ustadz) => (
                    <button
                      key={ustadz.id}
                      onClick={() => onCategoryChange(ustadz.id.toString())}
                      className={`px-3 py-1 rounded-full text-xs font-comfortaa transition-colors ${
                        selectedCategory === ustadz.id.toString()
                          ? "bg-awqaf-primary text-white"
                          : "bg-awqaf-border-light text-awqaf-foreground-secondary hover:bg-awqaf-primary/10"
                      }`}
                    >
                      {ustadz.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-card-foreground font-comfortaa">
                  {t.sortBy}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => onSortChange(option.value as SortOption)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 font-comfortaa flex items-center gap-2
                          ${isRtl ? "text-right" : "text-left"}
                          ${
                            sortBy === option.value
                              ? "border-awqaf-primary bg-awqaf-primary/10"
                              : "border-awqaf-border-light hover:border-awqaf-primary/50"
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-awqaf-border-light">
              {searchQuery && (
                <Badge className="bg-awqaf-primary/10 text-awqaf-primary border-awqaf-primary/20">
                  {t.searchLabel}: &quot;{searchQuery}&quot;
                </Badge>
              )}
              {selectedCategory && (
                <Badge className="bg-awqaf-primary/10 text-awqaf-primary border-awqaf-primary/20 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {selectedUstadzName}
                </Badge>
              )}
              {sortBy !== "newest" && (
                <Badge className="bg-awqaf-primary/10 text-awqaf-primary border-awqaf-primary/20">
                  {sortOptions.find((opt) => opt.value === sortBy)?.label}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}