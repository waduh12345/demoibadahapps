"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  Heart,
  BookOpen,
  Loader2,
  Navigation,
  Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetArticleByIdQuery } from "@/services/public/article.service";
import { useI18n } from "@/app/hooks/useI18n";
import { Article, ArticleCategory } from "@/types/public/article";

// --- 1. DEFINISI TIPE ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface TranslationKeys {
  title: string;
  min: string;
  save: string;
  saved: string;
  like: string;
  liked: string;
  readMore: string;
  linkCopied: string;
  notFound: string;
  notFoundDesc: string;
  backToList: string;
  viewAll: string;
}

// --- 2. DICTIONARY TRANSLATION LOKAL ---
const UI_TRANSLATIONS: Record<LocaleCode, TranslationKeys> = {
  id: {
    title: "Detail Artikel",
    min: "Menit",
    save: "Simpan",
    saved: "Tersimpan",
    like: "Suka",
    liked: "Disukai",
    readMore: "Baca selengkapnya",
    linkCopied: "Link berhasil disalin!",
    notFound: "Artikel tidak ditemukan",
    notFoundDesc:
      "Artikel yang Anda cari mungkin telah dihapus atau tidak tersedia.",
    backToList: "Kembali ke Daftar",
    viewAll: "Lihat Semua Artikel",
  },
  en: {
    title: "Article Detail",
    min: "Min",
    save: "Save",
    saved: "Saved",
    like: "Like",
    liked: "Liked",
    readMore: "Read more",
    linkCopied: "Link copied to clipboard!",
    notFound: "Article not found",
    notFoundDesc:
      "The article you are looking for might have been deleted or is unavailable.",
    backToList: "Back to List",
    viewAll: "View All Articles",
  },
  ar: {
    title: "تفاصيل المقال",
    min: "دقيقة",
    save: "حفظ",
    saved: "محفوظ",
    like: "إعجاب",
    liked: "معجب",
    readMore: "اقرأ المزيد",
    linkCopied: "تم نسخ الرابط!",
    notFound: "المقال غير موجود",
    notFoundDesc: "المقال الذي تبحث عنه قد يكون حذف أو غير متاح.",
    backToList: "العودة للقائمة",
    viewAll: "عرض كل المقالات",
  },
  fr: {
    title: "Détail de l'article",
    min: "Min",
    save: "Enregistrer",
    saved: "Enregistré",
    like: "J'aime",
    liked: "Aimé",
    readMore: "Lire la suite",
    linkCopied: "Lien copié !",
    notFound: "Article introuvable",
    notFoundDesc: "L'article que vous recherchez a peut-être été supprimé.",
    backToList: "Retour à la liste",
    viewAll: "Voir tous les articles",
  },
  kr: {
    title: "기사 상세",
    min: "분",
    save: "저장",
    saved: "저장됨",
    like: "좋아요",
    liked: "좋아요 취소",
    readMore: "더 보기",
    linkCopied: "링크가 복사되었습니다!",
    notFound: "기사를 찾을 수 없습니다",
    notFoundDesc: "찾으시는 기사가 삭제되었거나 사용할 수 없습니다.",
    backToList: "목록으로 돌아가기",
    viewAll: "모든 기사 보기",
  },
  jp: {
    title: "記事詳細",
    min: "分",
    save: "保存",
    saved: "保存済み",
    like: "いいね",
    liked: "いいね済み",
    readMore: "続きを読む",
    linkCopied: "リンクをコピーしました！",
    notFound: "記事が見つかりません",
    notFoundDesc: "お探しの記事は削除されたか、利用できない可能性があります。",
    backToList: "リストに戻る",
    viewAll: "すべての記事を見る",
  },
};

interface ArtikelDetailClientProps {
  articleId: number;
}

