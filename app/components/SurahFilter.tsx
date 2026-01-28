"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, X } from "lucide-react";
import { useI18n } from "@/app/hooks/useI18n";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface FilterTranslations {
  title?: string;
  filterBtn: string;
  active: string;
  juzTitle: string;
  all: string;
  revelationTitle: string;
  meccan: string;
  medinan: string;
  clear: string;
}

// --- TRANSLATION DICTIONARY ---
const FILTER_TEXT: Record<LocaleCode, FilterTranslations> = {
  id: {
    filterBtn: "Filter Surah",
    active: "Aktif",
    juzTitle: "Juz",
    all: "Semua",
    revelationTitle: "Tempat Turun",
    meccan: "Makkiyah",
    medinan: "Madaniyah",
    clear: "Hapus Filter",
  },
  en: {
    filterBtn: "Filter Surah",
    active: "Active",
    juzTitle: "Juz",
    all: "All",
    revelationTitle: "Revelation Type",
    meccan: "Meccan",
    medinan: "Medinan",
    clear: "Clear Filters",
  },
  ar: {
    filterBtn: "تصفية السور",
    active: "نشط",
    juzTitle: "الجزء",
    all: "الكل",
    revelationTitle: "مكان النزول",
    meccan: "مكية",
    medinan: "مدنية",
    clear: "مسح التصفية",
  },
  fr: {
    filterBtn: "Filtrer Sourates",
    active: "Actif",
    juzTitle: "Juz",
    all: "Tout",
    revelationTitle: "Lieu de Révélation",
    meccan: "Mecquoise",
    medinan: "Médinoise",
    clear: "Effacer",
  },
  kr: {
    title: "수라 필터", // Just title placeholder logic for consistency
    filterBtn: "수라 필터",
    active: "활성",
    juzTitle: "주즈",
    all: "모두",
    revelationTitle: "계시 장소",
    meccan: "메카",
    medinan: "메디나",
    clear: "필터 지우기",
  },
  jp: {
    title: "スーラフィルター", // Placeholder
    filterBtn: "スーラフィルター",
    active: "アクティブ",
    juzTitle: "ジュズ",
    all: "すべて",
    revelationTitle: "啓示場所",
    meccan: "マッカ啓示",
    medinan: "マディーナ啓示",
    clear: "フィルターをクリア",
  },
};

interface SurahFilterProps {
  selectedJuz: number | null;
  onJuzChange: (juz: number | null) => void;
  selectedRevelation: "all" | "Meccan" | "Medinan";
  onRevelationChange: (revelation: "all" | "Meccan" | "Medinan") => void;
}

export default function SurahFilter({
  selectedJuz,
  onJuzChange,
  selectedRevelation,
  onRevelationChange,
}: SurahFilterProps) {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  // Safe Locale Access
  const safeLocale = (
    FILTER_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = FILTER_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const juzOptions = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="relative" dir={isRtl ? "rtl" : "ltr"}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between border-awqaf-border-light hover:bg-accent-50 font-comfortaa"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span>{t.filterBtn}</span>
        </div>
        {isOpen ? (
          <X className="w-4 h-4" />
        ) : (
          (selectedJuz || selectedRevelation !== "all") && (
            <span className="text-xs bg-accent-100 text-awqaf-primary px-2 py-1 rounded-full">
              {t.active}
            </span>
          )
        )}
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-20 border-awqaf-border-light shadow-lg">
          <CardContent className="p-4 space-y-4">
            {/* Juz Filter */}
            <div>
              <h4 className="font-semibold text-card-foreground font-comfortaa mb-2">
                {t.juzTitle}
              </h4>
              <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto scrollbar-hide">
                <Button
                  variant={selectedJuz === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => onJuzChange(null)}
                  className="text-xs font-comfortaa col-span-5" // Full width for "All" button inside grid looks better sometimes or keep same size
                >
                  {t.all}
                </Button>
                {juzOptions.map((juz) => (
                  <Button
                    key={juz}
                    variant={selectedJuz === juz ? "default" : "outline"}
                    size="sm"
                    onClick={() => onJuzChange(juz)}
                    className="text-xs font-comfortaa"
                  >
                    {juz}
                  </Button>
                ))}
              </div>
            </div>

            {/* Revelation Filter */}
            <div>
              <h4 className="font-semibold text-card-foreground font-comfortaa mb-2">
                {t.revelationTitle}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={selectedRevelation === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onRevelationChange("all")}
                  className="text-xs font-comfortaa"
                >
                  {t.all}
                </Button>
                <Button
                  variant={
                    selectedRevelation === "Meccan" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => onRevelationChange("Meccan")}
                  className="text-xs font-comfortaa"
                >
                  {t.meccan}
                </Button>
                <Button
                  variant={
                    selectedRevelation === "Medinan" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => onRevelationChange("Medinan")}
                  className="text-xs font-comfortaa"
                >
                  {t.medinan}
                </Button>
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedJuz !== null || selectedRevelation !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onJuzChange(null);
                  onRevelationChange("all");
                }}
                className="w-full text-awqaf-foreground-secondary hover:text-awqaf-primary font-comfortaa"
              >
                {t.clear}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}