"use client";

import { useEffect } from "react";
import { ArrowLeft, MapPin, CheckSquare, Info, LucideIcon } from "lucide-react";
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
    activities:
      locale === "en"
        ? "Activities & Deeds"
        : locale === "ar"
          ? "الأعمال والمناسك"
          : "Amalan & Kegiatan",
    location:
      locale === "en" ? "Location" : locale === "ar" ? "الموقع" : "Lokasi",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-20 shadow-xl overflow-hidden">
        {/* HERO HEADER */}
        <div className="relative bg-awqaf-primary h-72 rounded-b-[40px] overflow-hidden shadow-md">
          {/* Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

          {/* Top Nav */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className={`w-6 h-6 ${isRtl ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-6 pb-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 border border-white/20 shadow-lg">
              <Icon className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-center font-comfortaa leading-tight mb-2 drop-shadow-sm">
              {data.phase}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className="border-white/30 text-white bg-white/10 hover:bg-white/20 font-normal px-3 py-1"
              >
                {data.day}
              </Badge>
              <Badge className="bg-awqaf-secondary text-awqaf-primary hover:bg-awqaf-secondary border-0 px-3 py-1 font-bold">
                {data.location}
              </Badge>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <main className="px-6 -mt-12 relative z-20 space-y-6">
          {/* 1. Description Card */}
          <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-awqaf-secondary flex-shrink-0 mt-1" />
                <p className="text-slate-700 font-medium leading-loose font-comfortaa text-sm text-justify">
                  {data.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Activities List */}
          <div>
            <h3 className="font-bold text-awqaf-primary text-lg mb-4 flex items-center gap-2 px-1">
              <CheckSquare className="w-5 h-5" />
              {LABELS.activities}
            </h3>

            <div className="space-y-3">
              {data.activities.length > 0 ? (
                data.activities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center gap-4 hover:border-awqaf-secondary/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent-50 text-awqaf-primary font-bold text-sm flex items-center justify-center flex-shrink-0 border border-accent-100">
                      {idx + 1}
                    </div>
                    <span className="text-slate-800 font-medium font-comfortaa text-sm">
                      {activity}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Tidak ada data aktivitas.
                </div>
              )}
            </div>
          </div>

          {/* 3. Location Detail */}
          <div className="bg-gradient-to-r from-accent-50 to-white rounded-xl p-5 border border-accent-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-awqaf-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-0.5">
                {LABELS.location}
              </p>
              <p className="text-slate-800 font-bold text-base">
                {data.location}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}