"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileCheck,
  Gift,
  UserCheck,
  Shield,
  Phone,
  Share2,
  Check,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessedBadalPackage } from "./page";
import { LocaleCode } from "@/lib/i18n";

interface BadalDetailProps {
  pkg: ProcessedBadalPackage;
  locale: LocaleCode;
  onBack: () => void;
}

export default function BadalDetail({ pkg, locale, onBack }: BadalDetailProps) {
  const isRtl = locale === "ar";
  const [copied, setCopied] = useState(false);

  const LABELS = {
    title:
      locale === "en"
        ? "Package Details"
        : locale === "ar"
          ? "تفاصيل الباقة"
          : "Detail Paket",
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
    trust:
      locale === "en"
        ? "100% Trustworthy"
        : locale === "ar"
          ? "موثوق 100٪"
          : "Amanah 100%",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = async () => {
    const shareText = `${pkg.title}\nHarga: ${pkg.priceDisplay}\n\n${pkg.shortDesc}\n\nLink: ${window.location.href}`;
    const shareData = {
      title: pkg.title,
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
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-24"
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
        {/* 1. Main Info Card */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6 text-center">
            <Badge
              className={`mb-3 px-3 py-1 font-bold font-comfortaa ${pkg.type === "haji" ? "bg-awqaf-secondary text-white" : "bg-awqaf-primary text-white"}`}
            >
              {pkg.type.toUpperCase()}
            </Badge>
            <h2 className="text-2xl font-bold text-awqaf-primary font-comfortaa mb-2 leading-tight">
              {pkg.title}
            </h2>
            <p className="text-3xl font-bold text-awqaf-primary font-comfortaa my-4">
              {pkg.priceDisplay}
            </p>

            {/* Executor Badge */}
            <div className="inline-flex items-center gap-2 bg-accent-50 px-3 py-1.5 rounded-full border border-accent-100">
              <UserCheck className="w-4 h-4 text-awqaf-primary" />
              <span className="text-xs text-awqaf-foreground-secondary font-medium font-comfortaa">
                {LABELS.executor}:{" "}
                <span className="font-bold">{pkg.executor}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Inclusions */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-awqaf-primary" />
              <span className="font-bold text-awqaf-primary font-comfortaa">
                {LABELS.includes}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {pkg.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-accent-50/50 rounded-xl border border-awqaf-border-light/50"
                >
                  <div className="w-6 h-6 rounded-full bg-white text-awqaf-primary flex items-center justify-center shadow-sm border border-awqaf-border-light">
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-awqaf-foreground-secondary font-comfortaa">
                    {feat}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-3 p-3 bg-accent-50/50 rounded-xl border border-awqaf-border-light/50">
                <div className="w-6 h-6 rounded-full bg-white text-awqaf-primary flex items-center justify-center shadow-sm border border-awqaf-border-light">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium text-awqaf-foreground-secondary font-comfortaa">
                  {LABELS.trust}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Description */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-awqaf-primary" />
              <span className="font-bold text-awqaf-primary font-comfortaa">
                {LABELS.desc}
              </span>
            </div>
            <article
              className={`
                  prose prose-sm max-w-none 
                  text-awqaf-foreground-secondary font-comfortaa leading-relaxed
                  prose-p:mb-4
                  prose-strong:text-awqaf-primary prose-strong:font-bold
                  ${isRtl ? "text-right" : "text-justify"}
                `}
            >
              <div dangerouslySetInnerHTML={{ __html: pkg.description }} />
            </article>
          </CardContent>
        </Card>
      </main>

      {/* FLOATING ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-white via-white/90 to-transparent">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-12 border-awqaf-primary text-awqaf-primary font-bold hover:bg-accent-50 font-comfortaa bg-white shadow-sm"
          >
            <Phone className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`} />
            {LABELS.contact}
          </Button>
          <Button className="flex-[2] rounded-xl h-12 bg-awqaf-primary hover:bg-awqaf-primary/90 text-white shadow-lg font-bold font-comfortaa transition-transform active:scale-[0.98]">
            {LABELS.book}
          </Button>
        </div>
      </div>
    </div>
  );
}