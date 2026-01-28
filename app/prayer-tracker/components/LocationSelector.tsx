"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Location } from "../hooks/usePrayerTracker";
import { useI18n } from "@/app/hooks/useI18n";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface LocationTranslations {
  title: string;
  yourLocation: string;
  detected: string;
  autoDetect: string;
  errorGps: string;
  errorBrowser: string;
}

// --- TRANSLATION DICTIONARY ---
const LOCATION_TEXT: Record<LocaleCode, LocationTranslations> = {
  id: {
    title: "Lokasi Sholat",
    yourLocation: "Lokasi Anda",
    detected: "Terdeteksi",
    autoDetect: "Auto Detect",
    errorGps: "Gagal mendapatkan lokasi. Pastikan GPS aktif.",
    errorBrowser: "Browser tidak mendukung geolocation",
  },
  en: {
    title: "Prayer Location",
    yourLocation: "Your Location",
    detected: "Detected",
    autoDetect: "Auto Detect",
    errorGps: "Failed to get location. Ensure GPS is on.",
    errorBrowser: "Browser does not support geolocation",
  },
  ar: {
    title: "موقع الصلاة",
    yourLocation: "موقعك",
    detected: "تم الكشف عنه",
    autoDetect: "كشف تلقائي",
    errorGps: "فشل في الحصول على الموقع. تأكد من تشغيل GPS.",
    errorBrowser: "المتصفح لا يدعم الموقع الجغرافي",
  },
  fr: {
    title: "Lieu de prière",
    yourLocation: "Votre position",
    detected: "Détecté",
    autoDetect: "Détection auto",
    errorGps: "Impossible d'obtenir la localisation. Vérifiez le GPS.",
    errorBrowser: "Le navigateur ne supporte pas la géolocalisation",
  },
  kr: {
    title: "기도 위치",
    yourLocation: "현재 위치",
    detected: "감지됨",
    autoDetect: "자동 감지",
    errorGps: "위치를 가져올 수 없습니다. GPS를 확인하세요.",
    errorBrowser: "브라우저가 위치 정보를 지원하지 않습니다",
  },
  jp: {
    title: "礼拝の場所",
    yourLocation: "現在地",
    detected: "検出済み",
    autoDetect: "自動検出",
    errorGps: "位置情報を取得できませんでした。GPSを確認してください。",
    errorBrowser: "ブラウザが位置情報をサポートしていません",
  },
};

interface LocationSelectorProps {
  currentLocation: Location;
  onLocationChange: (location: Location) => void;
}

export default function LocationSelector({
  currentLocation,
  onLocationChange,
}: LocationSelectorProps) {
  const { locale } = useI18n();
  const [isLocating, setIsLocating] = useState(false);

  // Safe Locale Access
  const safeLocale = (
    LOCATION_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t_loc = LOCATION_TEXT[safeLocale];

  const handleAutoLocate = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Reverse geocode optional, but good for UI
          // For now we set basic info using translated text
          const newLocation: Location = {
            id: "auto",
            name: t_loc.yourLocation,
            city: t_loc.detected,
            country: "Indonesia", // Default fallback, or use API to get country
            latitude,
            longitude,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          };

          onLocationChange(newLocation);
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(t_loc.errorGps);
          setIsLocating(false);
        },
      );
    } else {
      alert(t_loc.errorBrowser);
      setIsLocating(false);
    }
  };

  return (
    <Card className="border-awqaf-border-light">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-awqaf-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
                {t_loc.title}
              </h3>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                {currentLocation.city}
                <span className="opacity-50 text-[10px] ml-1">
                  ({currentLocation.latitude.toFixed(2)},{" "}
                  {currentLocation.longitude.toFixed(2)})
                </span>
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoLocate}
            disabled={isLocating}
            className="text-xs h-8 font-comfortaa"
          >
            {isLocating ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Navigation className="w-3 h-3 mr-1" />
            )}
            {t_loc.autoDetect}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}