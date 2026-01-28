"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Languages,
  Plane,
  MessageCircle,
  Volume2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/app/hooks/useI18n";

// --- 1. TIPE DATA & I18N ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";
type CategoryType = "daily" | "travel";
type FilterType = "all" | CategoryType;

interface ArabicWord {
  id: string;
  arabic: string;
  transliteration: string;
  category: CategoryType;
  meanings: Record<LocaleCode, string>;
  example_sentence: Record<LocaleCode, string>;
}

// --- 2. DATA DUMMY (6 BAHASA) ---
const VOCABULARY: ArabicWord[] = [
  {
    id: "ARB-001",
    arabic: "شُكْرًا",
    transliteration: "Syukran",
    category: "daily",
    meanings: {
      id: "Terima Kasih",
      en: "Thank You",
      ar: "شكرًا",
      fr: "Merci",
      kr: "감사합니다",
      jp: "ありがとう",
    },
    example_sentence: {
      id: "Syukran atas bantuanmu.",
      en: "Shukran for your help.",
      ar: "شكرًا على مساعدتك.",
      fr: "Shukran pour votre aide.",
      kr: "도와주셔서 감사합니다 (Shukran).",
      jp: "助けてくれてありがとう (Shukran).",
    },
  },
  {
    id: "ARB-002",
    arabic: "كَيْفَ حَالُكَ؟",
    transliteration: "Kaifa Haluka",
    category: "daily",
    meanings: {
      id: "Apa Kabar?",
      en: "How are you?",
      ar: "كيف حالك؟",
      fr: "Comment ça va ?",
      kr: "어떻게 지내세요?",
      jp: "お元気ですか？",
    },
    example_sentence: {
      id: "Apa kabar wahai saudaraku?",
      en: "How are you, my brother?",
      ar: "كيف حالك يا أخي؟",
      fr: "Comment ça va, mon frère ?",
      kr: "형제여, 어떻게 지내세요?",
      jp: "兄弟、お元気ですか？",
    },
  },
  {
    id: "ARB-003",
    arabic: "فُنْدُق",
    transliteration: "Funduq",
    category: "travel",
    meanings: {
      id: "Hotel",
      en: "Hotel",
      ar: "فندق",
      fr: "Hôtel",
      kr: "호텔",
      jp: "ホテル",
    },
    example_sentence: {
      id: "Di mana hotel terdekat?",
      en: "Where is the nearest hotel?",
      ar: "أين أقرب فندق؟",
      fr: "Où est l'hôtel le plus proche ?",
      kr: "가장 가까운 호텔은 어디입니까?",
      jp: "一番近いホテルはどこですか？",
    },
  },
  {
    id: "ARB-004",
    arabic: "مَطَار",
    transliteration: "Mathar",
    category: "travel",
    meanings: {
      id: "Bandara",
      en: "Airport",
      ar: "مطار",
      fr: "Aéroport",
      kr: "공항",
      jp: "空港",
    },
    example_sentence: {
      id: "Saya pergi ke bandara.",
      en: "I am going to the airport.",
      ar: "أنا ذاهب إلى المطار.",
      fr: "Je vais à l'aéroport.",
      kr: "나는 공항에 갑니다.",
      jp: "私は空港に行きます。",
    },
  },
  {
    id: "ARB-005",
    arabic: "بِكَمْ هَذَا؟",
    transliteration: "Bikam Hadza",
    category: "travel",
    meanings: {
      id: "Berapa harganya?",
      en: "How much is this?",
      ar: "بكم هذا؟",
      fr: "Combien ça coûte ?",
      kr: "이것은 얼마입니까?",
      jp: "これはいくらですか？",
    },
    example_sentence: {
      id: "Berapa harga ini?",
      en: "How much does this cost?",
      ar: "بكم سعر هذا؟",
      fr: "Combien coûte ceci ?",
      kr: "이것의 가격은 얼마입니까?",
      jp: "この価格はいくらですか？",
    },
  },
  {
    id: "ARB-006",
    arabic: "صَبَاحُ الْخَيْر",
    transliteration: "Sabahul Khair",
    category: "daily",
    meanings: {
      id: "Selamat Pagi",
      en: "Good Morning",
      ar: "صباح الخير",
      fr: "Bonjour",
      kr: "좋은 아침",
      jp: "おはようございます",
    },
    example_sentence: {
      id: "Selamat pagi ibuku.",
      en: "Good morning, my mother.",
      ar: "صباح الخير يا أمي.",
      fr: "Bonjour, ma mère.",
      kr: "어머니, 좋은 아침입니다.",
      jp: "お母さん、おはようございます。",
    },
  },
];

// --- 3. UI TEXT DICTIONARY ---
interface UIText {
  title: string;
  searchPlaceholder: string;
  all: string;
  daily: string;
  travel: string;
  example: string;
  noData: string;
}

const UI_TEXTS: Record<LocaleCode, UIText> = {
  id: {
    title: "Belajar Bahasa Arab",
    searchPlaceholder: "Cari kata...",
    all: "Semua",
    daily: "Sehari-hari",
    travel: "Travel",
    example: "Contoh",
    noData: "Kata tidak ditemukan",
  },
  en: {
    title: "Learn Arabic",
    searchPlaceholder: "Search word...",
    all: "All",
    daily: "Daily",
    travel: "Travel",
    example: "Example",
    noData: "Word not found",
  },
  ar: {
    title: "تعلم العربية",
    searchPlaceholder: "بحث...",
    all: "الكل",
    daily: "يومي",
    travel: "سفر",
    example: "مثال",
    noData: "لم يتم العثور على الكلمة",
  },
  fr: {
    title: "Apprendre l'arabe",
    searchPlaceholder: "Chercher un mot...",
    all: "Tout",
    daily: "Quotidien",
    travel: "Voyage",
    example: "Exemple",
    noData: "Mot introuvable",
  },
  kr: {
    title: "아랍어 배우기",
    searchPlaceholder: "단어 검색...",
    all: "전체",
    daily: "일상",
    travel: "여행",
    example: "예시",
    noData: "단어를 찾을 수 없습니다",
  },
  jp: {
    title: "アラビア語を学ぶ",
    searchPlaceholder: "単語を検索...",
    all: "すべて",
    daily: "日常",
    travel: "旅行",
    example: "例",
    noData: "単語が見つかりません",
  },
};

