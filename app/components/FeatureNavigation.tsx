"use client";

import { Button } from "@/components/ui/button";
import {
  Clock,
  Compass,
  BookOpen,
  GraduationCap,
  MessageCircle,
  ChevronRight,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/app/hooks/useI18n"; // Import Hook

export default function FeatureNavigation() {
  const { locale } = useI18n();

  // --- Inline Translations for UI ---
  const UI_TEXTS = {
    id: { title: "Fitur Utama", viewAll: "Lihat Semua" },
    en: { title: "Main Features", viewAll: "View All" },
    ar: { title: "الميزات الرئيسية", viewAll: "عرض الكل" },
    fr: { title: "Fonctionnalités", viewAll: "Voir tout" },
    kr: { title: "주요 기능", viewAll: "모두 보기" },
    jp: { title: "主な機能", viewAll: "すべて表示" },
  };

  const ui = UI_TEXTS[locale] || UI_TEXTS.id;

  // --- Inline Translations for Features ---
  const FEATURE_NAMES = {
    id: {
      prayer: "Waktu Sholat",
      tracker: "Pantau Sholat",
      kiblat: "Arah Kiblat",
      quran: "Al-Qur'an",
      kajian: "Kajian",
      tanya: "Tanya Ustadz",
    },
    en: {
      prayer: "Prayer Times",
      tracker: "Prayer Tracker",
      kiblat: "Qibla",
      quran: "Quran",
      kajian: "Study",
      tanya: "Ask Scholar",
    },
    ar: {
      prayer: "أوقات الصلاة",
      tracker: "متابع الصلاة",
      kiblat: "القبلة",
      quran: "القرآن",
      kajian: "محاضرات",
      tanya: "اسأل الأستاذ",
    },
    fr: {
      prayer: "Prières",
      tracker: "Suivi Prière",
      kiblat: "Qibla",
      quran: "Coran",
      kajian: "Conférences",
      tanya: "Demander",
    },
    kr: {
      prayer: "기도 시간",
      tracker: "기도 추적",
      kiblat: "키블라",
      quran: "꾸란",
      kajian: "강의",
      tanya: "질문하기",
    },
    jp: {
      prayer: "礼拝時間",
      tracker: "礼拝追跡",
      kiblat: "キブラ",
      quran: "クルアーン",
      kajian: "講義",
      tanya: "質問する",
    },
  };

  const names = FEATURE_NAMES[locale] || FEATURE_NAMES.id;

  const features = [
    {
      name: names.prayer,
      icon: Clock,
      href: "/sholat",
    },
    {
      name: names.tracker,
      icon: Target,
      href: "/prayer-tracker",
    },
    {
      name: names.kiblat,
      icon: Compass,
      href: "/kiblat",
    },
    {
      name: names.quran,
      icon: BookOpen,
      href: "/quran",
    },
    {
      name: names.kajian,
      icon: GraduationCap,
      href: "/kajian",
    },
    {
      name: names.tanya,
      icon: MessageCircle,
      href: "/tanya-ustadz",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
          {ui.title}
        </h2>
        <Link href="/features">
          <Button
            variant="ghost"
            size="sm"
            className="text-awqaf-foreground-secondary hover:text-awqaf-primary hover:bg-accent-100 font-comfortaa transition-colors duration-200"
          >
            {ui.viewAll}
            <ChevronRight
              className={`w-4 h-4 ${locale === "ar" ? "mr-1 rotate-180" : "ml-1"}`}
            />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.href} href={feature.href}>
              <div className="flex flex-col items-center p-3 rounded-xl border border-awqaf-border-light bg-white hover:shadow-md hover:bg-accent-50 transition-all duration-200 active:scale-95 h-full">
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center mb-2 flex-shrink-0">
                  <Icon className="w-5 h-5 text-awqaf-primary" />
                </div>
                <h3 className="font-medium text-card-foreground text-[10px] font-comfortaa text-center leading-tight flex-1 flex items-center justify-center">
                  {feature.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}