export default function ArtikelDetailClient({
  articleId,
}: ArtikelDetailClientProps) {
  // Ambil locale dari hook, tapi kita pakai dictionary lokal untuk teksnya
  const { locale } = useI18n();

  // Pastikan locale aman (fallback ke 'id' jika tidak ada di list)
  const currentLocale = (
    UI_TRANSLATIONS[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TRANSLATIONS[currentLocale];
  const isRtl = currentLocale === "ar";

  // Fetch Article Detail
  const {
    data: artikel,
    isLoading,
    isError,
  } = useGetArticleByIdQuery(articleId);

  // --- HELPER KONTEN MULTI-BAHASA (Dari API) ---
  const getCategoryContent = (cat: ArticleCategory) => {
    const translations = cat?.translations || [];
    const localized = translations.find((t) => t.locale === currentLocale);
    if (localized && localized.name) return { name: localized.name };
    const idFallback = translations.find((t) => t.locale === "id");
    return { name: idFallback?.name || cat.name };
  };

  const getArticleContent = (art: Article) => {
    const translations = art?.translations || [];
    const localized = translations.find((t) => t.locale === currentLocale);

    if (localized && localized.title) {
      return { title: localized.title, content: localized.content ?? "" };
    }

    const idFallback = translations.find((t) => t.locale === "id");
    return {
      title: idFallback?.title || art.title,
      content: idFallback?.content || art.content || "",
    };
  };
  // --------------------------

  // STATE LOKAL
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false); // Untuk feedback share button

  // Sinkronisasi state awal dengan LocalStorage
  useEffect(() => {
    if (artikel) {
      const bookmarks = JSON.parse(
        localStorage.getItem("artikel-bookmarks") || "[]",
      );
      const likes = JSON.parse(localStorage.getItem("artikel-likes") || "[]");
      setIsBookmarked(bookmarks.includes(artikel.id));
      setIsLiked(likes.includes(artikel.id));
    }
  }, [artikel]);

  // HANDLER: Bookmark
  const handleBookmark = () => {
    if (!artikel) return;
    const bookmarks = JSON.parse(
      localStorage.getItem("artikel-bookmarks") || "[]",
    );
    const newBookmarks = isBookmarked
      ? bookmarks.filter((id: number) => id !== artikel.id)
      : [...bookmarks, artikel.id];
    localStorage.setItem("artikel-bookmarks", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  // HANDLER: Like
  const handleLike = () => {
    if (!artikel) return;
    const likes = JSON.parse(localStorage.getItem("artikel-likes") || "[]");
    const newLikes = isLiked
      ? likes.filter((id: number) => id !== artikel.id)
      : [...likes, artikel.id];
    localStorage.setItem("artikel-likes", JSON.stringify(newLikes));
    setIsLiked(!isLiked);
  };

  // HANDLER: Share
  const handleShare = async () => {
    if (!artikel) return;
    const content = getArticleContent(artikel);
    const shareUrl = window.location.href;
    const shareText = `${t.readMore}: ${content.title}`;

    const shareData = {
      title: content.title,
      text: shareText,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        // Tampilkan alert atau toast sederhana jika perlu, tapi icon berubah sudah cukup
        // alert(t.linkCopied);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Error copying:", err);
      }
    }
  };

  // FORMAT TANGGAL LOKAL
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      id: "id-ID",
      en: "en-US",
      ar: "ar-SA",
      fr: "fr-FR",
      kr: "ko-KR",
      jp: "ja-JP",
    };
    return date.toLocaleDateString(localeMap[currentLocale] || "id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // --- RENDER: LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-50 to-accent-100">
        <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
      </div>
    );
  }

  // --- RENDER: ERROR / NOT FOUND ---
  if (isError || !artikel) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <header className="sticky top-0 z-30">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
              <div className="flex items-center justify-between">
                <Link href="/artikel">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary"
                  >
                    <ArrowLeft
                      className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
                    />
                  </Button>
                </Link>
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t.title}
                </h1>
                <div className="w-10 h-10"></div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          <Card className="border-awqaf-border-light">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                {t.notFound}
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-4">
                {t.notFoundDesc}
              </p>
              <Link href="/artikel">
                <Button variant="outline" size="sm" className="font-comfortaa">
                  {t.backToList}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // --- RENDER: SUCCESS ---
  const content = getArticleContent(artikel);
  const categoryContent = getCategoryContent(artikel.category);

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
              <Link href="/artikel">
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
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                {t.title}
              </h1>
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Article Header Card */}
        <Card className="border-awqaf-border-light overflow-hidden">
          {/* Main Image */}
          {artikel.image && (
            <div className="relative w-full h-48 bg-gray-100">
              <Image
                src={artikel.image}
                alt={content.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <CardContent className="p-4 space-y-4">
            {/* Category */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {categoryContent.name}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-card-foreground font-comfortaa leading-tight">
              {content.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-awqaf-foreground-secondary font-comfortaa border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(artikel.published_at)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />5 {t.min}
                </div>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="flex items-center gap-2 pt-2">
              {/* Button: Simpan */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className={`flex-1 font-comfortaa transition-all ${
                  isBookmarked ? "bg-accent-50 border-awqaf-primary/30" : ""
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 mr-2 ${
                    isBookmarked ? "fill-awqaf-primary text-awqaf-primary" : ""
                  }`}
                />
                {isBookmarked ? t.saved : t.save}
              </Button>

              {/* Button: Suka */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={`flex-1 font-comfortaa transition-all ${
                  isLiked ? "bg-red-50 border-red-200" : ""
                }`}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {isLiked ? t.liked : t.like}
              </Button>

              {/* Button: Share */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="font-comfortaa"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Article Body */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div
              className={`
                prose prose-sm max-w-none font-comfortaa prose-img:rounded-lg prose-headings:font-bold prose-a:text-awqaf-primary
                ${isRtl ? "text-right font-tajawal" : "text-justify"}
              `}
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </CardContent>
        </Card>

        {/* Bottom Nav Button */}
        <div className="text-center">
          <Link href="/artikel">
            <Button variant="outline" size="sm" className="font-comfortaa">
              <Navigation className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`} />
              {t.viewAll}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}