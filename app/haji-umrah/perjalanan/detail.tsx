"use client";

import { useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  CheckSquare,
  BookOpen,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DailyActivity } from "./page";
import { LocaleCode } from "@/lib/i18n";

interface JourneyDetailProps {
  data: DailyActivity;
  locale: LocaleCode;
  onBack: () => void;
  icon: LucideIcon;
}

export default function JourneyDetail({
  data,
  locale,
  onBack,
  icon: Icon,
}: JourneyDetailProps) {
  const isRtl = locale === "ar";

  const LABELS = {
    title:
      locale === "en"
        ? "Activity Detail"
        : locale === "ar"
          ? "تفاصيل النشاط"
          : "Detail Aktivitas",
    activities:
      locale === "en"
        ? "Activities & Deeds"
        : locale === "ar"
          ? "الأعمال والمناسك"
          : "Amalan & Kegiatan",
    location:
      locale === "en" ? "Location" : locale === "ar" ? "الموقع" : "Lokasi",
    description:
      locale === "en" ? "Description" : locale === "ar" ? "الوصف" : "Deskripsi",
    finish:
      locale === "en"
        ? "Back to Timeline"
        : locale === "ar"
          ? "العودة للجدول"
          : "Kembali ke Timeline",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <div className="w-10 h-10" />
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-md mx-auto px-4 py-2 space-y-4">
        {/* 1. Header Info Card */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-100">
              <Icon className="w-8 h-8 text-awqaf-primary" />
            </div>
            <h2 className="text-2xl font-bold text-awqaf-primary font-comfortaa mb-2 leading-tight">
              {data.phase}
            </h2>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <Badge
                variant="outline"
                className="border-awqaf-primary/20 text-awqaf-primary bg-awqaf-primary/5 font-normal px-3 py-1 font-comfortaa"
              >
                {data.day}
              </Badge>
              <Badge className="bg-awqaf-primary text-white hover:bg-awqaf-primary/80 border-0 px-3 py-1 font-bold font-comfortaa flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {data.location}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 2. Description Card */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-awqaf-primary" />
              <span className="font-bold text-awqaf-primary font-comfortaa">
                {LABELS.description}
              </span>
            </div>
            <p className="text-awqaf-foreground-secondary leading-relaxed font-comfortaa text-sm text-justify">
              {data.description}
            </p>
          </CardContent>
        </Card>

        {/* 3. Activities List */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="w-5 h-5 text-awqaf-primary" />
              <span className="font-bold text-awqaf-primary font-comfortaa">
                {LABELS.activities}
              </span>
            </div>

            <div className="space-y-3">
              {data.activities.length > 0 ? (
                data.activities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="bg-accent-50/50 border border-awqaf-border-light/50 rounded-xl p-3 flex items-start gap-3 hover:border-awqaf-primary/30 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-white text-awqaf-primary font-bold text-xs flex items-center justify-center flex-shrink-0 border border-awqaf-border-light shadow-sm mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-awqaf-foreground-secondary font-medium font-comfortaa text-sm leading-snug">
                      {activity}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-awqaf-foreground-secondary/50 italic bg-accent-50/30 rounded-xl border border-dashed border-awqaf-border-light font-comfortaa text-sm">
                  No activities listed.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Floating Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-white via-white/90 to-transparent">
        <div className="max-w-md mx-auto">
          <Button
            onClick={onBack}
            className="w-full rounded-xl bg-awqaf-primary hover:bg-awqaf-primary/90 text-white shadow-lg h-12 font-bold font-comfortaa transition-transform active:scale-[0.98]"
          >
            {LABELS.finish}
          </Button>
        </div>
      </div>
    </div>
  );
}