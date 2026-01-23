"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Footprints, // Sa'i
  Repeat, // Tawaf
  Scissors, // Tahallul
  Shirt, // Ihram
  Tent, // Mina/Arafah
  ChevronRight,
  Map,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// Import komponen detail
import GuideDetail from "./detail";

// --- 1. TIPE DATA ---
export type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";
export type GuideCategory = "umrah" | "hajj";

export interface GuideStep {
  id: string;
  category: GuideCategory;
  stepNumber: number;
  title: string;
  description: string;
  content: string; // HTML content (Doa & Tata Cara)
}

interface UIText {
  title: string;
  tabHajj: string;
  tabUmrah: string;
  step: string;
  read: string;
}

// --- 2. DATA DUMMY ---
const GUIDE_DATA: Record<LocaleCode, GuideStep[]> = {
  id: [
    // UMRAH
    {
      id: "u1",
      category: "umrah",
      stepNumber: 1,
      title: "Ihram & Niat",
      description: "Memakai pakaian ihram dan berniat dari Miqat.",
      content: `<p>Sunnah mandi besar, memotong kuku, dan memakai wewangian sebelum Ihram. Niat Umrah: <i>Labbaikallahumma 'Umratan</i>.</p>`,
    },
    {
      id: "u2",
      category: "umrah",
      stepNumber: 2,
      title: "Tawaf",
      description: "Mengelilingi Ka'bah sebanyak 7 kali putaran.",
      content: `<p>Dimulai dari Hajar Aswad, Ka'bah berada di sisi kiri. Memperbanyak doa dan dzikir saat putaran.</p>`,
    },
    {
      id: "u3",
      category: "umrah",
      stepNumber: 3,
      title: "Sa'i",
      description: "Berlari-lari kecil antara bukit Safa dan Marwah 7 kali.",
      content: `<p>Dimulai dari Safa dan berakhir di Marwah. Disunnahkan berlari kecil di antara dua pilar hijau.</p>`,
    },
    {
      id: "u4",
      category: "umrah",
      stepNumber: 4,
      title: "Tahallul",
      description: "Mencukur atau memotong sebagian rambut.",
      content: `<p>Sebagai tanda selesainya ibadah Umrah. Bagi laki-laki disunnahkan gundul (Tahallul Qulub).</p>`,
    },
    // HAJI (Simplified)
    {
      id: "h1",
      category: "hajj",
      stepNumber: 1,
      title: "Ihram",
      description: "Berniat Haji dari Miqat.",
      content: "<p>Niat: Labbaikallahumma Hajjan.</p>",
    },
    {
      id: "h2",
      category: "hajj",
      stepNumber: 2,
      title: "Wukuf di Arafah",
      description: "Puncak haji pada 9 Dzulhijjah.",
      content:
        "<p>Berdiam diri, berdoa, dan beristighfar dari dzuhur hingga terbenam matahari.</p>",
    },
    {
      id: "h3",
      category: "hajj",
      stepNumber: 3,
      title: "Mabit di Muzdalifah",
      description: "Menginap dan mencari kerikil.",
      content: "<p>Setelah dari Arafah, bermalam di Muzdalifah.</p>",
    },
    {
      id: "h4",
      category: "hajj",
      stepNumber: 4,
      title: "Lempar Jumrah",
      description: "Melempar Jumrah Aqabah.",
      content: "<p>Melempar 7 kerikil ke tiang Jumrah.</p>",
    },
  ],
  en: [
    {
      id: "u1",
      category: "umrah",
      stepNumber: 1,
      title: "Ihram",
      description: "Entering the state of sanctity.",
      content: "<p>Intention for Umrah...</p>",
    },
    {
      id: "u2",
      category: "umrah",
      stepNumber: 2,
      title: "Tawaf",
      description: "Circumambulating the Kaaba 7 times.",
      content: "<p>Start from Hajar al-Aswad...</p>",
    },
    // ... filler for logic
    {
      id: "h1",
      category: "hajj",
      stepNumber: 1,
      title: "Ihram",
      description: "Intention for Hajj.",
      content: "<p>...</p>",
    },
  ],
  ar: [
    {
      id: "u1",
      category: "umrah",
      stepNumber: 1,
      title: "الإحرام",
      description: "نية الدخول في النسك.",
      content: "<p>لبيك اللهم عمرة...</p>",
    },
    {
      id: "u2",
      category: "umrah",
      stepNumber: 2,
      title: "الطواف",
      description: "سبعة أشواط حول الكعبة.",
      content: "<p>...</p>",
    },
    {
      id: "h1",
      category: "hajj",
      stepNumber: 1,
      title: "الإحرام",
      description: "نية الحج.",
      content: "<p>...</p>",
    },
  ],
  fr: [
    {
      id: "u1",
      category: "umrah",
      stepNumber: 1,
      title: "Ihrâm",
      description: "Entrée en état de sacralisation.",
      content: "<p>...</p>",
    },
    {
      id: "h1",
      category: "hajj",
      stepNumber: 1,
      title: "Ihrâm",
      description: "Intention du Hajj.",
      content: "<p>...</p>",
    },
  ],
  kr: [
    {
      id: "u1",
      category: "umrah",
      stepNumber: 1,
      title: "이흐람",
      description: "순례의 시작.",
      content: "<p>...</p>",
    },
    {
      id: "h1",
      category: "hajj",
      stepNumber: 1,
      title: "이흐람",
      description: "하지의 시작.",
      content: "<p>...</p>",
    },
  ],
  jp: [
    {
      id: "u1",
      category: "umrah",
      stepNumber: 1,
      title: "イフラーム",
      description: "巡礼の聖域に入る。",
      content: "<p>...</p>",
    },
    {
      id: "h1",
      category: "hajj",
      stepNumber: 1,
      title: "イフラーム",
      description: "ハッジの意図。",
      content: "<p>...</p>",
    },
  ],
};

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Panduan Ibadah",
    tabHajj: "Haji",
    tabUmrah: "Umrah",
    step: "Langkah",
    read: "Lihat Detail",
  },
  en: {
    title: "Pilgrimage Guide",
    tabHajj: "Hajj",
    tabUmrah: "Umrah",
    step: "Step",
    read: "View Details",
  },
  ar: {
    title: "دليل المناسك",
    tabHajj: "الحج",
    tabUmrah: "العمرة",
    step: "خطوة",
    read: "التفاصيل",
  },
  fr: {
    title: "Guide du Pèlerinage",
    tabHajj: "Hajj",
    tabUmrah: "Omra",
    step: "Étape",
    read: "Détails",
  },
  kr: {
    title: "순례 가이드",
    tabHajj: "하지",
    tabUmrah: "움라",
    step: "단계",
    read: "자세히 보기",
  },
  jp: {
    title: "巡礼ガイド",
    tabHajj: "ハッジ",
    tabUmrah: "ウムラ",
    step: "ステップ",
    read: "詳細を見る",
  },
};

