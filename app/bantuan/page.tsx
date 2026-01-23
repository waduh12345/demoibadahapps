"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  HelpCircle,
  MessageCircle,
  ChevronRight,
  FileQuestion,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/app/hooks/useI18n";

// Import Detail
import HelpDetail from "./detail";

// --- 1. TYPES ---
export type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface HelpItem {
  id: string;
  category: "app" | "prayer" | "quran" | "account";
  question: string;
  answer: string; // HTML string
}

interface UIText {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  cantFind: string;
  contactUs: string;
  categories: {
    app: string;
    prayer: string;
    quran: string;
    account: string;
  };
}

// --- 2. DATA DUMMY ---
const HELP_DATA: Record<LocaleCode, HelpItem[]> = {
  id: [
    {
      id: "1",
      category: "prayer",
      question: "Mengapa waktu shalat tidak sesuai?",
      answer:
        "<p>Waktu shalat dapat berbeda tergantung pada metode perhitungan yang dipilih (Kemenag, Muhammadiyah, atau Liga Dunia Islam). Silakan cek menu <strong>Pengaturan > Metode Perhitungan</strong> untuk menyesuaikan.</p>",
    },
    {
      id: "2",
      category: "quran",
      question: "Bagaimana cara mengunduh audio Al-Quran?",
      answer:
        "<p>Masuk ke halaman Surah, ketuk ikon <strong>Unduh</strong> di pojok kanan atas. Pastikan koneksi internet Anda stabil.</p>",
    },
    {
      id: "3",
      category: "app",
      question: "Aplikasi tidak mengeluarkan suara Adzan",
      answer:
        "<p>Pastikan izin notifikasi diaktifkan di pengaturan HP Anda. Cek juga apakah mode 'Jangan Ganggu' sedang aktif.</p>",
    },
  ],
  en: [
    {
      id: "1",
      category: "prayer",
      question: "Why are prayer times incorrect?",
      answer:
        "<p>Prayer times vary based on the calculation method selected. Please check <strong>Settings > Calculation Method</strong>.</p>",
    },
    {
      id: "2",
      category: "quran",
      question: "How to download Quran audio?",
      answer:
        "<p>Go to the Surah page and tap the <strong>Download</strong> icon.</p>",
    },
  ],
  ar: [
    {
      id: "1",
      category: "prayer",
      question: "لماذا أوقات الصلاة غير صحيحة؟",
      answer:
        "<p>تختلف أوقات الصلاة حسب طريقة الحساب المختارة. يرجى التحقق من الإعدادات.</p>",
    },
  ],
  fr: [
    {
      id: "1",
      category: "prayer",
      question: "Pourquoi les horaires de prière sont incorrects ?",
      answer: "<p>...</p>",
    },
  ],
  kr: [
    {
      id: "1",
      category: "prayer",
      question: "기도 시간이 왜 맞지 않나요?",
      answer: "<p>...</p>",
    },
  ],
  jp: [
    {
      id: "1",
      category: "prayer",
      question: "祈りの時間が正しくないのはなぜですか？",
      answer: "<p>...</p>",
    },
  ],
};

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Bantuan",
    subtitle: "Pusat Informasi",
    searchPlaceholder: "Cari kendala...",
    cantFind: "Tidak menemukan jawaban?",
    contactUs: "Hubungi Kami",
    categories: {
      app: "Aplikasi",
      prayer: "Shalat",
      quran: "Al-Quran",
      account: "Akun",
    },
  },
  en: {
    title: "Help Center",
    subtitle: "Support & FAQ",
    searchPlaceholder: "Search issues...",
    cantFind: "Can't find answer?",
    contactUs: "Contact Us",
    categories: {
      app: "App",
      prayer: "Prayer",
      quran: "Quran",
      account: "Account",
    },
  },
  ar: {
    title: "المساعدة",
    subtitle: "مركز الدعم",
    searchPlaceholder: "بحث...",
    cantFind: "لم تجد إجابة؟",
    contactUs: "اتصل بنا",
    categories: {
      app: "التطبيق",
      prayer: "الصلاة",
      quran: "القرآن",
      account: "الحساب",
    },
  },
  fr: {
    title: "Aide",
    subtitle: "Support",
    searchPlaceholder: "Rechercher...",
    cantFind: "Pas de réponse ?",
    contactUs: "Contactez-nous",
    categories: {
      app: "App",
      prayer: "Prière",
      quran: "Coran",
      account: "Compte",
    },
  },
  kr: {
    title: "고객센터",
    subtitle: "지원 및 FAQ",
    searchPlaceholder: "검색...",
    cantFind: "답을 찾을 수 없나요?",
    contactUs: "문의하기",
    categories: { app: "앱", prayer: "기도", quran: "꾸란", account: "계정" },
  },
  jp: {
    title: "ヘルプ",
    subtitle: "サポート",
    searchPlaceholder: "検索...",
    cantFind: "見つかりませんか？",
    contactUs: "お問い合わせ",
    categories: {
      app: "アプリ",
      prayer: "祈り",
      quran: "コーラン",
      account: "アカウント",
    },
  },
};

export default function HelpPage() {
  const { locale } = useI18n();
  const safeLocale = (HELP_DATA[locale] ? locale : "id") as LocaleCode;
  const t = UI_TEXT[safeLocale];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHelp, setSelectedHelp] = useState<HelpItem | null>(null);

  const filteredData = useMemo(() => {
    const raw = HELP_DATA[safeLocale] || HELP_DATA.id;
    return raw.filter((item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [safeLocale, searchQuery]);

  if (selectedHelp) {
    return (
      <HelpDetail
        item={selectedHelp}
        locale={safeLocale}
        onBack={() => setSelectedHelp(null)}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50"
      dir={safeLocale === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-20">
        {/* HEADER */}
        <div className="bg-awqaf-primary pb-8 pt-4 rounded-b-[32px] shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
          <div className="px-4 relative z-10">
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
              <div>
                <h1 className="text-xl font-bold text-white font-comfortaa">
                  {t.title}
                </h1>
                <p className="text-white/80 text-xs font-comfortaa mt-0.5">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search
                className={`absolute ${safeLocale === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`}
              />
              <Input
                placeholder={t.searchPlaceholder}
                className={`bg-white text-slate-800 border-0 h-11 rounded-xl shadow-md ${safeLocale === "ar" ? "pr-10" : "pl-10"}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <main className="px-5 py-6 space-y-4">
          {/* FAQ List */}
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedHelp(item)}
                className="cursor-pointer group"
              >
                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all hover:bg-slate-50 rounded-xl">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-50 flex items-center justify-center text-awqaf-primary">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-700 font-comfortaa text-sm line-clamp-2">
                        {item.question}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-300 group-hover:text-awqaf-primary ${safeLocale === "ar" ? "rotate-180" : ""}`}
                    />
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400">
              <FileQuestion className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tidak ditemukan.</p>
            </div>
          )}

          {/* Contact Support Box */}
          <div className="mt-8 bg-gradient-to-r from-accent-50 to-white p-5 rounded-2xl border border-accent-100 text-center">
            <p className="text-slate-600 font-medium text-sm mb-3">
              {t.cantFind}
            </p>
            <Button className="bg-awqaf-primary hover:bg-awqaf-secondary text-white hover:text-yellow-800 rounded-full w-full shadow-md font-bold">
              <MessageCircle
                className={`w-4 h-4 ${safeLocale === "ar" ? "ml-2" : "mr-2"}`}
              />
              {t.contactUs}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}