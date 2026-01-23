"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  MessageCircleQuestion, // Icon Tanya
  MessageSquareQuote, // Icon Jawab/Fatwa
  User, // Icon Penanya/Syaikh
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// Import komponen detail
import FatwaDetail from "./fatwa-detail";

// --- 1. DEFINISI TIPE DATA (Strict Types) ---
export type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface FatwaItem {
  id: string;
  question: string;
  answer: string; // HTML string
  sheikh: string; // Nama Syaikh/Ulama
  category: "ibadah" | "muamalah" | "aqidah" | "adab";
  topic: string; // Label topik singkat
}

interface UIText {
  title: string;
  subtitle: string;
  search: string;
  all: string;
  read: string;
  noData: string;
}

interface CategoryNames {
  ibadah: string;
  muamalah: string;
  aqidah: string;
  adab: string;
}

// --- 2. DATA DUMMY (6 BAHASA) ---
const FATWA_DATA: Record<LocaleCode, FatwaItem[]> = {
  id: [
    {
      id: "1",
      question: "Apa hukum menggunakan inhaler bagi orang yang berpuasa?",
      answer:
        "<p>Menggunakan inhaler (obat semprot asma) tidak membatalkan puasa menurut pendapat yang lebih kuat, karena zat yang masuk ke paru-paru bukan berupa makanan atau minuman, melainkan gas/udara untuk membuka saluran pernafasan.</p>",
      sheikh: "Syaikh Ibnu Utsaimin",
      category: "ibadah",
      topic: "Puasa",
    },
    {
      id: "2",
      question: "Bolehkah membeli barang dengan sistem kredit (cicilan)?",
      answer:
        "<p>Membeli barang dengan cara kredit diperbolehkan (halal) selama harga kesepakatan jelas di awal, tempo pembayaran jelas, dan barang sudah dimiliki oleh penjual sebelum akad dilakukan.</p>",
      sheikh: "Syaikh Bin Baz",
      category: "muamalah",
      topic: "Jual Beli",
    },
    {
      id: "3",
      question: "Bagaimana hukum jimat dalam Islam?",
      answer:
        "<p>Menggunakan jimat dengan keyakinan bahwa benda tersebut dapat menolak bala atau mendatangkan manfaat adalah perbuatan syirik. Seorang muslim harus bertawakal hanya kepada Allah.</p>",
      sheikh: "Lajnah Daimah",
      category: "aqidah",
      topic: "Tauhid",
    },
  ],
  en: [
    {
      id: "1",
      question: "Ruling on using an inhaler while fasting?",
      answer:
        "<p>Using an inhaler does not invalidate the fast according to the stronger opinion...</p>",
      sheikh: "Shaykh Ibn Uthaymeen",
      category: "ibadah",
      topic: "Fasting",
    },
    {
      id: "2",
      question: "Is buying on installment permissible?",
      answer:
        "<p>Buying goods on credit/installment is permissible provided the price is fixed...</p>",
      sheikh: "Shaykh Bin Baz",
      category: "muamalah",
      topic: "Trade",
    },
  ],
  ar: [
    {
      id: "1",
      question: "ما حكم استعمال بخاخ الربو للصائم؟",
      answer:
        "<p>استعمال بخاخ الربو لا يفطر الصائم لأنه غاز يذهب للرئة وليس طعاماً...</p>",
      sheikh: "الشيخ ابن عثيمين",
      category: "ibadah",
      topic: "الصيام",
    },
    {
      id: "2",
      question: "هل يجوز البيع بالتقسيط؟",
      answer:
        "<p>البيع بالتقسيط جائز بشرط أن يكون الثمن معلوماً والأجل معلوماً...</p>",
      sheikh: "الشيخ ابن باز",
      category: "muamalah",
      topic: "البيوع",
    },
  ],
  fr: [
    {
      id: "1",
      question: "Jugement sur l'utilisation d'un inhalateur pendant le jeûne ?",
      answer: "<p>L'utilisation d'un inhalateur n'invalide pas le jeûne...</p>",
      sheikh: "Cheikh Ibn Uthaymin",
      category: "ibadah",
      topic: "Jeûne",
    },
  ],
  kr: [
    {
      id: "1",
      question: "단식 중 흡입기 사용에 대한 판결은?",
      answer: "<p>흡입기 사용은 단식을 무효화하지 않습니다...</p>",
      sheikh: "셰이크 이븐 우타이민",
      category: "ibadah",
      topic: "단식",
    },
  ],
  jp: [
    {
      id: "1",
      question: "断食中の吸入器使用についての規定は？",
      answer: "<p>吸入器の使用は断食を無効にしません...</p>",
      sheikh: "シェイク・イブン・ウサイミーン",
      category: "ibadah",
      topic: "断食",
    },
  ],
};

// Fallback untuk data kosong di dummy
const getSafeData = (locale: string): FatwaItem[] => {
  return FATWA_DATA[locale as LocaleCode] || FATWA_DATA.id;
};

