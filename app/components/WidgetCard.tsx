"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface WidgetTranslations {
  status: {
    current: string;
    upcoming: string;
    completed: string;
  };
  labels: {
    prayerTime: string;
    lastActivity: string;
  };
}

// --- TRANSLATION DICTIONARY ---
const WIDGET_TEXT: Record<LocaleCode, WidgetTranslations> = {
  id: {
    status: {
      current: "Sekarang",
      upcoming: "Berikutnya",
      completed: "Selesai",
    },
    labels: { prayerTime: "Waktu Sholat", lastActivity: "Aktivitas Terakhir" },
  },
  en: {
    status: { current: "Now", upcoming: "Next", completed: "Done" },
    labels: { prayerTime: "Prayer Time", lastActivity: "Last Activity" },
  },
  ar: {
    status: { current: "الآن", upcoming: "القادم", completed: "تم" },
    labels: { prayerTime: "وقت الصلاة", lastActivity: "آخر نشاط" },
  },
  fr: {
    status: { current: "Maint.", upcoming: "Suiv.", completed: "Fait" },
    labels: {
      prayerTime: "Heure de Prière",
      lastActivity: "Dernière Activité",
    },
  },
  kr: {
    status: { current: "현재", upcoming: "다음", completed: "완료" },
    labels: { prayerTime: "기도 시간", lastActivity: "마지막 활동" },
  },
  jp: {
    status: { current: "現在", upcoming: "次", completed: "完了" },
    labels: { prayerTime: "礼拝時間", lastActivity: "最後の活動" },
  },
};

interface WidgetCardProps {
  type: "prayer" | "activity";
  title: string;
  subtitle: string;
  time?: string;
  status?: "current" | "upcoming" | "completed";
  activity?: string;
  icon: React.ReactNode;
}

export default function WidgetCard({
  type,
  title,
  subtitle,
  time,
  status,
  activity,
  icon,
}: WidgetCardProps) {
  const { locale } = useI18n();

  // Safe Locale Access
  const safeLocale = (
    WIDGET_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = WIDGET_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // Helper untuk mendapatkan teks status
  const getStatusLabel = (s: "current" | "upcoming" | "completed") => {
    return t.status[s];
  };

  return (
    <Card
      className="border-awqaf-border-light hover:shadow-md transition-all duration-200 h-full relative"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Status Badge - Positioned absolutely at top right (or left for RTL) */}
      {status && (
        <Badge
          variant={status === "current" ? "default" : "secondary"}
          className={`
            absolute -top-1 z-10 text-[10px] px-2 py-0.5 shadow-sm
            ${isRtl ? "-left-1" : "-right-1"}
            ${
              status === "current"
                ? "bg-success text-white"
                : "bg-accent-100 text-awqaf-primary"
            }
          `}
        >
          {getStatusLabel(status)}
        </Badge>
      )}

      <CardContent className="p-3 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground text-xs font-comfortaa leading-tight truncate">
              {title}
            </h3>
            <p className="text-[10px] text-awqaf-foreground-secondary font-comfortaa leading-tight mt-0.5 truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-center">
          {type === "prayer" && time && (
            <div className="text-center">
              <div className="text-xl font-bold text-awqaf-primary font-comfortaa">
                {time}
              </div>
              <p className="text-[10px] text-awqaf-foreground-secondary font-comfortaa mt-1">
                {t.labels.prayerTime}
              </p>
            </div>
          )}

          {type === "activity" && activity && (
            <div className="text-center">
              <div className="text-sm font-medium text-card-foreground font-comfortaa leading-tight line-clamp-2 min-h-[2.5em] flex items-center justify-center">
                {activity}
              </div>
              <p className="text-[10px] text-awqaf-foreground-secondary font-comfortaa mt-1">
                {t.labels.lastActivity}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}