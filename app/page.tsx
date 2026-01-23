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
// I18n
import { useI18n } from "./hooks/useI18n";

export default function Home() {
  const { t, locale } = useI18n();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const currentHour = new Date().getHours();

  // --- 1. Sapaan Berdasarkan Waktu (Inline Translation) ---
  const getGreeting = () => {
    const hour = currentHour;
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
    const greetingSet = greetings[locale] || greetings.id;
    return hour < 12
      ? greetingSet.morning
      : hour < 18
        ? greetingSet.afternoon
        : greetingSet.evening;
  };

  const greeting = getGreeting();

  // Fetch Data
  const { data: articlesData, isLoading: isLoadingArticles } =
    useGetArticlesQuery({ page: 1, paginate: 10 });

  const { data: surahList } = useGetSurahsQuery({ lang: "id" });
  const { currentPrayerKey, prayerTimes } = usePrayerTracker();

  // Local State for Last Quran Activity
  const [lastQuranActivity, setLastQuranActivity] = useState(t("home.loading"));

  // --- 2. Logic Aktivitas Quran (Inline Translation) ---
  useEffect(() => {
    const lastRead = localStorage.getItem("quran-last-read");

    // Dictionary untuk teks Quran
    const quranTexts: Record<
      string,
      { verse: string; surah: string; notRead: string }
    > = {
      id: { verse: "Ayat", surah: "Surah", notRead: "Belum ada aktivitas" },
      en: { verse: "Verse", surah: "Surah", notRead: "No activity yet" },
      ar: { verse: "آية", surah: "سورة", notRead: "لا يوجد نشاط" },
      fr: { verse: "Verset", surah: "Sourate", notRead: "Aucune activité" },
      kr: { verse: "절", surah: "수라", notRead: "활동 없음" },
      jp: { verse: "節", surah: "スーラ", notRead: "活動なし" },
    };
    const txt = quranTexts[locale] || quranTexts.id;

    if (lastRead) {
      const parsed = JSON.parse(lastRead);
      setLastQuranActivity(
        `${parsed.surahName} : ${txt.verse} ${parsed.verse}`,
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
            surahName ? `${txt.surah} ${surahName}` : `${txt.surah} ${surahId}`,
          );
        }
      } else {
        setLastQuranActivity(txt.notRead);
      }
    }
  }, [surahList, locale]); // Penting: Refresh saat locale berubah

  // Helpers Format Tanggal
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

  const latestArticles = useMemo(() => {
    if (!articlesData?.data) return [];
    const sorted = [...articlesData.data].sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    );

    return sorted.slice(0, 3).map((artikel) => ({
      id: artikel.id.toString(),
      slug: artikel.id.toString(),
      title: artikel.title,
      excerpt:
        artikel.content.replace(/<[^>]*>?/gm, "").substring(0, 100) + "...",
      category: artikel.category.name,
      readTime: "5 min",
      views: "1.2K",
      publishedAt: formatDate(artikel.published_at),
      image: artikel.image,
    }));
  }, [articlesData, locale]);

  // --- 3. Logic Widget Sholat (Inline Translation Nama Sholat) ---
  const prayerWidgetData = useMemo(() => {
    if (!prayerTimes) return { title: t("home.loading"), time: "--:--" };

    const prayerNames: Record<string, Record<string, string>> = {
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

    const parseTime = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const times = {
      fajr: parseTime(prayerTimes.fajr),
      dhuhr: parseTime(prayerTimes.dhuhr),
      asr: parseTime(prayerTimes.asr),
      maghrib: parseTime(prayerTimes.maghrib),
      isha: parseTime(prayerTimes.isha),
    };

    type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
    let activePrayer: PrayerKey | null = null;

    if (currentMinutes >= times.fajr && currentMinutes < times.dhuhr)
      activePrayer = "fajr";
    else if (currentMinutes >= times.dhuhr && currentMinutes < times.asr)
      activePrayer = "dhuhr";
    else if (currentMinutes >= times.asr && currentMinutes < times.maghrib)
      activePrayer = "asr";
    else if (currentMinutes >= times.maghrib && currentMinutes < times.isha)
      activePrayer = "maghrib";
    else activePrayer = "isha";

    const prayerKey: PrayerKey = (activePrayer ||
      currentPrayerKey ||
      "fajr") as PrayerKey;
    const names = prayerNames[locale] || prayerNames.id;

    return {
      title: names[prayerKey],
      time: prayerTimes[prayerKey],
    };
  }, [prayerTimes, currentPrayerKey, locale]); // Refresh saat locale berubah

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
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
              {/* Tampilkan Greeting sesuai bahasa */}
              {greeting}
            </h2>
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-3">
              <span className="font-tajawal text-awqaf-primary">
                السلام عليكم
              </span>
              <br />
              Assalamu&apos;alaikum
            </p>
            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa italic">
              {/* Inline Quotes */}
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
            // Mengambil judul dari i18n atau fallback
            title={t("widgets.prayer")}
            subtitle={prayerWidgetData.title}
            time={prayerWidgetData.time}
            status="current"
            icon={<Clock className="w-4 h-4 text-awqaf-primary" />}
          />
          <WidgetCard
            type="activity"
            // Inline Translation untuk Judul Widget
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

        {/* Progress Widget (Otomatis menyesuaikan bahasa karena sudah diupdate sebelumnya) */}
        <ProgressWidget />

        {/* Feature Navigation (Otomatis menyesuaikan bahasa karena sudah diupdate sebelumnya) */}
        <FeatureNavigation />

        {/* Articles Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {/* Inline Translation untuk Judul Artikel */}
              {(() => {
                const titles: Record<string, string> = {
                  id: "Artikel Terbaru",
                  en: "Latest Articles",
                  ar: "المقالات الأخيرة",
                  fr: "Derniers articles",
                  kr: "최신 기사",
                  jp: "最新記事",
                };
                return titles[locale] || titles.id;
              })()}
            </h2>
            <Link href="/artikel">
              <Button
                variant="ghost"
                size="sm"
                className="text-awqaf-foreground-secondary hover:text-awqaf-primary hover:bg-accent-100 font-comfortaa"
              >
                {t("home.viewAll")}
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
              <p className="text-center text-sm text-gray-500 py-4 font-comfortaa">
                {/* Inline Translation untuk Pesan Kosong */}
                {(() => {
                  const msg: Record<string, string> = {
                    id: "Belum ada artikel terbaru.",
                    en: "No latest articles yet.",
                    ar: "لا توجد مقالات جديدة",
                    fr: "Aucun article récent.",
                    kr: "최신 기사가 없습니다.",
                    jp: "最新の記事はありません。",
                  };
                  return msg[locale] || msg.id;
                })()}
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