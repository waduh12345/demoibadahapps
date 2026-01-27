"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  User,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { QnAUstadz } from "@/types/public/kajian";
import { useI18n } from "@/app/hooks/useI18n";

// --- 1. DEFINISI TIPE & TRANSLATION ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface TranslationKeys {
  emptyTitle: string;
  emptyDesc: string;
  answered: string;
  asks: string; // "Bertanya:"
  showLess: string;
  showMore: string;
  ustadzAnswer: string;
}

const UI_TRANSLATIONS: Record<LocaleCode, TranslationKeys> = {
  id: {
    emptyTitle: "Tidak Ada Pertanyaan",
    emptyDesc: "Belum ada pertanyaan yang sesuai dengan filter Anda.",
    answered: "Terjawab",
    asks: "Bertanya:",
    showLess: "Tampilkan Lebih Sedikit",
    showMore: "Tampilkan Lebih Banyak",
    ustadzAnswer: "Jawaban Ustadz",
  },
  en: {
    emptyTitle: "No Questions Found",
    emptyDesc: "No questions match your current filters.",
    answered: "Answered",
    asks: "Asks:",
    showLess: "Show Less",
    showMore: "Show More",
    ustadzAnswer: "Ustadz's Answer",
  },
  ar: {
    emptyTitle: "لا توجد أسئلة",
    emptyDesc: "لا توجد أسئلة تطابق الفلتر الحالي.",
    answered: "مُجاب",
    asks: "يسأل:",
    showLess: "عرض أقل",
    showMore: "عرض المزيد",
    ustadzAnswer: "إجابة الأستاذ",
  },
  fr: {
    emptyTitle: "Aucune question trouvée",
    emptyDesc: "Aucune question ne correspond à vos filtres.",
    answered: "Répondu",
    asks: "Demande :",
    showLess: "Montrer moins",
    showMore: "Montrer plus",
    ustadzAnswer: "Réponse de l'Oustaz",
  },
  kr: {
    emptyTitle: "질문 없음",
    emptyDesc: "필터와 일치하는 질문이 없습니다.",
    answered: "답변 완료",
    asks: "질문:",
    showLess: "간략히 보기",
    showMore: "더 보기",
    ustadzAnswer: "우스타즈 답변",
  },
  jp: {
    emptyTitle: "質問が見つかりません",
    emptyDesc: "現在のフィルターに一致する質問はありません。",
    answered: "回答済み",
    asks: "質問:",
    showLess: "表示を減らす",
    showMore: "もっと見る",
    ustadzAnswer: "ウスタズの回答",
  },
};

interface QuestionListProps {
  questions: QnAUstadz[];
  onQuestionClick?: (question: QnAUstadz) => void;
}

export default function QuestionList({
  questions,
  onQuestionClick,
}: QuestionListProps) {
  const { locale } = useI18n();

  // Safe locale access
  const currentLocale = (
    UI_TRANSLATIONS[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TRANSLATIONS[currentLocale];
  const isRtl = currentLocale === "ar";

  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set(),
  );

  const toggleExpanded = (questionId: number) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Helper Format Tanggal Dinamis
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      id: "id-ID",
      en: "en-US",
      ar: "ar-SA",
      fr: "fr-FR",
      kr: "ko-KR",
      jp: "ja-JP",
    };
    return date.toLocaleDateString(localeMap[currentLocale] || "id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // --- RENDER: EMPTY STATE ---
  if (questions.length === 0) {
    return (
      <Card className="border-awqaf-border-light" dir={isRtl ? "rtl" : "ltr"}>
        <CardContent className="p-8 text-center">
          <MessageCircle className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground font-comfortaa mb-2">
            {t.emptyTitle}
          </h3>
          <p className="text-awqaf-foreground-secondary font-comfortaa">
            {t.emptyDesc}
          </p>
        </CardContent>
      </Card>
    );
  }

  // --- RENDER: QUESTION LIST ---
  return (
    <div className="space-y-4" dir={isRtl ? "rtl" : "ltr"}>
      {questions.map((question) => {
        const isExpanded = expandedQuestions.has(question.id);
        const isLongQuestion = question.question.length > 200;
        const isAnswered = question.answer !== null && question.answer !== "";

        return (
          <Card
            key={question.id}
            className="border-awqaf-border-light hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => onQuestionClick?.(question)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header: Ustadz Badge & Status */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-awqaf-primary/10 text-awqaf-primary border-awqaf-primary/20 font-comfortaa">
                        <User
                          className={`w-3 h-3 ${isRtl ? "ml-1" : "mr-1"}`}
                        />
                        {question.ustadz.name}
                      </Badge>
                      {isAnswered && (
                        <Badge className="bg-green-100 text-green-700 border-green-200 font-comfortaa">
                          <CheckCircle
                            className={`w-3 h-3 ${isRtl ? "ml-1" : "mr-1"}`}
                          />
                          {t.answered}
                        </Badge>
                      )}
                    </div>
                    {/* Asker Name */}
                    <h3 className="text-lg font-semibold text-card-foreground font-comfortaa mb-2 capitalize">
                      {question.name} {t.asks}
                    </h3>
                  </div>
                </div>

                {/* Question Text */}
                <div className="space-y-3">
                  <p className="text-awqaf-foreground-secondary font-comfortaa leading-relaxed text-justify">
                    {isExpanded || !isLongQuestion
                      ? question.question
                      : `${question.question.substring(0, 200)}...`}
                  </p>

                  {isLongQuestion && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(question.id);
                      }}
                      className="text-awqaf-primary hover:text-awqaf-primary/80 font-comfortaa p-0 h-auto"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp
                            className={`w-4 h-4 ${isRtl ? "ml-1" : "mr-1"}`}
                          />
                          {t.showLess}
                        </>
                      ) : (
                        <>
                          <ChevronDown
                            className={`w-4 h-4 ${isRtl ? "ml-1" : "mr-1"}`}
                          />
                          {t.showMore}
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Answer Box (If answered) */}
                {isAnswered && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800 font-comfortaa">
                        {t.ustadzAnswer}
                      </span>
                    </div>

                    <div
                      className="text-sm text-green-700 font-comfortaa leading-relaxed line-clamp-3 text-justify"
                      dangerouslySetInnerHTML={{
                        __html: question.answer || "",
                      }}
                    />
                  </div>
                )}

                {/* Footer Meta Data */}
                <div className="flex items-center justify-between pt-4 border-t border-awqaf-border-light text-xs text-awqaf-foreground-secondary font-comfortaa">
                  <div className="flex items-center gap-4">
                    {/* Optional: Add Like/View count here */}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(question.created_at)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}