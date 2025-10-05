"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Clock, BookOpen, GraduationCap, BookMarked } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortLabel: string;
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Beranda",
    icon: Home,
    shortLabel: "Home",
  },
  {
    href: "/sholat",
    label: "Sholat",
    icon: Clock,
    shortLabel: "Prayer",
  },
  {
    href: "/quran",
    label: "Al-Qur'an",
    icon: BookOpen,
    shortLabel: "Quran",
  },
  {
    href: "/kajian",
    label: "Kajian",
    icon: GraduationCap,
    shortLabel: "Study",
  },
  {
    href: "/ebook",
    label: "E-Book",
    icon: BookMarked,
    shortLabel: "Books",
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-awqaf-border-light safe-area-pb">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md"></div>

      {/* Navigation content */}
      <div className="relative flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

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
                text-xs font-medium transition-all duration-200 text-center leading-tight
                ${
                  isActive
                    ? "text-awqaf-primary font-semibold"
                    : "text-awqaf-foreground-secondary"
                }
              `}
              >
                {item.label}
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
