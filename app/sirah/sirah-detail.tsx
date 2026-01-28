"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Share2, BookOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessedSirahItem } from "./page";

interface SirahDetailProps {
  story: ProcessedSirahItem;
  onBack: () => void;
  locale: string;
  categoryLabel: string;
}

export default function SirahDetail({
  story,
  onBack,
  locale,
  categoryLabel,
}: SirahDetailProps) {
  const [copied, setCopied] = useState(false);
  const isRtl = locale === "ar";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: story.title,
      text: story.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${story.title}\n\n${story.excerpt}\n\nLink: ${window.location.href}`,
        );
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
                  Detail Sirah
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
        {/* Title Card */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-accent-100 text-awqaf-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <Badge
              variant="outline"
              className="border-awqaf-primary/20 text-awqaf-primary bg-awqaf-primary/5 mb-3 font-normal px-3 font-comfortaa"
            >
              {categoryLabel}
            </Badge>
            <h2 className="text-xl font-bold text-awqaf-primary font-comfortaa leading-snug">
              {story.title}
            </h2>
          </CardContent>
        </Card>

        {/* Story Body */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6">
            <article
              className={`prose prose-sm max-w-none text-awqaf-foreground-primary font-comfortaa leading-loose ${isRtl ? "text-right font-tajawal text-lg" : "text-justify"}`}
            >
              <div dangerouslySetInnerHTML={{ __html: story.content }} />
            </article>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}