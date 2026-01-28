"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Target } from "lucide-react";
import { useI18n } from "@/app/hooks/useI18n";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface ProgressTranslations {
  title: string;
  progress: string;
  status: {
    completed: string;
    current: string;
    pending: string;
  };
  prayerNames: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  motivation: {
    allDone: string;
    quranQuoteDone: string;
    sourceDone: string;
    quotePending: string;
    sourcePending: string;
  };
}

// --- TRANSLATION DICTIONARY ---
const PROGRESS_TEXT: Record<LocaleCode, ProgressTranslations> = {
  id: {
    title: "Progress Sholat Hari Ini",
    progress: "Progress",
    status: {
      completed: "Selesai",
      current: "Sekarang",
      pending: "Menunggu",
    },
    prayerNames: {
      fajr: "Subuh",
      dhuhr: "Dzuhur",
      asr: "Ashar",
      maghrib: "Maghrib",
      isha: "Isya",
    },
    motivation: {
      allDone: "🎉 Alhamdulillah! Semua sholat hari ini sudah selesai",
      quranQuoteDone: '"Dan dirikanlah sholat untuk mengingat-Ku"',
      sourceDone: "- QS. Thaha: 14",
      quotePending:
        '"Sesungguhnya sholat itu adalah kewajiban yang ditentukan waktunya atas orang-orang yang beriman"',
      sourcePending: "- QS. An-Nisa: 103",
    },
  },
  en: {
    title: "Today's Prayer Progress",
    progress: "Progress",
    status: {
      completed: "Done",
      current: "Now",
      pending: "Waiting",
    },
    prayerNames: {
      fajr: "Fajr",
      dhuhr: "Dhuhr",
      asr: "Asr",
      maghrib: "Maghrib",
      isha: "Isha",
    },
    motivation: {
      allDone: "🎉 Alhamdulillah! All prayers completed today",
      quranQuoteDone: '"And establish prayer for My remembrance"',
      sourceDone: "- QS. Taha: 14",
      quotePending:
        '"Indeed, prayer has been decreed upon the believers a decree of specified times"',
      sourcePending: "- QS. An-Nisa: 103",
    },
  },
  ar: {
    title: "تقدم الصلاة اليوم",
    progress: "التقدم",
    status: {
      completed: "مكتملة",
      current: "الآن",
      pending: "قادم",
    },
    prayerNames: {
      fajr: "الفجر",
      dhuhr: "الظهر",
      asr: "العصر",
      maghrib: "المغرب",
      isha: "العشاء",
    },
    motivation: {
      allDone: "🎉 الحمد لله! اكتملت جميع الصلوات اليوم",
      quranQuoteDone: '"وَأَقِمِ الصَّلَاةَ لِذِكْرِي"',
      sourceDone: "- سورة طه: ١٤",
      quotePending:
        '"إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا"',
      sourcePending: "- سورة النساء: ١٠٣",
    },
  },
  fr: {
    title: "Progrès des Prières",
    progress: "Progrès",
    status: {
      completed: "Terminé",
      current: "Maintenant",
      pending: "En attente",
    },
    prayerNames: {
      fajr: "Fajr",
      dhuhr: "Dhuhr",
      asr: "Asr",
      maghrib: "Maghrib",
      isha: "Isha",
    },
    motivation: {
      allDone: "🎉 Alhamdulillah ! Toutes les prières sont terminées",
      quranQuoteDone: '"Et accomplis la Salât pour te souvenir de Moi"',
      sourceDone: "- Sourate Ta-Ha: 14",
      quotePending:
        '"La Salât demeure, pour les croyants, une prescription, à des temps déterminés"',
      sourcePending: "- Sourate An-Nisa: 103",
    },
  },
  kr: {
    title: "오늘의 기도 진행 상황",
    progress: "진행률",
    status: {
      completed: "완료됨",
      current: "현재",
      pending: "대기 중",
    },
    prayerNames: {
      fajr: "파즈르",
      dhuhr: "두후르",
      asr: "아스르",
      maghrib: "마그립",
      isha: "이샤",
    },
    motivation: {
      allDone: "🎉 알함둘릴라! 오늘의 모든 기도를 마쳤습니다",
      quranQuoteDone: '"나를 기억하기 위해 기도를 올리라"',
      sourceDone: "- 수라 타하: 14",
      quotePending:
        '"실로 예배는 믿는 자들에게 정해진 시간에 행해져야 할 의무이니라"',
      sourcePending: "- 수라 안니사: 103",
    },
  },
  jp: {
    title: "今日の礼拝進捗",
    progress: "進捗",
    status: {
      completed: "完了",
      current: "現在",
      pending: "待機中",
    },
    prayerNames: {
      fajr: "ファジュル",
      dhuhr: "ズフル",
      asr: "アスル",
      maghrib: "マグリブ",
      isha: "イシャー",
    },
    motivation: {
      allDone: "🎉 アルハムドゥリッラー！今日のすべての礼拝が完了しました",
      quranQuoteDone: '"われを念じるために礼拝を捧げなさい"',
      sourceDone: "- スーラ ター・ハー: 14",
      quotePending: '"誠に礼拝は、信者に対し定められた時刻の義務である"',
      sourcePending: "- スーラ アン・ニサー: 103",
    },
  },
};

