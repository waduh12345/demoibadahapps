"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircleHeart, // Syahadat (Kesaksian hati)
  Timer, // Shalat (Waktu 5 waktu)
  HandCoins, // Zakat (Memberi harta)
  Moon, // Puasa (Ramadhan)
  MapPin, // Haji (Tujuan ke Mekkah)
  ChevronRight,
  LayoutGrid, // Icon Header
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// Import komponen detail
import IslamDetail from "./islam-detail";

// --- 1. DEFINISI TIPE DATA (Strict Types) ---
export type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface IslamItem {
  id: string;
  order: number;
  title: string;
  shortDesc: string;
  content: string; // HTML string
}

interface UIText {
  title: string;
  subtitle: string;
  read: string;
  back: string;
}

// --- 2. DATA DUMMY (6 BAHASA) ---
const ISLAM_DATA: Record<LocaleCode, IslamItem[]> = {
  id: [
    {
      id: "1",
      order: 1,
      title: "Syahadat",
      shortDesc:
        "Persaksian bahwa tiada Tuhan selain Allah dan Muhammad utusan Allah.",
      content: `<p>Syahadat adalah pintu gerbang masuk Islam. Kalimat <i>Laa ilaha illallah, Muhammadur Rasulullah</i> adalah intisari keyakinan seorang Muslim yang harus diucapkan dengan lisan dan dibenarkan dalam hati.</p>`,
    },
    {
      id: "2",
      order: 2,
      title: "Shalat",
      shortDesc: "Menegakkan ibadah shalat 5 waktu dalam sehari semalam.",
      content: `<p>Shalat adalah tiang agama. Lima waktu yang wajib dikerjakan adalah Subuh, Dzuhur, Ashar, Maghrib, dan Isya. Shalat mencegah perbuatan keji dan munkar.</p>`,
    },
    {
      id: "3",
      order: 3,
      title: "Zakat",
      shortDesc:
        "Mengeluarkan sebagian harta tertentu untuk diberikan kepada yang berhak.",
      content: `<p>Zakat berfungsi mensucikan harta dan jiwa. Ada zakat fitrah yang dibayarkan saat Ramadhan dan zakat mal (harta) jika sudah mencapai nisab.</p>`,
    },
    {
      id: "4",
      order: 4,
      title: "Puasa",
      shortDesc:
        "Menahan diri dari makan, minum, dan hawa nafsu di bulan Ramadhan.",
      content: `<p>Puasa Ramadhan wajib bagi setiap Muslim yang baligh dan sehat. Puasa melatih kesabaran, empati kepada fakir miskin, dan ketakwaan kepada Allah.</p>`,
    },
    {
      id: "5",
      order: 5,
      title: "Haji",
      shortDesc:
        "Berkunjung ke Baitullah bagi yang mampu secara fisik dan finansial.",
      content: `<p>Ibadah Haji adalah rukun Islam kelima. Dilakukan di bulan Dzulhijjah dengan serangkaian ritual seperti Tawaf, Sa'i, dan Wukuf di Arafah.</p>`,
    },
  ],
  en: [
    {
      id: "1",
      order: 1,
      title: "Shahada",
      shortDesc: "Testimony of Faith.",
      content: "<p>The declaration that there is no God but Allah...</p>",
    },
    {
      id: "2",
      order: 2,
      title: "Salah",
      shortDesc: "Prayer 5 times a day.",
      content: "<p>Prayer is the pillar of religion...</p>",
    },
    {
      id: "3",
      order: 3,
      title: "Zakat",
      shortDesc: "Almsgiving / Charity.",
      content: "<p>Purifying wealth by giving to the needy...</p>",
    },
    {
      id: "4",
      order: 4,
      title: "Sawm",
      shortDesc: "Fasting in Ramadan.",
      content: "<p>Abstaining from food and drink...</p>",
    },
    {
      id: "5",
      order: 5,
      title: "Hajj",
      shortDesc: "Pilgrimage to Mecca.",
      content: "<p>The pilgrimage to the holy Kaaba...</p>",
    },
  ],
  ar: [
    {
      id: "1",
      order: 1,
      title: "الشهادتان",
      shortDesc: "شهادة أن لا إله إلا الله وأن محمداً رسول الله.",
      content: "<p>الشهادتان هما مفتاح الدخول في الإسلام...</p>",
    },
    {
      id: "2",
      order: 2,
      title: "إقام الصلاة",
      shortDesc: "أداء الصلوات الخمس المفروضة.",
      content: "<p>الصلاة عمود الدين...</p>",
    },
    {
      id: "3",
      order: 3,
      title: "إيتاء الزكاة",
      shortDesc: "إخراج جزء معلوم من المال.",
      content: "<p>الزكاة طهرة للمال والنفس...</p>",
    },
    {
      id: "4",
      order: 4,
      title: "صوم رمضان",
      shortDesc: "الإمساك عن المفطرات في شهر رمضان.",
      content: "<p>الصوم جنة ووقاية...</p>",
    },
    {
      id: "5",
      order: 5,
      title: "حج البيت",
      shortDesc: "قصد بيت الله الحرام لمن استطاع إليه سبيلا.",
      content: "<p>الحج المبرور ليس له جزاء إلا الجنة...</p>",
    },
  ],
  fr: [
    {
      id: "1",
      order: 1,
      title: "Shahada",
      shortDesc: "La profession de foi.",
      content: "<p>...</p>",
    },
    {
      id: "2",
      order: 2,
      title: "Salât",
      shortDesc: "La prière rituelle.",
      content: "<p>...</p>",
    },
    {
      id: "3",
      order: 3,
      title: "Zakât",
      shortDesc: "L'aumône légale.",
      content: "<p>...</p>",
    },
    {
      id: "4",
      order: 4,
      title: "Sawm",
      shortDesc: "Le jeûne du Ramadan.",
      content: "<p>...</p>",
    },
    {
      id: "5",
      order: 5,
      title: "Hajj",
      shortDesc: "Le pèlerinage à La Mecque.",
      content: "<p>...</p>",
    },
  ],
  kr: [
    {
      id: "1",
      order: 1,
      title: "샤하다",
      shortDesc: "신앙 고백.",
      content: "<p>...</p>",
    },
    {
      id: "2",
      order: 2,
      title: "살라트",
      shortDesc: "매일 5번의 예배.",
      content: "<p>...</p>",
    },
    {
      id: "3",
      order: 3,
      title: "자카트",
      shortDesc: "자선.",
      content: "<p>...</p>",
    },
    {
      id: "4",
      order: 4,
      title: "사움",
      shortDesc: "라마단 금식.",
      content: "<p>...</p>",
    },
    {
      id: "5",
      order: 5,
      title: "하지",
      shortDesc: "메카 순례.",
      content: "<p>...</p>",
    },
  ],
  jp: [
    {
      id: "1",
      order: 1,
      title: "シャハーダ",
      shortDesc: "信仰告白。",
      content: "<p>...</p>",
    },
    {
      id: "2",
      order: 2,
      title: "サラー",
      shortDesc: "1日5回の礼拝。",
      content: "<p>...</p>",
    },
    {
      id: "3",
      order: 3,
      title: "ザカート",
      shortDesc: "喜捨。",
      content: "<p>...</p>",
    },
    {
      id: "4",
      order: 4,
      title: "サウム",
      shortDesc: "断食。",
      content: "<p>...</p>",
    },
    {
      id: "5",
      order: 5,
      title: "ハッジ",
      shortDesc: "巡礼。",
      content: "<p>...</p>",
    },
  ],
};

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Rukun Islam",
    subtitle: "5 Pilar Tindakan",
    read: "Pelajari",
    back: "Kembali",
  },
  en: {
    title: "Pillars of Islam",
    subtitle: "5 Pillars of Action",
    read: "Learn",
    back: "Back",
  },
  ar: {
    title: "أركان الإسلام",
    subtitle: "٥ أركان عملية",
    read: "تعلم",
    back: "رجوع",
  },
  fr: {
    title: "Piliers de l'Islam",
    subtitle: "5 Piliers d'Action",
    read: "Apprendre",
    back: "Retour",
  },
  kr: {
    title: "이슬람의 기둥",
    subtitle: "5가지 실천",
    read: "배우기",
    back: "뒤로",
  },
  jp: {
    title: "イスラムの柱",
    subtitle: "5つの行い",
    read: "学ぶ",
    back: "戻る",
  },
};

