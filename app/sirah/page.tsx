"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Scroll,
  Star,
  Heart,
  Users,
  BookOpen,
  ChevronRight,
  Library,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// Import komponen detail
import SirahDetail from "./sirah-detail";

// --- 1. TIPE DATA ---
export type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface SirahStory {
  id: string;
  slug: string;
  title: string;
  category: "nabi" | "muhammad" | "istri" | "sahabat" | "ulama";
  excerpt: string;
  content: string;
}

// Interface untuk Teks UI
interface UIText {
  title: string;
  search: string;
  all: string;
  read: string;
  noData: string;
}

// Interface untuk Nama Kategori
interface CategoryNames {
  nabi: string;
  muhammad: string;
  istri: string;
  sahabat: string;
  ulama: string;
}

// --- 2. DATA SOURCE (6 BAHASA) ---
const SIRAH_DATA: Record<string, SirahStory[]> = {
  id: [
    {
      id: "1",
      slug: "nabi-adam",
      title: "Nabi Adam AS",
      category: "nabi",
      excerpt: "Kisah manusia pertama yang diciptakan Allah SWT.",
      content: `<p>Allah SWT menciptakan Nabi Adam dari tanah liat kering...</p>`,
    },
    {
      id: "2",
      slug: "muhammad-saw",
      title: "Nabi Muhammad SAW",
      category: "muhammad",
      excerpt: "Kisah kelahiran dan masa kecil Rasulullah.",
      content: `<p>Nabi Muhammad SAW lahir di Makkah pada hari Senin, 12 Rabiul Awal...</p>`,
    },
  ],
  en: [
    {
      id: "1",
      slug: "prophet-adam",
      title: "Prophet Adam (AS)",
      category: "nabi",
      excerpt: "The story of the first human created by Allah.",
      content: `<p>Allah created Prophet Adam from clay...</p>`,
    },
    {
      id: "2",
      slug: "prophet-muhammad",
      title: "Prophet Muhammad (PBUH)",
      category: "muhammad",
      excerpt: "The birth and childhood of the Messenger of Allah.",
      content: `<p>Prophet Muhammad was born in Mecca...</p>`,
    },
  ],
  ar: [
    {
      id: "1",
      slug: "adam-as",
      title: "آدم عليه السلام",
      category: "nabi",
      excerpt: "قصة أول إنسان خلقه الله.",
      content: `<p>خلق الله آدم من طين...</p>`,
    },
    {
      id: "2",
      slug: "muhammad-saw",
      title: "النبي محمد ﷺ",
      category: "muhammad",
      excerpt: "مولد ونشأة رسول الله.",
      content: `<p>ولد النبي محمد ﷺ في مكة المكرمة...</p>`,
    },
  ],
  fr: [
    {
      id: "1",
      slug: "prophete-adam",
      title: "Prophète Adam (AS)",
      category: "nabi",
      excerpt: "L'histoire du premier être humain créé par Allah.",
      content: `<p>Allah a créé le prophète Adam à partir d'argile...</p>`,
    },
    {
      id: "2",
      slug: "prophete-muhammad",
      title: "Prophète Muhammad (PBSL)",
      category: "muhammad",
      excerpt: "La naissance et l'enfance du Messager d'Allah.",
      content: `<p>Le Prophète Muhammad est né à La Mecque...</p>`,
    },
  ],
  kr: [
    {
      id: "1",
      slug: "adam-nabi",
      title: "아담 선지자",
      category: "nabi",
      excerpt: "알라가 창조한 최초의 인간 이야기.",
      content: `<p>알라께서 흙으로 아담을 창조하셨습니다...</p>`,
    },
    {
      id: "2",
      slug: "muhammad-nabi",
      title: "무함마드 선지자",
      category: "muhammad",
      excerpt: "알라의 사자의 탄생과 어린 시절.",
      content: `<p>무함마드 선지자는 메카에서 태어났습니다...</p>`,
    },
  ],
  jp: [
    {
      id: "1",
      slug: "adam-yogensha",
      title: "預言者アダム",
      category: "nabi",
      excerpt: "アッラーによって創造された最初の人間。",
      content: `<p>アッラーは粘土からアダムを創造されました...</p>`,
    },
    {
      id: "2",
      slug: "muhammad-yogensha",
      title: "預言者ムハンマド",
      category: "muhammad",
      excerpt: "アッラーの使徒の誕生と幼少期。",
      content: `<p>預言者ムハンマドはメッカで生まれました...</p>`,
    },
  ],
};

// --- 3. DICTIONARY TRANSLATION ---
// Menggunakan Record<string, UIText> agar type-safe
const UI_TEXT: Record<string, UIText> = {
  id: {
    title: "Sirah Nabawiyah",
    search: "Cari kisah...",
    all: "Semua",
    read: "Baca",
    noData: "Tidak ditemukan",
  },
  en: {
    title: "Islamic History",
    search: "Search stories...",
    all: "All",
    read: "Read",
    noData: "Not found",
  },
  ar: {
    title: "السيرة النبوية",
    search: "بحث...",
    all: "الكل",
    read: "اقرأ",
    noData: "غير موجود",
  },
  fr: {
    title: "Histoire Islamique",
    search: "Rechercher...",
    all: "Tout",
    read: "Lire",
    noData: "Introuvable",
  },
  kr: {
    title: "이슬람 역사",
    search: "검색...",
    all: "전체",
    read: "읽기",
    noData: "찾을 수 없음",
  },
  jp: {
    title: "イスラムの歴史",
    search: "検索...",
    all: "すべて",
    read: "読む",
    noData: "見つかりません",
  },
};

