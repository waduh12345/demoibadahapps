"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Share2,
  MessageCircleQuestion,
  BookOpen,
  UserCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessedFatwaItem } from "./page";
import { LocaleCode } from "@/lib/i18n";

interface FatwaDetailProps {
  item: ProcessedFatwaItem;
  locale: LocaleCode;
  onBack: () => void;
  catLabel: string;
}

export default function FatwaDetail({
  item,
  locale,
  onBack,
  catLabel,
}: FatwaDetailProps) {
  const isRtl = locale === "ar";
  const [copied, setCopied] = useState(false);

  const LABELS = {
    title:
      locale === "en"
        ? "Fatwa Detail"
        : locale === "ar"
          ? "تفاصيل الفتوى"
          : "Detail Fatwa",
    question:
      locale === "en" ? "Question" : locale === "ar" ? "السؤال" : "Pertanyaan",
    answer: locale === "en" ? "Answer" : locale === "ar" ? "الجواب" : "Jawaban",
    fatwaBy:
      locale === "en"
        ? "Fatwa by"
        : locale === "ar"
          ? "الفتوى من"
          : "Fatwa oleh",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = async () => {
    const cleanAnswer = item.answer.replace(/<[^>]*>?/gm, "");
    const shareText = `${item.question}\n\n${cleanAnswer.substring(0, 100)}...\n\nBaca selengkapnya: ${window.location.href}`;

    const shareData = {
      title: "Fatwa: " + item.question,
      text: shareText,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* HEADER: Floating Glass */}
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
                  {LABELS.title}
                </h1>
              </div>
              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-md mx-auto px-4 py-2 space-y-4">
        {/* 1. Question Card */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircleQuestion className="w-5 h-5 text-awqaf-primary" />
                <span className="font-bold text-awqaf-primary font-comfortaa uppercase text-xs tracking-wider">
                  {LABELS.question}
                </span>
              </div>
              <Badge
                variant="outline"
                className="border-awqaf-primary/20 text-awqaf-primary bg-awqaf-primary/5 capitalize font-comfortaa"
              >
                {catLabel}
              </Badge>
            </div>

            <h2
              className={`font-bold text-awqaf-primary text-lg leading-relaxed ${isRtl ? "font-tajawal" : "font-comfortaa"}`}
            >
              {item.question}
            </h2>
          </CardContent>
        </Card>

        {/* 2. Answer Card */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-awqaf-primary" />
              <span className="font-bold text-awqaf-primary font-comfortaa uppercase text-xs tracking-wider">
                {LABELS.answer}
              </span>
            </div>

            <article
              className={`
                prose prose-sm max-w-none 
                text-awqaf-foreground-secondary 
                prose-p:leading-loose prose-p:font-comfortaa
                prose-strong:text-awqaf-primary
                ${isRtl ? "text-right font-tajawal text-lg" : "text-justify"}
              `}
            >
              <div dangerouslySetInnerHTML={{ __html: item.answer }} />
            </article>
          </CardContent>
        </Card>

        {/* 3. Sheikh Info */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center text-awqaf-primary flex-shrink-0 border border-accent-100">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-awqaf-foreground-secondary uppercase font-bold tracking-wider font-comfortaa">
                {LABELS.fatwaBy}
              </p>
              <p className="text-sm font-bold text-awqaf-primary font-comfortaa">
                {item.sheikh}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}