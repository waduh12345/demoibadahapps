"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Heart,
  Share2,
  Copy,
  CheckCircle,
  ArrowLeft,
  Crown,
  Sparkles,
  BookOpen,
  Gift,
  Quote,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/app/hooks/useI18n";
import {
  useGetAsmaulHusnaQuery,
  AsmaulHusna,
} from "@/services/public/asmaul-husna.service";
import { getStaticContent } from "./data-static";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface PageTranslations {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  favoritesOnly: string;
  showAll: string;
  notFoundTitle: string;
  notFoundDesc: string;
  viewDetail: string;
  close: string;
  explanation: string;
  benefits: string;
  dalil: string;
  shareSuccess: string;
  copySuccess: string;
  heroQuote: string;
}

// --- UI TRANSLATION ---
const ASMAUL_UI_TEXT: Record<LocaleCode, PageTranslations> = {
  id: {
    title: "Asmaul Husna",
    subtitle: "99 Nama Allah Yang Indah",
    searchPlaceholder: "Cari nama Allah...",
    favoritesOnly: "Favorit Saya",
    showAll: "Tampilkan Semua",
    notFoundTitle: "Tidak ditemukan",
    notFoundDesc: "Coba kata kunci lain",
    viewDetail: "Lihat Detail",
    close: "Tutup",
    explanation: "Penjelasan",
    benefits: "Keutamaan Mengamalkan",
    dalil: "Dalil",
    shareSuccess: "Berhasil dibagikan",
    copySuccess: "Disalin",
    heroQuote:
      "Hanya milik Allah asmaulhusna, maka bermohonlah kepada-Nya dengan menyebut asmaulhusna itu...",
  },
  en: {
    title: "Asmaul Husna",
    subtitle: "99 Beautiful Names of Allah",
    searchPlaceholder: "Search names...",
    favoritesOnly: "My Favorites",
    showAll: "Show All",
    notFoundTitle: "Not Found",
    notFoundDesc: "Try another keyword",
    viewDetail: "View Detail",
    close: "Close",
    explanation: "Explanation",
    benefits: "Benefits of Recitation",
    dalil: "Evidence (Dalil)",
    shareSuccess: "Shared successfully",
    copySuccess: "Copied",
    heroQuote: "And to Allah belong the best names, so invoke Him by them...",
  },
  ar: {
    title: "الأسماء الحسنى",
    subtitle: "٩٩ اسماً من أسماء الله الحسنى",
    searchPlaceholder: "بحث عن الاسم...",
    favoritesOnly: "مفضلاتي",
    showAll: "عرض الكل",
    notFoundTitle: "لم يتم العثور عليه",
    notFoundDesc: "جرب كلمة مفتاحية أخرى",
    viewDetail: "عرض التفاصيل",
    close: "إغلاق",
    explanation: "التفسير",
    benefits: "فضل الذكر",
    dalil: "الدليل",
    shareSuccess: "تمت المشاركة بنجاح",
    copySuccess: "تم النسخ",
    heroQuote: "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا",
  },
  fr: {
    title: "Asmaul Husna",
    subtitle: "99 Beaux Noms d'Allah",
    searchPlaceholder: "Rechercher des noms...",
    favoritesOnly: "Mes Favoris",
    showAll: "Tout afficher",
    notFoundTitle: "Introuvable",
    notFoundDesc: "Essayez un autre mot-clé",
    viewDetail: "Voir les détails",
    close: "Fermer",
    explanation: "Explication",
    benefits: "Bienfaits",
    dalil: "Preuve (Dalil)",
    shareSuccess: "Partagé avec succès",
    copySuccess: "Copié",
    heroQuote:
      "C'est à Allah qu'appartiennent les noms les plus beaux. Invoquez-Le par ces noms...",
  },
  kr: {
    title: "아스마울 후스나",
    subtitle: "알라의 99가지 아름다운 이름",
    searchPlaceholder: "이름 검색...",
    favoritesOnly: "즐겨찾기",
    showAll: "모두 보기",
    notFoundTitle: "찾을 수 없음",
    notFoundDesc: "다른 키워드로 시도하세요",
    viewDetail: "상세 보기",
    close: "닫기",
    explanation: "설명",
    benefits: "암송의 유익",
    dalil: "증거 (Dalil)",
    shareSuccess: "공유 성공",
    copySuccess: "복사됨",
    heroQuote:
      "가장 아름다운 이름들은 알라의 것이니, 그 이름들로 그분을 부르라...",
  },
  jp: {
    title: "アスマウル・フスナ",
    subtitle: "アッラーの99の美名",
    searchPlaceholder: "名前を検索...",
    favoritesOnly: "お気に入り",
    showAll: "すべて表示",
    notFoundTitle: "見つかりません",
    notFoundDesc: "別のキーワードを試してください",
    viewDetail: "詳細を見る",
    close: "閉じる",
    explanation: "解説",
    benefits: "唱える利点",
    dalil: "証拠 (Dalil)",
    shareSuccess: "共有しました",
    copySuccess: "コピーしました",
    heroQuote:
      "最も美しい御名はアッラーに属する。それゆえ、それらの御名でかれを呼びなさい...",
  },
};