export default function GuidePage() {
  const { locale } = useI18n();
  const safeLocale = (GUIDE_DATA[locale] ? locale : "id") as LocaleCode;

  const t = UI_TEXT[safeLocale];

  // STATE
  const [activeTab, setActiveTab] = useState<GuideCategory>("umrah");
  const [selectedStep, setSelectedStep] = useState<GuideStep | null>(null);

  // Helper untuk Icon
  const getIcon = (title: string): LucideIcon => {
    const lower = title.toLowerCase();
    if (lower.includes("ihram") || lower.includes("إحرام")) return Shirt;
    if (lower.includes("tawaf") || lower.includes("طواف")) return Repeat;
    if (lower.includes("sa'i") || lower.includes("سعي")) return Footprints;
    if (lower.includes("tahallul") || lower.includes("cukur")) return Scissors;
    if (lower.includes("wukuf") || lower.includes("mina")) return Tent;
    return Map; // Default
  };

  // Filter Data
  const steps = useMemo(() => {
    const raw = GUIDE_DATA[safeLocale] || GUIDE_DATA.id;
    return raw
      .filter((item) => item.category === activeTab)
      .sort((a, b) => a.stepNumber - b.stepNumber);
  }, [safeLocale, activeTab]);

  // RENDER DETAIL
  if (selectedStep) {
    return (
      <GuideDetail
        step={selectedStep}
        locale={safeLocale}
        onBack={() => setSelectedStep(null)}
        totalSteps={steps.length}
        icon={getIcon(selectedStep.title)}
      />
    );
  }

  // RENDER LIST
  return (
    <div
      className="min-h-screen bg-slate-50"
      dir={safeLocale === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-20">
        {/* Header with Tabs */}
        <header className="bg-awqaf-primary sticky top-0 z-30 pb-6 rounded-b-[30px] shadow-lg">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-6">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-white/10 text-white"
                >
                  <ArrowLeft
                    className={`w-6 h-6 ${safeLocale === "ar" ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-white font-comfortaa">
                {t.title}
              </h1>
            </div>

            {/* Tab Switcher */}
            <div className="bg-awqaf-secondary/30 p-1 rounded-xl flex gap-1 backdrop-blur-sm">
              <button
                onClick={() => setActiveTab("umrah")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300
                  ${
                    activeTab === "umrah"
                      ? "bg-white text-awqaf-primary shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {t.tabUmrah}
              </button>
              <button
                onClick={() => setActiveTab("hajj")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300
                  ${
                    activeTab === "hajj"
                      ? "bg-white text-awqaf-primary shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {t.tabHajj}
              </button>
            </div>
          </div>
        </header>

        {/* Timeline Content */}
        <main className="px-5 py-6 space-y-0 relative">
          {/* Vertical Line (Timeline) */}
          <div
            className={`absolute top-6 bottom-10 w-0.5 bg-accent-100 ${safeLocale === "ar" ? "right-[2.6rem]" : "left-[2.6rem]"} z-0`}
          ></div>

          {steps.map((item, index) => {
            const Icon = getIcon(item.title);
            return (
              <div
                key={item.id}
                className="relative z-10 mb-6 last:mb-0 group cursor-pointer"
                onClick={() => setSelectedStep(item)}
              >
                <div className="flex gap-4 items-start">
                  {/* Step Number Bubble */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-accent-100 flex items-center justify-center shadow-sm group-hover:border-awqaf-primary group-hover:scale-110 transition-all duration-300">
                      <span className="text-sm font-bold text-awqaf-primary">
                        {item.stepNumber}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <Card className="flex-1 border-none shadow-sm hover:shadow-md transition-all duration-200 bg-white ring-1 ring-slate-100 rounded-xl overflow-hidden group-hover:bg-accent-50/30">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-2.5 bg-accent-50 rounded-lg text-awqaf-primary group-hover:bg-white group-hover:shadow-sm transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-awqaf-primary font-comfortaa text-base mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-300 group-hover:text-awqaf-primary ${safeLocale === "ar" ? "rotate-180" : ""}`}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}