// --- 3. UI TEXT DICTIONARY ---
const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Fatwa Ulama",
    subtitle: "Kumpulan Tanya Jawab",
    search: "Cari topik...",
    all: "Semua",
    read: "Lihat Jawaban",
    noData: "Fatwa tidak ditemukan",
  },
  en: {
    title: "Scholars' Fatwa",
    subtitle: "Q&A Collection",
    search: "Search topic...",
    all: "All",
    read: "See Answer",
    noData: "No fatwa found",
  },
  ar: {
    title: "فتاوى العلماء",
    subtitle: "مجموعة أسئلة وأجوبة",
    search: "بحث...",
    all: "الكل",
    read: "انظر الإجابة",
    noData: "لا توجد فتاوى",
  },
  fr: {
    title: "Fatwas des Savants",
    subtitle: "Collection Q&R",
    search: "Rechercher...",
    all: "Tout",
    read: "Voir la réponse",
    noData: "Aucune fatwa trouvée",
  },
  kr: {
    title: "학자들의 파트와",
    subtitle: "Q&A 모음",
    search: "검색...",
    all: "전체",
    read: "답변 보기",
    noData: "결과 없음",
  },
  jp: {
    title: "学者のファトワ",
    subtitle: "Q&Aコレクション",
    search: "検索...",
    all: "すべて",
    read: "回答を見る",
    noData: "見つかりません",
  },
};

const CATEGORIES: Record<LocaleCode, CategoryNames> = {
  id: {
    ibadah: "Ibadah",
    muamalah: "Muamalah",
    aqidah: "Aqidah",
    adab: "Adab",
  },
  en: {
    ibadah: "Worship",
    muamalah: "Transaction",
    aqidah: "Creed",
    adab: "Etiquette",
  },
  ar: {
    ibadah: "العبادات",
    muamalah: "المعاملات",
    aqidah: "العقيدة",
    adab: "الآداب",
  },
  fr: {
    ibadah: "Culte",
    muamalah: "Transactions",
    aqidah: "Croyance",
    adab: "Éthique",
  },
  kr: { ibadah: "예배", muamalah: "거래", aqidah: "신조", adab: "에티켓" },
  jp: { ibadah: "礼拝", muamalah: "取引", aqidah: "信条", adab: "作法" },
};

export default function FatwaPage() {
  const { locale } = useI18n();
  // Safe Locale Access
  const safeLocale = (
    UI_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;

  const t = UI_TEXT[safeLocale];
  const cats = CATEGORIES[safeLocale];

  // STATE
  const [selectedFatwa, setSelectedFatwa] = useState<FatwaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // FILTER LOGIC
  const displayedData = useMemo(() => {
    const raw = getSafeData(safeLocale);
    return raw.filter((item) => {
      const matchCat =
        activeCategory === "all" || item.category === activeCategory;
      const matchSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [safeLocale, activeCategory, searchQuery]);

  // --- RENDER DETAIL ---
  if (selectedFatwa) {
    return (
      <FatwaDetail
        item={selectedFatwa}
        locale={safeLocale}
        onBack={() => setSelectedFatwa(null)}
        catLabel={cats[selectedFatwa.category]}
      />
    );
  }

  // --- RENDER LIST ---
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100"
      dir={safeLocale === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-md mx-auto min-h-screen bg-transparent relative pb-20">
        {/* Header */}
        <header className="bg-background/80 backdrop-blur-md shadow-sm border-b border-awqaf-border-light sticky top-0 z-30">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-accent-100 text-awqaf-primary"
                >
                  <ArrowLeft
                    className={`w-5 h-5 ${safeLocale === "ar" ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa leading-none">
                  {t.title}
                </h1>
                <p className="text-[10px] text-gray-500 font-comfortaa mt-1">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                className={`absolute ${safeLocale === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`}
              />
              <Input
                placeholder={t.search}
                className={`${safeLocale === "ar" ? "pr-9 pl-4" : "pl-9 pr-4"} bg-white border-awqaf-border-light rounded-xl h-10 text-sm`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories Tabs */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
            {[
              { id: "all", label: t.all },
              { id: "aqidah", label: cats.aqidah },
              { id: "ibadah", label: cats.ibadah },
              { id: "muamalah", label: cats.muamalah },
              { id: "adab", label: cats.adab },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    px-4 py-1.5 rounded-full text-xs font-bold font-comfortaa whitespace-nowrap transition-all duration-200 border
                    ${
                      isActive
                        ? "bg-awqaf-primary text-white border-awqaf-primary shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }
                  `}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* List Content */}
        <main className="px-4 py-4 space-y-3">
          {displayedData.length > 0 ? (
            displayedData.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedFatwa(item)}
                className="cursor-pointer"
              >
                <Card className="border-awqaf-border-light hover:shadow-md hover:bg-white/80 transition-all active:scale-[0.99] bg-white group rounded-xl">
                  <CardContent className="p-4">
                    {/* Tags & Topic */}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 px-1.5 border-awqaf-primary/30 text-awqaf-primary bg-accent-50 font-normal"
                      >
                        {cats[item.category] || item.category}
                      </Badge>
                      <span className="text-[10px] text-gray-400">•</span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {item.topic}
                      </span>
                    </div>

                    {/* Question */}
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <MessageCircleQuestion className="w-5 h-5 text-awqaf-secondary" />
                      </div>
                      <h3 className="font-bold text-awqaf-primary font-comfortaa text-sm leading-relaxed line-clamp-2">
                        {item.question}
                      </h3>
                    </div>

                    {/* Footer Card */}
                    <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">
                          {item.sheikh}
                        </span>
                      </div>
                      <div className="flex items-center text-[10px] font-bold text-awqaf-primary group-hover:underline">
                        {t.read}
                        <ChevronRight
                          className={`w-3 h-3 ${safeLocale === "ar" ? "mr-1 rotate-180" : "ml-1"}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white border border-dashed border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 font-comfortaa">{t.noData}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}