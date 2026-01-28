"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/app/hooks/useI18n"; // Import Hook i18n

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface InstallTranslations {
  installedTitle: string;
  installTitle: string;
  installDesc: string;
  installBtn: string;
  laterBtn: string;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// --- TRANSLATION DICTIONARY ---
const INSTALL_TEXT: Record<LocaleCode, InstallTranslations> = {
  id: {
    installedTitle: "Aplikasi Terinstall!",
    installTitle: "Install IbadahApp",
    installDesc:
      "Install aplikasi untuk akses yang lebih mudah dan fitur offline",
    installBtn: "Install",
    laterBtn: "Nanti",
  },
  en: {
    installedTitle: "App Installed!",
    installTitle: "Install IbadahApp",
    installDesc: "Install the app for easier access and offline features",
    installBtn: "Install",
    laterBtn: "Later",
  },
  ar: {
    installedTitle: "تم تثبيت التطبيق!",
    installTitle: "تثبيت IbadahApp",
    installDesc: "قم بتثبيت التطبيق لسهولة الوصول والميزات دون اتصال",
    installBtn: "تثبيت",
    laterBtn: "لاحقاً",
  },
  fr: {
    installedTitle: "Application installée !",
    installTitle: "Installer IbadahApp",
    installDesc:
      "Installez l'application pour un accès plus facile et hors ligne",
    installBtn: "Installer",
    laterBtn: "Plus tard",
  },
  kr: {
    installedTitle: "앱이 설치되었습니다!",
    installTitle: "IbadahApp 설치",
    installDesc: "더 쉬운 접근과 오프라인 기능을 위해 앱을 설치하세요",
    installBtn: "설치",
    laterBtn: "나중에",
  },
  jp: {
    installedTitle: "アプリがインストールされました！",
    installTitle: "IbadahAppをインストール",
    installDesc: "簡単なアクセスとオフライン機能のためにアプリをインストール",
    installBtn: "インストール",
    laterBtn: "後で",
  },
};

export default function PWAInstaller() {
  const { locale } = useI18n(); // Ambil locale dari hook
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Safe Locale Access
  const safeLocale = (
    INSTALL_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = INSTALL_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (isInstalled) {
    return (
      <div
        className={`fixed bottom-4 ${isRtl ? "left-4" : "right-4"} bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg shadow-lg z-50`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium font-comfortaa">
            {t.installedTitle}
          </span>
        </div>
      </div>
    );
  }

  if (!showInstallButton) {
    return null;
  }

  return (
    <div
      className={`fixed top-4 ${isRtl ? "left-4" : "right-4"} bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 font-comfortaa">
            {t.installTitle}
          </h3>
          <p className="text-xs text-gray-600 mt-1 font-comfortaa">
            {t.installDesc}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleInstallClick}
              className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors font-comfortaa"
            >
              {t.installBtn}
            </button>
            <button
              onClick={() => setShowInstallButton(false)}
              className="text-gray-500 text-xs px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors font-comfortaa"
            >
              {t.laterBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}