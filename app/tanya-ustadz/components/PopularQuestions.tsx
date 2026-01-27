"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, MessageCircle, ArrowRight } from "lucide-react";
import { QnAUstadz } from "@/types/public/kajian";
import { useI18n } from "@/app/hooks/useI18n";

// --- 1. DEFINISI TIPE & TRANSLATION ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface TranslationKeys {
  popularTitle: string;
  latestTitle: string;
  emptyState: string;
  viewAll: string;
  subtitle: string;
}

const UI_TRANSLATIONS: Record<LocaleCode, TranslationKeys> = {
  id: {
    popularTitle: "Pertanyaan Populer",
    latestTitle: "Pertanyaan Terbaru",
    emptyState: "Belum ada pertanyaan populer saat ini.",
    viewAll: "Lihat Semua",
    subtitle: "Pertanyaan yang baru saja dijawab oleh Ustadz",
  },
  en: {
    popularTitle: "Popular Questions",
    latestTitle: "Latest Questions",
    emptyState: "No popular questions yet.",
    viewAll: "View All",
    subtitle: "Questions recently answered by Ustadz",
  },
  ar: {
    popularTitle: "الأسئلة الشائعة",
    latestTitle: "أحدث الأسئلة",
    emptyState: "لا توجد أسئلة شائعة حتى الآن.",
    viewAll: "عرض الكل",
    subtitle: "أسئلة أجاب عليها الأستاذ مؤخرًا",
  },
  fr: {
    popularTitle: "Questions Populaires",
    latestTitle: "Dernières Questions",
    emptyState: "Pas encore de questions populaires.",
    viewAll: "Voir Tout",
    subtitle: "Questions récemment répondues par l'Oustaz",
  },
  kr: {
    popularTitle: "인기 질문",
    latestTitle: "최신 질문",
    emptyState: "아직 인기 질문이 없습니다.",
    viewAll: "모두 보기",
    subtitle: "우스타즈가 최근 답변한 질문",
  },
  jp: {
    popularTitle: "人気の質問",
    latestTitle: "最新の質問",
    emptyState: "まだ人気の質問はありません。",
    viewAll: "すべて見る",
    subtitle: "ウスタズが最近回答した質問",
  },
};

interface PopularQuestionsProps {
  questions: QnAUstadz[];
  onQuestionClick?: (question: QnAUstadz) => void;
  onViewAllClick?: () => void;
}

export default function PopularQuestions({
  questions,
  onQuestionClick,
  onViewAllClick,
}: PopularQuestionsProps) {
  const { locale } = useI18n();

  // Fallback ke 'id' jika locale tidak dikenali
  const currentLocale = (
    UI_TRANSLATIONS[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TRANSLATIONS[currentLocale];
  const isRtl = currentLocale === "ar";

  // --- RENDER: EMPTY STATE ---
  if (questions.length === 0) {
    return (
      <Card className="border-awqaf-border-light" dir={isRtl ? "rtl" : "ltr"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-awqaf-primary font-comfortaa">
            <TrendingUp className="w-5 h-5" />
            {t.popularTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <MessageCircle className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
          <p className="text-awqaf-foreground-secondary font-comfortaa">
            {t.emptyState}
          </p>
        </CardContent>
      </Card>
    );
  }

  // --- RENDER: LIST ---
  return (
    <Card className="border-awqaf-border-light" dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-awqaf-primary font-comfortaa">
            <TrendingUp className="w-5 h-5" />
            {t.latestTitle}
          </CardTitle>
          {onViewAllClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAllClick}
              className="text-awqaf-primary hover:text-awqaf-primary/80 font-comfortaa"
            >
              {t.viewAll}
              <ArrowRight
                className={`w-4 h-4 ${isRtl ? "mr-1 rotate-180" : "ml-1"}`}
              />
            </Button>
          )}
        </div>
        <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
          {t.subtitle}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="p-4 rounded-lg border border-awqaf-border-light hover:bg-awqaf-primary/5 transition-colors duration-200 cursor-pointer"
              onClick={() => onQuestionClick?.(question)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-awqaf-primary text-white text-xs font-bold flex items-center justify-center font-comfortaa">
                      {index + 1}
                    </div>
                    <span className="text-xs text-awqaf-primary font-bold">
                      {question.ustadz.name}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa leading-relaxed line-clamp-2">
                  {question.question}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}