// Menggunakan Record<string, CategoryNames> agar type-safe
const CATEGORY_NAMES: Record<string, CategoryNames> = {
  id: {
    nabi: "Nabi",
    muhammad: "Muhammad SAW",
    istri: "Istri",
    sahabat: "Sahabat",
    ulama: "Ulama",
  },
  en: {
    nabi: "Prophets",
    muhammad: "Muhammad PBUH",
    istri: "Wives",
    sahabat: "Companions",
    ulama: "Scholars",
  },
  ar: {
    nabi: "الأنبياء",
    muhammad: "محمد ﷺ",
    istri: "الزوجات",
    sahabat: "الصحابة",
    ulama: "العلماء",
  },
  fr: {
    nabi: "Prophètes",
    muhammad: "Muhammad PBSL",
    istri: "Épouses",
    sahabat: "Compagnons",
    ulama: "Savants",
  },
  kr: {
    nabi: "선지자",
    muhammad: "무함마드",
    istri: "아내",
    sahabat: "동료",
    ulama: "학자",
  },
  jp: {
    nabi: "預言者",
    muhammad: "ムハンマド",
    istri: "妻",
    sahabat: "教友",
    ulama: "学者",
  },
};

export default function SirahPage() {
  const { locale } = useI18n();
  // Fallback ke 'id' jika locale tidak ada di data
  // Mengakses object dengan string key aman karena Record<string, ...>
  const safeLocale = SIRAH_DATA[locale] && UI_TEXT[locale] ? locale : "id";

  const t = UI_TEXT[safeLocale];
  const cats = CATEGORY_NAMES[safeLocale];

  // STATE
  const [selectedStory, setSelectedStory] = useState<SirahStory | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // FILTER DATA
  const displayedData = useMemo(() => {
    const raw = SIRAH_DATA[safeLocale] || SIRAH_DATA.id;
    return raw.filter((item) => {
      const matchCat =
        activeCategory === "all" || item.category === activeCategory;
      const matchSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [safeLocale, activeCategory, searchQuery]);

  // JIKA DETAIL STORY DIPILIH
  if (selectedStory) {
    return (
      <SirahDetail
        story={selectedStory}
        locale={safeLocale}
        onBack={() => setSelectedStory(null)}
        // Mengirim label kategori yang sudah diterjemahkan
        // Menggunakan "as keyof CategoryNames" untuk memastikan tipe key benar
        categoryLabel={
          cats[selectedStory.category as keyof CategoryNames] ||
          selectedStory.category
        }
      />
    );
  }

  // TAMPILAN LIST UTAMA
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={safeLocale === "ar" ? "rtl" : "ltr"}
    >
      {/* Container MAX-W-MD */}
      <div className="max-w-md mx-auto min-h-screen bg-transparent relative">
        {/* Header List */}
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
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa flex-1">
                {t.title}
              </h1>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                className={`absolute ${safeLocale === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`}
              />
              <Input
                placeholder={t.search}
                className={`${safeLocale === "ar" ? "pr-9 pl-4" : "pl-9 pr-4"} bg-white border-awqaf-border-light rounded-xl`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories Tabs */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
            {[
              { id: "all", label: t.all, icon: Library },
              { id: "nabi", label: cats.nabi, icon: Scroll },
              { id: "muhammad", label: cats.muhammad, icon: Star },
              { id: "istri", label: cats.istri, icon: Heart },
              { id: "sahabat", label: cats.sahabat, icon: Users },
              { id: "ulama", label: cats.ulama, icon: BookOpen },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-comfortaa whitespace-nowrap transition-all duration-200
                    ${
                      isActive
                        ? "bg-awqaf-primary text-white shadow-md"
                        : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon className="w-3 h-3" />
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
                onClick={() => setSelectedStory(item)}
                className="cursor-pointer"
              >
                <Card className="border-awqaf-border-light hover:shadow-md hover:bg-white/80 transition-all active:scale-[0.99] bg-white group rounded-xl">
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-200 transition-colors">
                      {item.category === "nabi" && (
                        <Scroll className="w-6 h-6 text-awqaf-primary" />
                      )}
                      {item.category === "muhammad" && (
                        <Star className="w-6 h-6 text-awqaf-primary" />
                      )}
                      {item.category === "istri" && (
                        <Heart className="w-6 h-6 text-awqaf-primary" />
                      )}
                      {!["nabi", "muhammad", "istri"].includes(
                        item.category,
                      ) && <BookOpen className="w-6 h-6 text-awqaf-primary" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 px-1.5 border-awqaf-primary/30 text-awqaf-primary bg-accent-50 capitalize"
                        >
                          {/* Casting agar TypeScript tahu item.category adalah key yang valid */}
                          {cats[item.category as keyof CategoryNames] ||
                            item.category}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-awqaf-primary font-comfortaa mb-1 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 font-comfortaa">
                        {item.excerpt}
                      </p>

                      <div className="mt-3 flex items-center text-[10px] font-bold text-awqaf-primary/80 group-hover:text-awqaf-primary">
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
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 font-comfortaa">{t.noData}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}