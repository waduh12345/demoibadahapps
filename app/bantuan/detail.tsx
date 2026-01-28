"use client";

import { useEffect } from "react";
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HelpItem, LocaleCode } from "./page";

interface HelpDetailProps {
  item: HelpItem;
  locale: LocaleCode;
  onBack: () => void;
}

// Translation untuk teks statis di halaman detail
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
    <div className="min-h-screen bg-white" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-20">
        {/* Navbar */}
        <div className="sticky top-0 bg-white border-b border-slate-100 z-20 px-4 py-4 flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="hover:bg-slate-50 rounded-full text-slate-800"
          >
            <ArrowLeft className={`w-6 h-6 ${isRtl ? "rotate-180" : ""}`} />
          </Button>
          <span className="font-bold text-lg text-slate-800 font-comfortaa">
            {t.title}
          </span>
        </div>

        {/* Content */}
        <main className="p-6">
          <h1 className="text-xl font-bold text-awqaf-primary mb-6 font-comfortaa leading-relaxed">
            {item.question}
          </h1>

          <article
            className={`
            prose prose-slate max-w-none text-slate-600
            prose-p:leading-loose prose-strong:text-slate-800
            ${isRtl ? "text-right font-tajawal" : "text-justify"}
          `}
          >
            <div dangerouslySetInnerHTML={{ __html: item.answer }} />
          </article>

          {/* Feedback */}
          <div className="mt-10 pt-6 border-t border-slate-100">
            <p className="text-center text-sm text-slate-400 mb-4">
              {t.helpful}
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="rounded-full gap-2 border-slate-200 text-slate-600 hover:text-awqaf-primary hover:border-awqaf-primary hover:bg-white"
              >
                <ThumbsUp className="w-4 h-4" /> {t.yes}
              </Button>
              <Button
                variant="outline"
                className="rounded-full gap-2 border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-500 hover:bg-white"
              >
                <ThumbsDown className="w-4 h-4" /> {t.no}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}