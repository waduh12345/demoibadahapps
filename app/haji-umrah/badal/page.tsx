"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HeartHandshake, // Simbol amanah/jasa
  FileCheck, // Sertifikat
  Video, // Bukti Video
  Users, // Pelaksana
  ChevronRight,
  ShieldCheck,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// Import komponen detail
import BadalDetail from "./detail";

// --- 1. TIPE DATA (Strict Types) ---
export type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";
export type ServiceType = "umrah" | "haji";

export interface BadalPackage {
  id: string;
  type: ServiceType;
  title: string;
  executor: string; // Siapa yang melaksanakan (e.g., Ustadz, Mahasiswa)
  priceDisplay: string; // Formatted price
  shortDesc: string;
  features: string[]; // List fitur singkat
  description: string; // HTML content
}

interface UIText {
  title: string;
  subtitle: string;
  tabUmrah: string;
  tabHaji: string;
  by: string; // "Oleh..."
  choose: string; // "Pilih Paket"
}

// --- 2. DATA DUMMY (6 BAHASA) ---
const BADAL_DATA: Record<LocaleCode, BadalPackage[]> = {
  id: [
    {
      id: "u1",
      type: "umrah",
      title: "Badal Umrah Reguler",
      executor: "Mahasiswa Univ. Islam Madinah",
      priceDisplay: "Rp 2.500.000",
      shortDesc: "Pelaksanaan umrah amanah oleh mahasiswa terpercaya.",
      features: [
        "Sertifikat Fisik",
        "Video Cuplikan",
        "Notifikasi Pelaksanaan",
      ],
      description:
        "<p>Paket ini dilaksanakan oleh mahasiswa Indonesia yang sedang menempuh studi di Madinah/Makkah. Amanah dan sesuai sunnah.</p>",
    },
    {
      id: "u2",
      type: "umrah",
      title: "Badal Umrah Ramadhan",
      executor: "Ustadz/Muthawif Berpengalaman",
      priceDisplay: "Rp 4.500.000",
      shortDesc: "Pahala umrah di bulan Ramadhan setara dengan Haji.",
      features: ["Sertifikat Eksklusif", "Video Full Durasi", "Air Zamzam 5L"],
      description:
        "<p>Keutamaan umrah di bulan Ramadhan sangat besar. Dilaksanakan oleh para Asatidz yang mukim di Makkah.</p>",
    },
    {
      id: "h1",
      type: "haji",
      title: "Badal Haji",
      executor: "Ulama/Ustadz Senior",
      priceDisplay: "Rp 15.000.000",
      shortDesc: "Hanya tersedia 1 slot per pelaksana setiap tahun.",
      features: ["Sertifikat Haji", "Dokumentasi Lengkap", "Souvenir Haji"],
      description:
        "<p>Badal Haji dilaksanakan pada musim haji tahun berjalan. Syarat: Orang yang dibadalkan telah meninggal dunia atau sakit parah yang tidak ada harapan sembuh (ma'dhub).</p>",
    },
  ],
  en: [
    {
      id: "u1",
      type: "umrah",
      title: "Regular Badal Umrah",
      executor: "Students of Madinah Univ.",
      priceDisplay: "$ 180",
      shortDesc: "Trustworthy execution by students.",
      features: ["Certificate", "Video Clip", "Notification"],
      description:
        "<p>Performed by trusted students studying in Mecca/Madinah.</p>",
    },
    {
      id: "h1",
      type: "haji",
      title: "Badal Hajj",
      executor: "Senior Scholars",
      priceDisplay: "$ 1000",
      shortDesc: "Limited slots available.",
      features: ["Hajj Certificate", "Full Documentation"],
      description:
        "<p>Performed during the Hajj season for deceased or permanently disabled persons.</p>",
    },
  ],
  ar: [
    {
      id: "u1",
      type: "umrah",
      title: "بدل عمرة (عادي)",
      executor: "طلاب الجامعة الإسلامية",
      priceDisplay: "٦٠٠ ريال",
      shortDesc: "تنفيذ بأمانة من طلاب العلم.",
      features: ["شهادة", "فيديو توثيقي"],
      description: "<p>يقوم بها طلاب العلم في مكة المكرمة.</p>",
    },
    {
      id: "h1",
      type: "haji",
      title: "بدل حج",
      executor: "مشايخ ثقات",
      priceDisplay: "٤٠٠٠ ريال",
      shortDesc: "مقعد واحد لكل منفذ.",
      features: ["شهادة حج", "توثيق كامل"],
      description: "<p>للميت أو المعضوب.</p>",
    },
  ],
  fr: [
    {
      id: "u1",
      type: "umrah",
      title: "Badal Omra",
      executor: "Étudiants",
      priceDisplay: "160 €",
      shortDesc: "Exécution fiable.",
      features: ["Certificat", "Vidéo"],
      description: "<p>...</p>",
    },
  ],
  kr: [
    {
      id: "u1",
      type: "umrah",
      title: "바달 움라",
      executor: "유학생",
      priceDisplay: "₩ 200,000",
      shortDesc: "신뢰할 수 있는 대행.",
      features: ["증명서", "비디오"],
      description: "<p>...</p>",
    },
  ],
  jp: [
    {
      id: "u1",
      type: "umrah",
      title: "バダル・ウムラ",
      executor: "留学生",
      priceDisplay: "¥ 25,000",
      shortDesc: "信頼できる代行。",
      features: ["証明書", "ビデオ"],
      description: "<p>...</p>",
    },
  ],
};

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Badal Haji & Umrah",
    subtitle: "Amanah & Sesuai Sunnah",
    tabUmrah: "Umrah",
    tabHaji: "Haji",
    by: "Oleh",
    choose: "Pilih Paket",
  },
  en: {
    title: "Badal Hajj & Umrah",
    subtitle: "Trustworthy Services",
    tabUmrah: "Umrah",
    tabHaji: "Hajj",
    by: "By",
    choose: "Select",
  },
  ar: {
    title: "البدل في الحج والعمرة",
    subtitle: "خدمات موثوقة",
    tabUmrah: "العمرة",
    tabHaji: "الحج",
    by: "بواسطة",
    choose: "اختر",
  },
  fr: {
    title: "Badal Hajj & Omra",
    subtitle: "Services de Confiance",
    tabUmrah: "Omra",
    tabHaji: "Hajj",
    by: "Par",
    choose: "Choisir",
  },
  kr: {
    title: "바달 하지 & 움라",
    subtitle: "신뢰할 수 있는 서비스",
    tabUmrah: "움라",
    tabHaji: "하지",
    by: "대행",
    choose: "선택",
  },
  jp: {
    title: "バダル・ハッジ＆ウムラ",
    subtitle: "信頼できるサービス",
    tabUmrah: "ウムラ",
    tabHaji: "ハッジ",
    by: "代行",
    choose: "選択",
  },
};

