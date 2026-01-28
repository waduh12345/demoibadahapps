"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Clock, BookOpen, GraduationCap, BookMarked } from "lucide-react";
import { useI18n } from "@/app/hooks/useI18n";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface NavLabels {
  home: string;
  prayer: string;
  quran: string;
  study: string;
  books: string;
}

// --- TRANSLATION DICTIONARY ---
const NAV_TEXT: Record<LocaleCode, NavLabels> = {
  id: {
    home: "Beranda",
    prayer: "Sholat",
    quran: "Al-Qur'an",
    study: "Kajian",
    books: "E-Book",
  },
  en: {
    home: "Home",
    prayer: "Prayer",
    quran: "Quran",
    study: "Study",
    books: "E-Book",
  },
  ar: {
    home: "الرئيسية",
    prayer: "الصلاة",
    quran: "القرآن",
    study: "دروس",
    books: "كتب",
  },
  fr: {
    home: "Accueil",
    prayer: "Prière",
    quran: "Coran",
    study: "Étude",
    books: "E-Book",
  },
  kr: {
    home: "홈",
    prayer: "기도",
    quran: "꾸란",
    study: "공부",
    books: "전자책",
  },
  jp: {
    home: "ホーム",
    prayer: "礼拝",
    quran: "コーラン",
    study: "勉強",
    books: "電子書籍",
  },
};

interface NavItem {
  href: string;
  key: keyof NavLabels; // Gunakan key dari NavLabels untuk mapping
  icon: React.ComponentType<{ className?: string }>;
}

export default function BottomNavigation() {
  const pathname = usePathname();
  const { locale } = useI18n();

  // Safe Locale Access
  const safeLocale = (
    NAV_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t_nav = NAV_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // Data NavItems (hanya struktur, label diambil dari dictionary)
  const navItems: NavItem[] = [
    {
      href: "/",
      key: "home",
      icon: Home,
    },
    {
      href: "/sholat",
      key: "prayer",
      icon: Clock,
    },
    {
      href: "/quran",
      key: "quran",
      icon: BookOpen,
    },
    {
      href: "/kajian",
      key: "study",
      icon: GraduationCap,
    },
    {
      href: "/ebook",
      key: "books",
      icon: BookMarked,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-awqaf-border-light safe-area-pb"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md"></div>

      {/* Navigation content */}
      <div className="relative flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const label = t_nav[item.key];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-0 flex-1
                ${
                  isActive
                    ? "bg-accent-100 text-awqaf-primary"
                    : "text-awqaf-foreground-secondary hover:text-awqaf-primary hover:bg-accent-50"
                }
              `}
            >
              {/* Icon container */}
              <div
                className={`
                relative flex items-center justify-center w-8 h-8 mb-1 transition-all duration-200
                ${isActive ? "scale-110" : "scale-100"}
              `}
              >
                <Icon
                  className={`
                    w-5 h-5 transition-all duration-200
                    ${
                      isActive
                        ? "text-awqaf-primary"
                        : "text-awqaf-foreground-secondary"
                    }
                  `}
                />

                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-awqaf-primary rounded-full animate-pulse"></div>
                )}
              </div>

              {/* Label */}
              <span
                className={`
                text-[10px] sm:text-xs font-medium transition-all duration-200 text-center leading-tight truncate w-full px-1
                ${
                  isActive
                    ? "text-awqaf-primary font-semibold"
                    : "text-awqaf-foreground-secondary"
                }
                font-comfortaa
              `}
              >
                {label}
              </span>

              {/* Active background highlight */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-t from-accent-200/20 to-transparent rounded-xl pointer-events-none"></div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-200 to-transparent"></div>
    </nav>
  );
}