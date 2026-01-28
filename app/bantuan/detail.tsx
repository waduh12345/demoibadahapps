"use client";

import { useEffect } from "react";
import { ArrowLeft, ThumbsUp, ThumbsDown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpItem, LocaleCode } from "./page";

interface HelpDetailProps {
  item: HelpItem;
  locale: LocaleCode;
  onBack: () => void;
}

const DETAIL_TEXT: Record<
  LocaleCode,
  { title: string; helpful: string; yes: string; no: string }
> = {
  id: {
    title: "Detail Bantuan",
    helpful: "Apakah ini membantu?",
    yes: "Ya",
    no: "Tidak",
  },
  en: {
    title: "Help Detail",
    helpful: "Was this helpful?",
    yes: "Yes",
    no: "No",
  },
  ar: {
    title: "تفاصيل المساعدة",
    helpful: "هل كان هذا مفيدًا؟",
    yes: "نعم",
    no: "لا",
  },
  fr: {
    title: "Détails de l'aide",
    helpful: "Cela vous a-t-il aidé ?",
    yes: "Oui",
    no: "Non",
  },
  kr: {
    title: "도움말 상세",
    helpful: "도움이 되었나요?",
    yes: "네",
    no: "아니요",
  },
  jp: {
    title: "ヘルプ詳細",
    helpful: "役に立ちましたか？",
    yes: "はい",
    no: "いいえ",
  },
};

export default function HelpDetail({ item, locale, onBack }: HelpDetailProps) {
  const isRtl = locale === "ar";
  const t = DETAIL_TEXT[locale] || DETAIL_TEXT.id;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* HEADER: KIBLAT STYLE */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
              >
                <ArrowLeft className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
              </Button>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t.title}
                </h1>
              </div>
              <div className="w-10 h-10" /> {/* Spacer */}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-2">
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-awqaf-primary flex-shrink-0 mt-1">
                <BookOpen className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-awqaf-primary font-comfortaa leading-snug">
                {item.question}
              </h1>
            </div>

            <div className="w-full h-px bg-awqaf-border-light/50 mb-6" />

            <article
              className={`
                prose prose-slate max-w-none 
                text-awqaf-foreground-secondary font-comfortaa text-sm leading-relaxed
                prose-strong:text-awqaf-primary prose-strong:font-bold
                prose-a:text-awqaf-primary prose-a:no-underline hover:prose-a:underline
                ${isRtl ? "text-right" : "text-justify"}
              `}
            >
              <div dangerouslySetInnerHTML={{ __html: item.answer }} />
            </article>
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-awqaf-foreground-secondary/80 font-comfortaa mb-4">
            {t.helpful}
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              className="rounded-full gap-2 border-awqaf-border-light text-awqaf-foreground-secondary hover:text-awqaf-primary hover:border-awqaf-primary hover:bg-accent-50 transition-all font-comfortaa"
            >
              <ThumbsUp className="w-4 h-4" /> {t.yes}
            </Button>
            <Button
              variant="outline"
              className="rounded-full gap-2 border-awqaf-border-light text-awqaf-foreground-secondary hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all font-comfortaa"
            >
              <ThumbsDown className="w-4 h-4" /> {t.no}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}