export default function AsmaulHusnaPage() {
  const { locale } = useI18n();
  const safeLocale = (
    ASMAUL_UI_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = ASMAUL_UI_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedAsma, setSelectedAsma] = useState<AsmaulHusna | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { data: asmaulHusnaData, isLoading } = useGetAsmaulHusnaQuery();

  useEffect(() => {
    const savedFavorites = localStorage.getItem("asmaul-husna-favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "asmaul-husna-favorites",
      JSON.stringify([...favorites]),
    );
  }, [favorites]);

  // --- HELPER: Combine API & Static Data ---
  const getFullContent = (item: AsmaulHusna) => {
    // 1. Get dynamic content from API
    let dynamicContent = { meaning: "", description: "" };
    const localized = item.translations.find((t) => t.locale === locale);
    const idFallback = item.translations.find((t) => t.locale === "id");

    if (localized) {
      dynamicContent = {
        meaning: localized.meaning,
        description: localized.description,
      };
    } else if (idFallback) {
      dynamicContent = {
        meaning: idFallback.meaning,
        description: idFallback.description,
      };
    } else if (item.translations.length > 0) {
      dynamicContent = {
        meaning: item.translations[0].meaning,
        description: item.translations[0].description,
      };
    }

    // 2. Get static content (Benefits & Dalil) from local file
    const staticContent = getStaticContent(item.id, locale);

    return { ...dynamicContent, ...staticContent };
  };

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const filteredAsmaulHusna = useMemo(() => {
    if (!asmaulHusnaData) return [];

    let result = asmaulHusnaData;

    if (showFavoritesOnly) {
      result = result.filter((item) => favorites.has(item.id));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => {
        const content = getFullContent(item);
        const cleanMeaning = stripHtml(content.meaning).toLowerCase();

        return (
          item.name_latin.toLowerCase().includes(q) ||
          item.name_arabic.includes(q) ||
          cleanMeaning.includes(q)
        );
      });
    }

    return result;
  }, [asmaulHusnaData, searchQuery, showFavoritesOnly, favorites, locale]);

  const handleToggleFavorite = (itemId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const handleShareAsma = async (item: AsmaulHusna, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const content = getFullContent(item);
    const cleanMeaning = stripHtml(content.meaning).trim();
    const cleanDesc = stripHtml(content.description).trim();
    const cleanBenefits = stripHtml(content.benefits).trim();
    const cleanDalil = stripHtml(content.dalil).trim();

    // Format text for sharing
    const text = `*${item.number}. ${item.name_arabic} - ${item.name_latin}*\n\n"${cleanMeaning}"\n\n*${t.explanation}:*\n${cleanDesc}\n\n*${t.benefits}:*\n${cleanBenefits}\n\n*${t.dalil}:*\n${cleanDalil}\n\nVia IbadahApp`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Asmaul Husna - ${item.name_latin}`,
          text: text,
        });
      } catch (err) {
        console.error("Failed to share:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleOpenDetail = (item: AsmaulHusna) => {
    setSelectedAsma(item);
    setIsDetailOpen(true);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200 ${isRtl ? "rotate-180" : ""}`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t.title}
                </h1>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {t.subtitle}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`w-10 h-10 p-0 rounded-full transition-colors duration-200 ${showFavoritesOnly ? "bg-red-100 text-red-600" : "hover:bg-accent-100 hover:text-awqaf-primary"}`}
              >
                <Heart
                  className={`w-5 h-5 ${showFavoritesOnly ? "fill-red-600" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Hero Card */}
        <Card className="border-awqaf-border-light bg-gradient-to-br from-awqaf-primary to-awqaf-primary/80 text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 opacity-10">
              <Crown className="w-32 h-32 -mt-4 -mr-4" />
            </div>
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-bold font-arabic mb-4">
                وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا
              </h2>
              <p className="text-sm font-comfortaa opacity-90 leading-relaxed mb-4">
                &quot;{t.heroQuote}&quot;
                <br />
                <span className="text-xs opacity-75">{`(QS. Al-A'raf: 180)`}</span>
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>{favorites.size}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="relative">
              <Search
                className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary ${isRtl ? "right-3" : "left-3"}`}
              />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`font-comfortaa ${isRtl ? "pr-10" : "pl-10"}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
          </div>
        )}

        {/* List */}
        {!isLoading && (
          <div className="grid grid-cols-2 gap-3">
            {filteredAsmaulHusna.map((item) => {
              const content = getFullContent(item);
              return (
                <Card
                  key={item.id}
                  className="border-awqaf-border-light hover:shadow-lg hover:border-awqaf-primary/30 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleOpenDetail(item)}
                >
                  <CardContent className="p-4 space-y-3 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="text-xs font-bold bg-awqaf-primary text-white"
                      >
                        {item.number}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleToggleFavorite(item.id, e)}
                        className="p-1 h-6 w-6"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorites.has(item.id)
                              ? "fill-red-500 text-red-500"
                              : "text-awqaf-foreground-secondary group-hover:text-awqaf-primary"
                          }`}
                        />
                      </Button>
                    </div>

                    <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-3 rounded-xl flex-1 flex items-center justify-center">
                      <p className="text-xl font-arabic text-awqaf-primary text-center">
                        {item.name_arabic}
                      </p>
                    </div>

                    <div className="space-y-1 text-center">
                      <p className="text-sm font-semibold text-card-foreground font-comfortaa">
                        {item.name_latin}
                      </p>
                      <div
                        className="text-xs text-awqaf-foreground-secondary font-comfortaa line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: content.meaning }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredAsmaulHusna.length === 0 && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                {t.notFoundTitle}
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {t.notFoundDesc}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent
          className="max-w-md max-h-[90vh] overflow-y-auto p-0 border-none"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {selectedAsma &&
            (() => {
              const content = getFullContent(selectedAsma);
              return (
                <>
                  <DialogHeader className="sticky top-0 bg-gradient-to-br from-awqaf-primary to-awqaf-primary/90 text-white p-6 pb-8 z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-white/20 text-white border-none">
                        #{selectedAsma.number}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) =>
                            handleToggleFavorite(selectedAsma.id, e)
                          }
                          className="text-white hover:bg-white/20"
                        >
                          <Heart
                            className={`w-5 h-5 ${favorites.has(selectedAsma.id) ? "fill-white" : ""}`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleShareAsma(selectedAsma, e)}
                          className="text-white hover:bg-white/20"
                        >
                          {copiedId === selectedAsma.id ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Share2 className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-5xl font-arabic mb-4 drop-shadow-md">
                        {selectedAsma.name_arabic}
                      </p>
                      <DialogTitle className="text-2xl font-comfortaa mb-2 font-bold">
                        {selectedAsma.name_latin}
                      </DialogTitle>
                      <div
                        className="text-white/90 font-comfortaa text-sm"
                        dangerouslySetInnerHTML={{ __html: content.meaning }}
                      />
                    </div>
                  </DialogHeader>

                  <div className="p-6 space-y-6 bg-white">
                    {/* Explanation */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-awqaf-primary" />
                        <h4 className="font-semibold text-card-foreground font-comfortaa">
                          {t.explanation}
                        </h4>
                      </div>
                      <div
                        className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed text-justify"
                        dangerouslySetInnerHTML={{
                          __html: content.description,
                        }}
                      />
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5 text-awqaf-primary" />
                        <h4 className="font-semibold text-card-foreground font-comfortaa">
                          {t.benefits}
                        </h4>
                      </div>
                      <Card className="border-awqaf-border-light bg-accent-50">
                        <CardContent className="p-4">
                          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed">
                            {content.benefits}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Dalil */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Quote className="w-5 h-5 text-awqaf-primary" />
                        <h4 className="font-semibold text-card-foreground font-comfortaa">
                          {t.dalil}
                        </h4>
                      </div>
                      <Card className="border-awqaf-primary/30 bg-gradient-to-br from-awqaf-primary/5 to-awqaf-primary/10">
                        <CardContent className="p-4">
                          <p className="text-sm text-awqaf-primary font-comfortaa leading-relaxed italic">
                            {content.dalil}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Close Button */}
                    <Button
                      onClick={() => setIsDetailOpen(false)}
                      className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa"
                    >
                      {t.close}
                    </Button>
                  </div>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}