export default function RukunIslamPage() {
  const { locale } = useI18n();
  // Safe Access Locale (Type Safe)
  const currentLocale = (
    Object.keys(ISLAM_DATA).includes(locale) ? locale : "id"
  ) as LocaleCode;

  const t = UI_TEXT[currentLocale];
  const data = ISLAM_DATA[currentLocale];

  // STATE
  const [selectedItem, setSelectedItem] = useState<IslamItem | null>(null);

  // MAPPING ICON (1-5)
  const getIcon = (order: number): LucideIcon => {
    switch (order) {
      case 1:
        return MessageCircleHeart; // Syahadat
      case 2:
        return Timer; // Shalat
      case 3:
        return HandCoins; // Zakat
      case 4:
        return Moon; // Puasa
      case 5:
        return MapPin; // Haji
      default:
        return LayoutGrid;
    }
  };

  // --- RENDER DETAIL ---
  if (selectedItem) {
    return (
      <IslamDetail
        item={selectedItem}
        locale={currentLocale}
        onBack={() => setSelectedItem(null)}
        icon={getIcon(selectedItem.order)}
      />
    );
  }

  // --- RENDER LIST ---
  return (
    <div
      className="min-h-screen bg-slate-50 mb-20"
      dir={currentLocale === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-10 shadow-xl overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-bl from-emerald-600 to-teal-800 p-6 pb-12 rounded-b-[40px] relative overflow-hidden">
          {/* Islamic Pattern Decoration */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

          <div className="relative z-10">
            <Link href="/bekal-islam">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-auto mb-4 rounded-full"
              >
                <ArrowLeft
                  className={`w-6 h-6 ${currentLocale === "ar" ? "rotate-180" : ""}`}
                />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <LayoutGrid className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-comfortaa">
                  {t.title}
                </h1>
                <p className="text-white/80 text-xs font-comfortaa">
                  {t.subtitle}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* List Items */}
        <main className="px-5 -mt-6 relative z-20 space-y-4">
          {data.map((item) => {
            const Icon = getIcon(item.order);
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="cursor-pointer group"
              >
                <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white hover:-translate-y-1">
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Number Badge with Icon */}
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <div className="absolute inset-0 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors"></div>
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <Icon className="w-7 h-7 text-emerald-600" />
                      </div>
                      <Badge className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] z-20 border-2 border-white">
                        {item.order}
                      </Badge>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-800 font-comfortaa mb-1 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.shortDesc}
                      </p>
                    </div>

                    <ChevronRight
                      className={`w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors ${currentLocale === "ar" ? "rotate-180" : ""}`}
                    />
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}