export default function ArabicPage() {
  const { locale } = useI18n();
  const currentLocale = (
    UI_TEXTS[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TEXTS[currentLocale];
  const isRtl = currentLocale === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterType>("all");

  const filteredWords = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return VOCABULARY.filter((item) => {
      const meaning = (
        item.meanings[currentLocale] || item.meanings["id"]
      ).toLowerCase();
      const matchesSearch =
        meaning.includes(query) ||
        item.transliteration.toLowerCase().includes(query) ||
        item.arabic.includes(query);

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, currentLocale]);

  const handlePlayAudio = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      window.speechSynthesis.speak(utterance);
    }
  };

  const filterOptions: {
    id: FilterType;
    label: string;
    icon: React.ElementType | null;
  }[] = [
    { id: "all", label: t.all, icon: null },
    { id: "daily", label: t.daily, icon: MessageCircle },
    { id: "travel", label: t.travel, icon: Plane },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* HEADER: Floating Glass Style */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                >
                  <ArrowLeft
                    className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa flex items-center justify-center gap-2">
                  <Languages className="w-5 h-5 text-awqaf-primary" />
                  {t.title}
                </h1>
              </div>
              <div className="w-10 h-10" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-2 space-y-6">
        {/* Search Widget */}
        <div className="relative">
          <div className="relative bg-white/80 backdrop-blur rounded-xl shadow-sm border border-awqaf-border-light/50 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-awqaf-primary/20 focus-within:border-awqaf-primary">
            <Search
              className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-awqaf-foreground-primary`}
            />
            <Input
              placeholder={t.searchPlaceholder}
              className={`bg-transparent border-0 h-12 focus-visible:ring-0 ${isRtl ? "pr-10 pl-10" : "pl-10 pr-10"} placeholder:text-awqaf-foreground-primary/70 text-awqaf-primary font-comfortaa text-sm`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute ${isRtl ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-accent-100 hover:bg-accent-200 flex items-center justify-center transition-colors`}
              >
                <X className="w-3 h-3 text-awqaf-primary" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-center">
          {filterOptions.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold font-comfortaa transition-all border
                  ${
                    isActive
                      ? "bg-awqaf-primary text-white border-awqaf-primary shadow-md"
                      : "bg-white text-awqaf-foreground-primary border-awqaf-border-light hover:bg-accent-50"
                  }
                `}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Vocabulary List */}
        <div className="space-y-4">
          {filteredWords.length > 0 ? (
            filteredWords.map((item) => (
              <Card
                key={item.id}
                className="border-awqaf-border-light hover:border-awqaf-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden group"
              >
                <CardContent className="p-0">
                  <div className="relative p-5">
                    {/* Header: Category & Audio */}
                    <div className="flex justify-between items-start mb-4">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-2 py-0.5 border-0 font-bold tracking-wide text-white ${
                          item.category === "travel"
                            ? "bg-awqaf-primary"
                            : "bg-awqaf-primary"
                        }`}
                      >
                        {item.category === "travel"
                          ? t.travel.toUpperCase()
                          : t.daily.toUpperCase()}
                      </Badge>
                      <button
                        onClick={() => handlePlayAudio(item.arabic)}
                        className="w-8 h-8 rounded-full bg-accent-50 flex items-center justify-center text-awqaf-primary hover:bg-awqaf-primary hover:text-white transition-all shadow-sm active:scale-90 border border-accent-100"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content: Arabic & Meaning */}
                    <div className="text-center space-y-2">
                      <h2
                        className="text-3xl font-bold text-gray-800 font-serif leading-relaxed drop-shadow-sm"
                        dir="rtl"
                      >
                        {item.arabic}
                      </h2>
                      <div>
                        <p className="text-sm font-bold text-awqaf-primary font-comfortaa">
                          {item.transliteration}
                        </p>
                        <p className="text-lg font-bold text-awqaf-primary font-comfortaa mt-1">
                          {item.meanings[currentLocale] || item.meanings["id"]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer: Example */}
                  <div className="bg-gradient-to-r from-accent-50 to-white p-4 border-t border-awqaf-border-light/50">
                    <div className="flex gap-2 items-start">
                      <div className="mt-0.5 bg-white p-1 rounded-full shadow-sm border border-awqaf-border-light">
                        <BookOpen className="w-3 h-3 text-awqaf-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-awqaf-primary font-bold uppercase tracking-wider mb-0.5 opacity-70">
                          {t.example}
                        </p>
                        <p className="text-xs text-awqaf-foreground-primary font-comfortaa italic leading-relaxed">
                          {`"${
                            item.example_sentence[currentLocale] ||
                            item.example_sentence["id"]
                          }"`}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-awqaf-border-light">
                <Search className="w-8 h-8 text-awqaf-foreground-primary/50" />
              </div>
              <p className="text-sm text-awqaf-foreground-primary font-comfortaa">
                {t.noData}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}