interface PrayerProgressProps {
  completedPrayers: number;
  totalPrayers: number;
  prayerStatus: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  currentPrayer: string | null;
}

export default function PrayerProgress({
  completedPrayers,
  totalPrayers,
  prayerStatus,
  currentPrayer,
}: PrayerProgressProps) {
  const { locale } = useI18n();

  // Safe Locale Access
  const safeLocale = (
    PROGRESS_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = PROGRESS_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const prayers = [
    { key: "fajr", name: t.prayerNames.fajr, arabic: "الفجر" },
    { key: "dhuhr", name: t.prayerNames.dhuhr, arabic: "الظهر" },
    { key: "asr", name: t.prayerNames.asr, arabic: "العصر" },
    { key: "maghrib", name: t.prayerNames.maghrib, arabic: "المغرب" },
    { key: "isha", name: t.prayerNames.isha, arabic: "العشاء" },
  ];

  const percentage =
    totalPrayers > 0 ? (completedPrayers / totalPrayers) * 100 : 0;

  const getPrayerStatus = (prayerKey: string) => {
    const isCompleted = prayerStatus[prayerKey as keyof typeof prayerStatus];
    const isCurrent = currentPrayer === prayerKey;

    if (isCompleted) return "completed";
    if (isCurrent) return "current";
    return "pending";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "current":
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return (
          <div className="w-4 h-4 rounded-full border-2 border-awqaf-border-light" />
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-white";
      case "current":
        return "bg-warning text-white";
      default:
        return "bg-accent-100 text-awqaf-foreground-secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t.status.completed;
      case "current":
        return t.status.current;
      default:
        return t.status.pending;
    }
  };

  return (
    <Card className="border-awqaf-border-light" dir={isRtl ? "rtl" : "ltr"}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-awqaf-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
              {t.title}
            </h3>
            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
              {completedPrayers} / {totalPrayers}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-card-foreground font-comfortaa">
              {t.progress}
            </span>
            <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
              {Math.round(percentage)}%
            </span>
          </div>
          <Progress value={percentage} className="h-3 bg-accent-100" />
          <div className="flex justify-between text-xs text-awqaf-foreground-secondary font-comfortaa">
            <span>0%</span>
            <span className="font-medium text-awqaf-primary">
              {Math.round(percentage)}%
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Prayer List */}
        <div className="space-y-2">
          {prayers.map((prayer) => {
            const status = getPrayerStatus(prayer.key);
            return (
              <div
                key={prayer.key}
                className="flex items-center justify-between p-3 rounded-lg border border-awqaf-border-light hover:bg-accent-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <div>
                    <p className="font-medium text-card-foreground text-sm font-comfortaa">
                      {prayer.name}
                    </p>
                    <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
                      {prayer.arabic}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs px-2 py-1 ${getStatusColor(status)}`}
                >
                  {getStatusText(status)}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Motivational Message */}
        {completedPrayers === totalPrayers ? (
          <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
            <p className="text-xs text-success font-comfortaa text-center">
              {t.motivation.allDone}
            </p>
            <p className="text-xs text-success font-tajawal text-center mt-1">
              {t.motivation.quranQuoteDone}
            </p>
            <p className="text-xs text-success font-comfortaa text-center">
              {t.motivation.sourceDone}
            </p>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-accent-50 rounded-lg border border-accent-100">
            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa text-center">
              {t.motivation.quotePending}
            </p>
            <p className="text-xs text-awqaf-primary font-tajawal text-center mt-1">
              {t.motivation.sourcePending}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}