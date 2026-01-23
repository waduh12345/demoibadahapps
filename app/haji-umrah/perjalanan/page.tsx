"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Tent, // Mina/Arafah
  Moon, // Muzdalifah (Malam)
  Sun, // Arafah (Siang)
  CheckCircle2,
  ChevronRight,
  CircleDot,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// Import komponen detail
import JourneyDetail from "./detail";

// --- 1. TIPE DATA (Strict Types) ---
export type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface DailyActivity {
  id: string;
  day: string; // e.g., "8 Dzulhijjah"
  phase: string; // e.g., "Hari Tarwiyah"
  location: string; // e.g., "Mina"
  description: string;
  activities: string[]; // List of To-Do items
  status: "completed" | "current" | "upcoming"; // Simulasi status
}

interface UIText {
  title: string;
  subtitle: string;
  location: string;
  viewDetails: string;
}

// --- 2. DATA DUMMY (6 BAHASA) ---
const JOURNEY_DATA: Record<LocaleCode, DailyActivity[]> = {
  id: [
    {
      id: "d1",
      day: "8 Dzulhijjah",
      phase: "Hari Tarwiyah",
      location: "Mina",
      description:
        "Persiapan mental dan fisik, memulai ihram haji, dan bermalam di Mina.",
      activities: [
        "Berniat Haji",
        "Shalat 5 waktu di Mina",
        "Memperbanyak Talbiyah",
        "Mabit (Bermalam)",
      ],
      status: "completed",
    },
    {
      id: "d2",
      day: "9 Dzulhijjah",
      phase: "Wukuf Arafah",
      location: "Arafah",
      description:
        "Puncak ibadah haji. Berdiam diri, berdoa, dan berdzikir dari tergelincir matahari hingga terbenam.",
      activities: [
        "Mendengarkan Khutbah Wukuf",
        "Shalat Jamak Taqdim (Dzuhur-Ashar)",
        "Doa Mustajab di sore hari",
      ],
      status: "current",
    },
    {
      id: "d3",
      day: "Malam 10 Dzulhijjah",
      phase: "Mabit Muzdalifah",
      location: "Muzdalifah",
      description:
        "Singgah sejenak setelah dari Arafah untuk mengambil batu kerikil.",
      activities: [
        "Shalat Maghrib & Isya (Jamak)",
        "Mengumpulkan 49/70 kerikil",
        "Istirahat sejenak",
      ],
      status: "upcoming",
    },
    {
      id: "d4",
      day: "10 Dzulhijjah",
      phase: "Hari Nahar (Idul Adha)",
      location: "Mina & Masjidil Haram",
      description: "Hari penyembelihan kurban dan lempar jumrah aqabah.",
      activities: [
        "Lempar Jumrah Aqabah",
        "Menyembelih Dam/Hadyu",
        "Tahallul Awal",
        "Tawaf Ifadah",
      ],
      status: "upcoming",
    },
    {
      id: "d5",
      day: "11-13 Dzulhijjah",
      phase: "Hari Tasyriq",
      location: "Mina",
      description:
        "Melempar ketiga jumrah (Ula, Wustha, Aqabah) setiap hari setelah tergelincir matahari.",
      activities: ["Mabit di Mina", "Lempar 3 Jumrah", "Perbanyak Dzikir"],
      status: "upcoming",
    },
  ],
  en: [
    {
      id: "d1",
      day: "8 Dhul-Hijjah",
      phase: "Day of Tarwiyah",
      location: "Mina",
      description: "Preparation and staying overnight in Mina.",
      activities: ["Intention for Hajj", "Prayers in Mina"],
      status: "completed",
    },
    {
      id: "d2",
      day: "9 Dhul-Hijjah",
      phase: "Day of Arafah",
      location: "Arafah",
      description: "The pinnacle of Hajj. Standing in prayer and reflection.",
      activities: ["Khutbah", "Prayers", "Supplication"],
      status: "current",
    },
    // ... Simplified fillers
    {
      id: "d3",
      day: "Night of 10th",
      phase: "Muzdalifah",
      location: "Muzdalifah",
      description: "Overnight stay and collecting pebbles.",
      activities: [],
      status: "upcoming",
    },
  ],
  ar: [
    {
      id: "d1",
      day: "٨ ذو الحجة",
      phase: "يوم التروية",
      location: "منى",
      description: "الإحرام والمبيت بمنى.",
      activities: ["نية الحج", "الصلاة بمنى"],
      status: "completed",
    },
    {
      id: "d2",
      day: "٩ ذو الحجة",
      phase: "يوم عرفة",
      location: "عرفات",
      description: "ركن الحج الأعظم.",
      activities: ["الوقوف بعرفة", "الدعاء"],
      status: "current",
    },
    {
      id: "d3",
      day: "ليلة ١٠",
      phase: "مزدلفة",
      location: "مزدلفة",
      description: "المبيت وجمع الحصى.",
      activities: [],
      status: "upcoming",
    },
  ],
  fr: [
    {
      id: "d1",
      day: "8 Dhu al-Hijjah",
      phase: "Jour de Tarwiyah",
      location: "Mina",
      description: "Préparation et nuit à Mina.",
      activities: [],
      status: "completed",
    },
    {
      id: "d2",
      day: "9 Dhu al-Hijjah",
      phase: "Jour d'Arafat",
      location: "Arafat",
      description: "Le pilier du Hajj.",
      activities: [],
      status: "current",
    },
  ],
  kr: [
    {
      id: "d1",
      day: "줄히자 8일",
      phase: "타르위야의 날",
      location: "미나",
      description: "미나에서의 준비 및 숙박.",
      activities: [],
      status: "completed",
    },
  ],
  jp: [
    {
      id: "d1",
      day: "ズル・ヒッジャ8日",
      phase: "タルウィヤの日",
      location: "ミナ",
      description: "ミナでの準備と宿泊。",
      activities: [],
      status: "completed",
    },
  ],
};

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Perjalanan Haji",
    subtitle: "Timeline Ibadah",
    location: "Lokasi",
    viewDetails: "Lihat Detail",
  },
  en: {
    title: "Hajj Journey",
    subtitle: "Worship Timeline",
    location: "Location",
    viewDetails: "View Details",
  },
  ar: {
    title: "رحلة الحج",
    subtitle: "الجدول الزمني",
    location: "الموقع",
    viewDetails: "التفاصيل",
  },
  fr: {
    title: "Voyage du Hajj",
    subtitle: "Chronologie",
    location: "Lieu",
    viewDetails: "Détails",
  },
  kr: {
    title: "하지 여정",
    subtitle: "일정",
    location: "위치",
    viewDetails: "자세히 보기",
  },
  jp: {
    title: "ハッジの旅",
    subtitle: "タイムライン",
    location: "場所",
    viewDetails: "詳細",
  },
};

