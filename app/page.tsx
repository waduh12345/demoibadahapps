"use client";

import { Search, Clock, BookOpen, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

// Components
import WidgetCard from "./components/WidgetCard";
import ProgressWidget from "./components/ProgressWidget";
import FeatureNavigation from "./components/FeatureNavigation";
import ArticleCard from "./components/ArticleCard";
import SearchModal from "./components/SearchModal";
import LanguageSwitcher from "./components/LanguageSwitcher";

// Services
import { useGetArticlesQuery } from "@/services/public/article.service";
import { usePrayerTracker } from "@/app/prayer-tracker/hooks/usePrayerTracker";
import { useGetSurahsQuery } from "@/services/public/quran.service";

// I18n & Types
import { useI18n } from "./hooks/useI18n";
import { Article } from "@/types/public/article";

// --- TIPE & DICTIONARY ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";
// Definisi tipe khusus untuk key sholat agar tidak any
type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

interface HomeTranslations {
  latestArticles: string;
  viewAll: string;
  noArticles: string;
  loading: string;
  quran: {
    verse: string;
    surah: string;
    notRead: string;
  };
}

const HOME_TEXT: Record<LocaleCode, HomeTranslations> = {
  id: {
    latestArticles: "Artikel Terbaru",
    viewAll: "Lihat Semua",
    noArticles: "Belum ada artikel terbaru.",
    loading: "Memuat...",
    quran: { verse: "Ayat", surah: "Surah", notRead: "Belum ada aktivitas" },
  },
  en: {
    latestArticles: "Latest Articles",
    viewAll: "View All",
    noArticles: "No latest articles yet.",
    loading: "Loading...",
    quran: { verse: "Verse", surah: "Surah", notRead: "No activity yet" },
  },
  ar: {
    latestArticles: "أحدث المقالات",
    viewAll: "عرض الكل",
    noArticles: "لا توجد مقالات جديدة.",
    loading: "جار التحميل...",
    quran: { verse: "آية", surah: "سورة", notRead: "لا يوجد نشاط" },
  },
  fr: {
    latestArticles: "Derniers articles",
    viewAll: "Voir tout",
    noArticles: "Aucun article récent.",
    loading: "Chargement...",
    quran: { verse: "Verset", surah: "Sourate", notRead: "Aucune activité" },
  },
  kr: {
    latestArticles: "최신 기사",
    viewAll: "모두 보기",
    noArticles: "최신 기사가 없습니다.",
    loading: "로딩 중...",
    quran: { verse: "절", surah: "수라", notRead: "활동 없음" },
  },
  jp: {
    latestArticles: "最新記事",
    viewAll: "すべて見る",
    noArticles: "最新の記事はありません。",
    loading: "読み込み中...",
    quran: { verse: "節", surah: "スーラ", notRead: "活動なし" },
  },
};

export default function Home() {
  const { t, locale } = useI18n();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const currentHour = new Date().getHours();

  // Safe Locale Access
  const safeLocale = (
    HOME_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const uiText = HOME_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // --- 1. Sapaan Berdasarkan Waktu ---
  const getGreeting = () => {
    const greetings: Record<
      string,
      { morning: string; afternoon: string; evening: string }
    > = {
      id: {
        morning: "Selamat Pagi",
        afternoon: "Selamat Siang",
        evening: "Selamat Malam",
      },
      en: {
        morning: "Good Morning",
        afternoon: "Good Afternoon",
        evening: "Good Evening",
      },
      ar: {
        morning: "صباح الخير",
        afternoon: "مساء الخير",
        evening: "مساء الخير",
      },
      fr: {
        morning: "Bonjour",
        afternoon: "Bon après-midi",
        evening: "Bonsoir",
      },
      kr: {
        morning: "좋은 아침",
        afternoon: "좋은 오후",
        evening: "좋은 저녁",
      },
      jp: {
        morning: "おはよう",
        afternoon: "こんにちは",
        evening: "こんばんは",
      },
    };
    const set = greetings[locale] || greetings.id;
    return currentHour < 12
      ? set.morning
      : currentHour < 18
        ? set.afternoon
        : set.evening;
  };

  const greeting = getGreeting();

  // --- API HOOKS ---
  const { data: articlesData, isLoading: isLoadingArticles } =
    useGetArticlesQuery({
      page: 1,
      paginate: 5,
    });

  const { data: surahList } = useGetSurahsQuery({ lang: "id" });
  const { currentPrayerKey, prayerTimes } = usePrayerTracker();

  // Local State for Quran Widget
  const [lastQuranActivity, setLastQuranActivity] = useState(uiText.loading);

  // --- Logic Widget Quran ---
  useEffect(() => {
    const lastRead = localStorage.getItem("quran-last-read");
    if (lastRead) {
      const parsed = JSON.parse(lastRead);
      setLastQuranActivity(
        `${parsed.surahName} : ${uiText.quran.verse} ${parsed.verse}`,
      );
    } else {
      const recent = localStorage.getItem("quran-recent");
      if (recent) {
        const arr = JSON.parse(recent);
        if (arr.length > 0) {
          const surahId = arr[0];
          const surahName = surahList?.find(
            (s) => s.id === surahId,
          )?.transliteration;
          setLastQuranActivity(
            surahName
              ? `${uiText.quran.surah} ${surahName}`
              : `${uiText.quran.surah} ${surahId}`,
          );
        }
      } else {
        setLastQuranActivity(uiText.quran.notRead);
      }
    }
  }, [surahList, locale, uiText]);

  // --- Helper Format Tanggal ---
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

  // --- Logic Mapping Artikel (Translation Aware) ---
  const latestArticles = useMemo(() => {
    if (!articlesData?.data) return [];

    // Sorting Descending by Date
    const sorted = [...articlesData.data].sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    );

    return sorted.map((article: Article) => {
      let title = article.title;
      let content = article.content;
      let categoryName = article.category?.name || "Umum"; // Safe access category

      // --- PERBAIKAN: Safe Access Array Translation ---
      // Pastikan translations adalah array sebelum di-find
      const articleTranslations = article.translations || [];
      const localized = articleTranslations.find((t) => t.locale === locale);

      if (localized) {
        if (localized.title) title = localized.title;
        if (localized.content) content = localized.content;
      } else {
        const idFallback = articleTranslations.find((t) => t.locale === "id");
        if (idFallback) {
          if (idFallback.title) title = idFallback.title;
          if (idFallback.content) content = idFallback.content;
        }
      }

      // Safe access category translations
      const catTranslations = article.category?.translations || [];
      const catTrans =
        catTranslations.find((t) => t.locale === locale) ||
        catTranslations.find((t) => t.locale === "id");
      if (catTrans && catTrans.name) categoryName = catTrans.name;

      // Clean HTML
      const cleanContent = content ? content.replace(/<[^>]*>?/gm, "") : "";

      return {
        id: article.id.toString(),
        slug: article.id.toString(),
        title: title,
        excerpt: cleanContent.substring(0, 100) + "...",
        category: categoryName,
        readTime: "5 min",
        views: "1.2K",
        publishedAt: formatDate(article.published_at),
        image: article.image,
      };
    });
  }, [articlesData, locale]);

  // --- Logic Widget Prayer ---
  const prayerWidgetData = useMemo(() => {
    if (!prayerTimes) return { title: uiText.loading, time: "--:--" };

    // Gunakan Tipe PrayerKey yang sudah didefinisikan
    const prayerNames: Record<string, Record<PrayerKey, string>> = {
      id: {
        fajr: "Subuh",
        dhuhr: "Dzuhur",
        asr: "Ashar",
        maghrib: "Maghrib",
        isha: "Isya",
      },
      en: {
        fajr: "Fajr",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
      },
      ar: {
        fajr: "الفجر",
        dhuhr: "الظهر",
        asr: "العصر",
        maghrib: "المغرب",
        isha: "العشاء",
      },
      fr: {
        fajr: "Fajr",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
      },
      kr: {
        fajr: "파즈르",
        dhuhr: "두후르",
        asr: "아스르",
        maghrib: "마그립",
        isha: "이샤",
      },
      jp: {
        fajr: "ファジュル",
        dhuhr: "ズフル",
        asr: "アスル",
        maghrib: "マグリブ",
        isha: "イシャー",
      },
    };

    const activeNames = prayerNames[locale] || prayerNames.id;
    const key = (currentPrayerKey || "fajr") as PrayerKey;

    // Type casting aman karena kita tahu struktur prayerTimes dari hook
    const times = prayerTimes as unknown as Record<string, string>;

    return {
      title: activeNames[key] || key,
      time: times[key] || "--:--",
    };
  }, [prayerTimes, currentPrayerKey, locale, uiText]);

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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full shadow-sm border-2 border-accent-100 flex items-center justify-center">
                  <Image
                    src="/ibadahapp-logo.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                    {t("home.title")}
                  </h1>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    {t("home.subtitle")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/store">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 text-awqaf-primary"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </Button>
                </Link>
                <LanguageSwitcher />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 text-awqaf-primary"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Banner */}
        <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa mb-2">
              {greeting}
            </h2>
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-3">
              <span className="font-tajawal text-awqaf-primary text-lg">
                السلام عليكم
              </span>
              <br />
              Assalamu&apos;alaikum
            </p>
            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa italic">
              {(() => {
                const quotes: Record<string, string> = {
                  id: '"Dan barangsiapa yang bertakwa kepada Allah, niscaya Dia akan mengadakan baginya jalan keluar."',
                  en: '"And whoever fears Allah - He will make for him a way out."',
                  ar: '"ومن يتق الله يجعل له مخرجا"',
                  fr: '"Et quiconque craint Allah, Il lui donnera une issue."',
                  kr: '"하나님을 두려워하는 자에게는 그가 길을 열어주실 것이다."',
                  jp: '"アッラーを畏れる者には、彼は道を開いてくださる。"',
                };
                return quotes[locale] || quotes.id;
              })()}
            </p>
            <p className="text-xs text-awqaf-primary font-tajawal mt-2">
              - QS. At-Talaq: 2
            </p>
          </CardContent>
        </Card>

        {/* Widget Cards */}
        <div className="grid grid-cols-2 gap-4">
          <WidgetCard
            type="prayer"
            title={t("widgets.prayer")}
            subtitle={prayerWidgetData.title}
            time={prayerWidgetData.time}
            status="current"
            icon={<Clock className="w-4 h-4 text-awqaf-primary" />}
          />
          <WidgetCard
            type="activity"
            title={(() => {
              const titles: Record<string, string> = {
                id: "Aktivitas Terakhir",
                en: "Last Activity",
                ar: "النشاط الأخير",
                fr: "Dernière activité",
                kr: "마지막 활동",
                jp: "最後の活動",
              };
              return titles[locale] || titles.id;
            })()}
            subtitle={t("widgets.quran")}
            activity={lastQuranActivity}
            icon={<BookOpen className="w-4 h-4 text-info" />}
          />
        </div>

        <ProgressWidget />
        <FeatureNavigation />

        {/* Articles Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {uiText.latestArticles}
            </h2>
            <Link href="/artikel">
              <Button
                variant="ghost"
                size="sm"
                className="text-awqaf-foreground-secondary hover:text-awqaf-primary hover:bg-accent-100 font-comfortaa"
              >
                {uiText.viewAll}
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {isLoadingArticles ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
              </div>
            ) : latestArticles.length > 0 ? (
              latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 py-4 font-comfortaa bg-white/50 rounded-xl border border-dashed border-gray-200">
                {uiText.noArticles}
              </p>
            )}
          </div>
        </div>
      </main>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}