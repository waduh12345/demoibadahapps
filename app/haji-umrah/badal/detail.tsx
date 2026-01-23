"use client";

import { useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Video,
  FileCheck,
  Gift,
  UserCheck,
  Shield,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadalPackage, LocaleCode } from "./page";

interface BadalDetailProps {
  pkg: BadalPackage;
  locale: LocaleCode;
  onBack: () => void;
}

export default function BadalDetail({ pkg, locale, onBack }: BadalDetailProps) {
  const isRtl = locale === "ar";

  const LABELS = {
    includes:
      locale === "en"
        ? "What's Included"
        : locale === "ar"
          ? "المميزات"
          : "Yang Didapatkan",
    desc:
      locale === "en" ? "Description" : locale === "ar" ? "الوصف" : "Deskripsi",
    executor:
      locale === "en"
        ? "Performed By"
        : locale === "ar"
          ? "المنفذ"
          : "Pelaksana",
    book:
      locale === "en"
        ? "Book Now"
        : locale === "ar"
          ? "احجز الآن"
          : "Pesan Sekarang",
    contact:
      locale === "en"
        ? "Consultation"
        : locale === "ar"
          ? "استشارة"
          : "Konsultasi",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-24 shadow-xl overflow-hidden">
        {/* HERO HEADER */}
        <div className="bg-awqaf-primary pt-4 pb-12 rounded-b-[40px] relative overflow-hidden">
          {/* Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

          <div className="px-4 relative z-10">
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={onBack}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full"
              >
                <ArrowLeft className={`w-6 h-6 ${isRtl ? "rotate-180" : ""}`} />
              </Button>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                {pkg.type.toUpperCase()}
              </div>
            </div>

            <div className="text-center px-4">
              <h1 className="text-2xl font-bold text-white font-comfortaa mb-2 drop-shadow-md">
                {pkg.title}
              </h1>
              <p className="text-awqaf-secondary font-bold text-3xl font-comfortaa">
                {pkg.priceDisplay}
              </p>
              <p className="text-white/80 text-xs mt-2 max-w-[80%] mx-auto leading-relaxed">
                {pkg.shortDesc}
              </p>
            </div>
          </div>
        </div>

        {/* EXECUTOR CARD (Trust Factor) */}
        <div className="px-6 -mt-8 relative z-20">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-50 rounded-full flex items-center justify-center border border-accent-100">
              <UserCheck className="w-6 h-6 text-awqaf-primary" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                {LABELS.executor}
              </p>
              <p className="text-sm font-bold text-slate-800">{pkg.executor}</p>
            </div>
          </div>
        </div>

        {/* CONTENT BODY */}
        <main className="px-6 mt-8 space-y-8">
          {/* Inclusions Grid */}
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-awqaf-secondary" />
              {LABELS.includes}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {pkg.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  {i === 0 ? (
                    <FileCheck className="w-4 h-4 text-awqaf-primary" />
                  ) : i === 1 ? (
                    <Video className="w-4 h-4 text-awqaf-primary" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-awqaf-primary" />
                  )}
                  <span className="text-xs font-medium text-slate-700">
                    {feat}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Shield className="w-4 h-4 text-awqaf-primary" />
                <span className="text-xs font-medium text-slate-700">
                  Amanah 100%
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-3">
              {LABELS.desc}
            </h3>
            <article
              className={`
                 prose prose-sm max-w-none text-slate-600
                 prose-p:leading-loose prose-p:font-comfortaa
                 ${isRtl ? "text-right font-tajawal" : "text-justify"}
              `}
            >
              <div dangerouslySetInnerHTML={{ __html: pkg.description }} />
            </article>
          </div>
        </main>

        {/* BOTTOM ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-slate-100 flex gap-3 z-30 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-12 border-awqaf-primary text-awqaf-primary font-bold hover:bg-accent-50"
          >
            <Phone className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`} />
            {LABELS.contact}
          </Button>
          <Button className="flex-[2] rounded-xl h-12 bg-awqaf-primary hover:bg-awqaf-secondary text-white font-bold shadow-lg shadow-awqaf-primary/20">
            {LABELS.book}
          </Button>
        </div>
      </div>
    </div>
  );
}