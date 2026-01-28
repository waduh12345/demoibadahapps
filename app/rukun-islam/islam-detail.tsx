"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Share2,
  Quote,
  LucideIcon,
  Check,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LocaleCode } from "@/lib/i18n";

export interface ProcessedIslamItem {
  id: number;
  order: number;
  title: string;
  content: string;
  shortDesc: string;
}

interface IslamDetailProps {
  item: ProcessedIslamItem;
  locale: LocaleCode;
  onBack: () => void;
  icon: LucideIcon;
}

export default function IslamDetail({
  item,
  locale,
  onBack,
  icon: Icon,
}: IslamDetailProps) {
  const isRtl = locale === "ar";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: item.title,
      text: item.shortDesc,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${item.title}\n\n${item.shortDesc}\n\nBaca selengkapnya: ${window.location.href}`,
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
                  Detail Rukun Islam
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
            <div className="w-16 h-16 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-100 text-awqaf-primary shadow-sm">
              <Icon className="w-8 h-8" />
            </div>
            <Badge
              variant="outline"
              className="border-awqaf-primary/20 text-awqaf-primary bg-awqaf-primary/5 mb-3 font-normal px-3 font-comfortaa"
            >
              Rukun Islam #{item.order}
            </Badge>
            <h2 className="text-2xl font-bold text-awqaf-primary font-comfortaa leading-snug">
              {item.title}
            </h2>
          </CardContent>
        </Card>

        {/* Short Desc / Quote */}
        <Card className="border-awqaf-border-light bg-accent-50/50 rounded-2xl border-l-4 border-l-awqaf-primary">
          <CardContent className="p-5 flex gap-3">
            <Quote className="w-5 h-5 text-awqaf-primary flex-shrink-0 rotate-180" />
            <p className="text-sm text-awqaf-foreground-primary font-medium italic font-comfortaa leading-relaxed">
              {item.shortDesc}
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-awqaf-primary font-bold font-comfortaa border-b border-awqaf-border-light pb-2">
              <BookOpen className="w-5 h-5" />
              <span>Penjelasan Lengkap</span>
            </div>
            <article
              className={`
                  prose prose-sm max-w-none 
                  text-awqaf-foreground-primary font-comfortaa leading-loose
                  prose-headings:text-awqaf-primary prose-headings:font-bold
                  prose-p:mb-4
                  ${isRtl ? "text-right font-tajawal text-lg" : "text-justify"}
               `}
            >
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
            </article>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}