"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Share2,
  LucideIcon,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessedGuideStep } from "./page";
import { LocaleCode } from "@/lib/i18n";

interface GuideDetailProps {
  step: ProcessedGuideStep;
  locale: LocaleCode;
  onBack: () => void;
  totalSteps: number;
  icon: LucideIcon;
}

export default function GuideDetail({
  step,
  locale,
  onBack,
  totalSteps,
  icon: Icon,
}: GuideDetailProps) {
  const isRtl = locale === "ar";
  const [copied, setCopied] = useState(false);

  const LABELS = {
    step: locale === "en" ? "Step" : locale === "ar" ? "خطوة" : "Langkah",
    finish:
      locale === "en"
        ? "Back to Guide"
        : locale === "ar"
          ? "العودة للدليل"
          : "Kembali ke Panduan",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- SHARE FUNCTIONALITY ---
  const handleShare = async () => {
    // Bersihkan HTML tag untuk text share yang rapi
    const cleanSummary = step.summary.replace(/<[^>]*>?/gm, "");
    const shareText = `${step.title} (${step.category.toUpperCase()})\n\n${cleanSummary}\n\nLink: ${window.location.href}`;

    const shareData = {
      title: step.title,
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
    <div className="min-h-screen bg-slate-50" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-20 shadow-xl overflow-hidden">
        {/* HERO HEADER */}
        <div className="relative bg-awqaf-primary h-64 rounded-b-[40px] overflow-hidden">
          {/* Background Map Pattern */}
          <div
            className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"
            style={{ backgroundSize: "20px 20px" }}
          ></div>

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className={`w-6 h-6 ${isRtl ? "rotate-180" : ""}`} />
            </Button>

            {/* Functional Share Button */}
            <Button
              onClick={handleShare}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-300" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Central Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 pb-8">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20 shadow-lg">
              <Icon className="w-8 h-8 text-white" />
            </div>

            <Badge className="mb-3 bg-awqaf-secondary text-yellow-900 border-0 px-3 py-1 font-bold">
              {step.category.toUpperCase()}
            </Badge>

            <h1 className="text-2xl font-bold text-center px-6 font-comfortaa leading-tight">
              {step.title}
            </h1>

            <div className="mt-2 text-sm text-white/80 font-medium">
              {LABELS.step} {step.stepNumber}{" "}
              <span className="opacity-60 text-[10px] mx-1">●</span>{" "}
              {totalSteps}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <main className="px-6 -mt-10 relative z-20">
          <Card className="border-none shadow-lg bg-white rounded-3xl">
            <CardContent className="p-6">
              {/* Short Description Quote */}
              <div className="flex gap-3 mb-6 p-4 bg-accent-50 rounded-xl border border-accent-100">
                <CheckCircle2 className="w-5 h-5 text-awqaf-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  {step.summary}
                </p>
              </div>

              {/* HTML Content (Instructions & Duas) */}
              <article
                className={`
                prose prose-sm max-w-none 
                prose-p:text-slate-600 prose-p:leading-7 prose-p:mb-4
                prose-strong:text-awqaf-primary
                prose-li:text-slate-600
                ${isRtl ? "text-right font-tajawal" : "text-justify font-comfortaa"}
              `}
              >
                <div dangerouslySetInnerHTML={{ __html: step.content }} />
              </article>
            </CardContent>
          </Card>
        </main>

        {/* FOOTER */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-slate-100 z-30">
          <Button
            onClick={onBack}
            className="w-full rounded-xl bg-awqaf-primary hover:bg-awqaf-secondary text-white shadow-lg h-12 font-bold font-comfortaa"
          >
            {LABELS.finish}
          </Button>
        </div>
      </div>
    </div>
  );
}