export default function BadalPage() {
  const { locale } = useI18n();
  const safeLocale = (BADAL_DATA[locale] ? locale : "id") as LocaleCode;

  const t = UI_TEXT[safeLocale];

  // STATE
  const [activeTab, setActiveTab] = useState<ServiceType>("umrah");
  const [selectedPackage, setSelectedPackage] = useState<BadalPackage | null>(
    null,
  );

  // FILTER DATA
  const displayedPackages = useMemo(() => {
    const raw = BADAL_DATA[safeLocale] || BADAL_DATA.id;
    return raw.filter((item) => item.type === activeTab);
  }, [safeLocale, activeTab]);

  // RENDER DETAIL
  if (selectedPackage) {
    return (
      <BadalDetail
        pkg={selectedPackage}
        locale={safeLocale}
        onBack={() => setSelectedPackage(null)}
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
        {/* Header & Hero */}
        <div className="bg-awqaf-primary pb-8 rounded-b-[32px] shadow-lg overflow-hidden relative">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

          <div className="px-4 pt-4 relative z-10">
            {/* Top Bar */}
            <div className="flex items-center gap-3 mb-6">
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

            {/* Trust Banner/Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex items-start gap-3">
              <div className="bg-awqaf-secondary p-2 rounded-lg text-awqaf-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">
                  Terpercaya & Amanah
                </h3>
                <p className="text-white/80 text-xs leading-relaxed">
                  {safeLocale === "en"
                    ? "Performed by students and scholars residing in the Holy Land."
                    : "Dilaksanakan oleh penuntut ilmu dan asatidz yang bermukim di Tanah Suci."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher (Floating overlapping header) */}
        <div className="px-4 -mt-6 relative z-20">
          <div className="bg-white rounded-xl shadow-md p-1.5 flex gap-1 border border-slate-100">
            <button
              onClick={() => setActiveTab("umrah")}
              className={`flex-1 py-3 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300 flex items-center justify-center gap-2
                  ${
                    activeTab === "umrah"
                      ? "bg-awqaf-primary text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50"
                  }
                `}
            >
              <Plane
                className={`w-4 h-4 ${activeTab === "umrah" ? "text-awqaf-secondary" : "text-slate-400"}`}
              />
              {t.tabUmrah}
            </button>
            <button
              onClick={() => setActiveTab("haji")}
              className={`flex-1 py-3 rounded-lg text-sm font-bold font-comfortaa transition-all duration-300 flex items-center justify-center gap-2
                  ${
                    activeTab === "haji"
                      ? "bg-awqaf-primary text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50"
                  }
                `}
            >
              <HeartHandshake
                className={`w-4 h-4 ${activeTab === "haji" ? "text-awqaf-secondary" : "text-slate-400"}`}
              />
              {t.tabHaji}
            </button>
          </div>
        </div>

        {/* List Content */}
        <main className="px-5 py-6 space-y-4">
          {displayedPackages.length > 0 ? (
            displayedPackages.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPackage(item)}
                className="group cursor-pointer"
              >
                <Card className="border-none shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white ring-1 ring-slate-100 rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Left Side: Color Bar */}
                      <div
                        className={`w-2 ${item.type === "haji" ? "bg-awqaf-secondary" : "bg-awqaf-primary"}`}
                      ></div>

                      {/* Main Content */}
                      <div className="p-5 flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider"
                          >
                            {item.type}
                          </Badge>
                          <p className="font-bold text-awqaf-primary text-base">
                            {item.priceDisplay}
                          </p>
                        </div>

                        <h3 className="font-bold text-slate-800 text-lg mb-2 font-comfortaa line-clamp-1 group-hover:text-awqaf-primary transition-colors">
                          {item.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                          <Users className="w-3.5 h-3.5 text-awqaf-secondary" />
                          <span className="truncate">
                            {t.by}: {item.executor}
                          </span>
                        </div>

                        {/* Features Preview */}
                        <div className="flex gap-2 mb-4">
                          {item.features.slice(0, 2).map((feat, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1 bg-accent-50 px-2 py-1 rounded-md border border-accent-100"
                            >
                              <FileCheck className="w-3 h-3 text-awqaf-primary" />
                              <span className="text-[10px] text-slate-700 font-medium">
                                {feat}
                              </span>
                            </div>
                          ))}
                          {item.features.length > 2 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{item.features.length - 2}
                            </span>
                          )}
                        </div>

                        <Button
                          size="sm"
                          className="w-full h-9 rounded-lg bg-white border border-awqaf-primary text-awqaf-primary hover:bg-awqaf-primary hover:text-white font-bold text-xs transition-colors"
                        >
                          {t.choose}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400">
              <HeartHandshake className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Belum ada paket tersedia saat ini.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}