export default function HajjJourneyPage() {
  const { locale } = useI18n();
  const safeLocale = (JOURNEY_DATA[locale] ? locale : "id") as LocaleCode;

  const t = UI_TEXT[safeLocale];
  const journey = JOURNEY_DATA[safeLocale] || JOURNEY_DATA.id;

  // STATE
  const [selectedDay, setSelectedDay] = useState<DailyActivity | null>(null);

  // Helper Icon
  const getIcon = (loc: string): LucideIcon => {
    const l = loc.toLowerCase();
    if (l.includes("arafah") || l.includes("عرفة")) return Sun;
    if (l.includes("muzdalifah") || l.includes("مزدلفة")) return Moon;
    return Tent;
  };

  // RENDER DETAIL
  if (selectedDay) {
    return (
      <JourneyDetail
        data={selectedDay}
        locale={safeLocale}
        onBack={() => setSelectedDay(null)}
        icon={getIcon(selectedDay.location)}
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
        {/* Header */}
        <header className="bg-awqaf-primary sticky top-0 z-30 pb-8 pt-4 rounded-b-[32px] shadow-lg">
          <div className="px-4">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-white/10 text-white rounded-full"
                >
                  <ArrowLeft
                    className={`w-6 h-6 ${safeLocale === "ar" ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white font-comfortaa">
                  {t.title}
                </h1>
                <p className="text-white/80 text-xs font-comfortaa mt-1">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* Progress Summary Card (Static for now) */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-awqaf-secondary rounded-full flex items-center justify-center font-bold text-awqaf-primary shadow-md">
                  5
                </div>
                <div>
                  <p className="text-xs text-white/80">Total Hari</p>
                  <p className="font-bold text-sm">8 - 13 Dzulhijjah</p>
                </div>
              </div>
              <MapPin className="w-6 h-6 text-awqaf-secondary opacity-80" />
            </div>
          </div>
        </header>

        {/* Timeline Content */}
        <main className="px-5 py-8 relative">
          {/* Timeline Connector Line */}
          <div
            className={`absolute top-10 bottom-10 w-[2px] bg-gradient-to-b from-awqaf-primary via-accent-100 to-transparent ${safeLocale === "ar" ? "right-[2.35rem]" : "left-[2.35rem]"} z-0`}
          ></div>

          {journey.map((item, index) => {
            const Icon = getIcon(item.location);
            const isCompleted = item.status === "completed";
            const isCurrent = item.status === "current";

            return (
              <div
                key={item.id}
                className="relative z-10 mb-8 last:mb-0 group cursor-pointer"
                onClick={() => setSelectedDay(item)}
              >
                <div className="flex gap-5 items-stretch">
                  {/* Timeline Dot/Icon */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div
                      className={`
                      w-10 h-10 rounded-full flex items-center justify-center shadow-md border-4 transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-awqaf-primary border-awqaf-primary text-white"
                          : isCurrent
                            ? "bg-white border-awqaf-secondary text-awqaf-primary scale-110 ring-4 ring-awqaf-secondary/20"
                            : "bg-white border-slate-200 text-slate-300"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <CircleDot className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Content Card */}
                  <Card
                    className={`
                    flex-1 border-none shadow-sm transition-all duration-300 overflow-hidden
                    ${isCurrent ? "shadow-lg ring-1 ring-awqaf-secondary translate-x-1" : "hover:shadow-md hover:bg-slate-50"}
                  `}
                  >
                    <CardContent className="p-0">
                      {/* Date Header */}
                      <div
                        className={`
                        px-4 py-2 flex items-center justify-between text-xs font-bold
                        ${isCurrent ? "bg-awqaf-secondary/20 text-awqaf-primary" : "bg-slate-100 text-slate-500"}
                      `}
                      >
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-3.5 h-3.5" />
                          <span>{item.day}</span>
                        </div>
                        {isCurrent && (
                          <Badge className="bg-awqaf-secondary text-awqaf-primary hover:bg-awqaf-secondary border-0 text-[10px] px-2 h-5">
                            NOW
                          </Badge>
                        )}
                      </div>

                      {/* Main Info */}
                      <div className="p-4">
                        <h3
                          className={`font-bold font-comfortaa text-lg mb-1 ${isCurrent ? "text-awqaf-primary" : "text-slate-800"}`}
                        >
                          {item.phase}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                          <MapPin className="w-3.5 h-3.5 text-awqaf-secondary" />
                          <span className="text-slate-600">
                            {item.location}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3 font-comfortaa">
                          {item.description}
                        </p>

                        <div className="flex items-center text-xs font-bold text-awqaf-primary group-hover:underline decoration-awqaf-primary/30">
                          {t.viewDetails}
                          <ChevronRight
                            className={`w-3.5 h-3.5 ${safeLocale === "ar" ? "mr-1 rotate-180" : "ml-1"}`}
                          />
                        </div>
                      </div>
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