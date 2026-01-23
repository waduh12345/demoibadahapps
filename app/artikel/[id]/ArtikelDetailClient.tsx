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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetArticleByIdQuery } from "@/services/public/article.service";
import { useI18n } from "@/app/hooks/useI18n";
import { Article, ArticleCategory } from "@/types/public/article";

interface ArtikelDetailClientProps {
  articleId: number;
}

export default function ArtikelDetailClient({
  articleId,
}: ArtikelDetailClientProps) {
  const { t, locale } = useI18n(); // Import hook i18n

  // Fetch Article Detail
  const {
    data: artikel,
    isLoading,
    isError,
  } = useGetArticleByIdQuery(articleId);

  // --- HELPER TRANSLATION (Sama dengan Page List) ---
  const getCategoryContent = (cat: ArticleCategory) => {
    // FIX: Tambahkan optional chaining (?.) atau default empty array
    const translations = cat?.translations || [];

    const localized = translations.find((t) => t.locale === locale);
    if (localized && localized.name) return { name: localized.name };

    const idFallback = translations.find((t) => t.locale === "id");
    if (idFallback && idFallback.name) return { name: idFallback.name };

    return { name: cat.name };
  };

  const getArticleContent = (art: Article) => {
    // FIX: Tambahkan optional chaining (?.) atau default empty array
    const translations = art?.translations || [];

    const localized = translations.find((t) => t.locale === locale);
    if (localized && localized.title) {
      return {
        title: localized.title,
        content: localized.content ?? "",
      };
    }

    const idFallback = translations.find((t) => t.locale === "id");
    if (idFallback && idFallback.title) {
      return {
        title: idFallback.title,
        content: idFallback.content ?? "",
      };
    }

    return {
      title: art.title,
      content: art.content ?? "",
    };
  };
  // --------------------------

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

  const handleLike = () => {
    if (!artikel) return;

    const likes = JSON.parse(localStorage.getItem("artikel-likes") || "[]");
    const newLikes = isLiked
      ? likes.filter((id: number) => id !== artikel.id)
      : [...likes, artikel.id];

    localStorage.setItem("artikel-likes", JSON.stringify(newLikes));
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    if (!artikel) return;

    const content = getArticleContent(artikel);

    const shareData = {
      title: content.title,
      text: `Baca artikel menarik ini: ${content.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link artikel disalin ke clipboard!");
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

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
    return date.toLocaleDateString(localeMap[locale] || "id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-50 to-accent-100">
        <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
      </div>
    );
  }

  if (isError || !artikel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
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
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t("article.title")}
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
                Artikel tidak ditemukan
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-4">
                Artikel yang Anda cari tidak ditemukan atau telah dihapus.
              </p>
              <Link href="/artikel">
                <Button variant="outline" size="sm" className="font-comfortaa">
                  Kembali ke Daftar Artikel
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Calculate content once
  const content = getArticleContent(artikel);
  const categoryContent = getCategoryContent(artikel.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
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
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                {t("article.title")}
              </h1>
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Article Header */}
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
                  <Clock className="w-3 h-3" />5 {t("article.min")}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className="flex-1 font-comfortaa"
              >
                <Bookmark
                  className={`w-4 h-4 mr-2 ${
                    isBookmarked ? "fill-awqaf-primary text-awqaf-primary" : ""
                  }`}
                />
                {isBookmarked ? "Tersimpan" : "Simpan"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className="flex-1 font-comfortaa"
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {isLiked ? "Disukai" : "Suka"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="font-comfortaa"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Article Content */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div
              className="prose prose-sm max-w-none font-comfortaa prose-img:rounded-lg prose-headings:font-bold prose-a:text-awqaf-primary"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </CardContent>
        </Card>

        {/* Back to Articles */}
        <div className="text-center">
          <Link href="/artikel">
            <Button variant="outline" size="sm" className="font-comfortaa">
              <Navigation className="w-4 h-4 mr-2" />
              {t("article.viewAllArticles")}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
