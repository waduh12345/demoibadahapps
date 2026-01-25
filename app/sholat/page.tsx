"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Clock,
  MapPin,
  Calendar,
  Navigation,
  AlertCircle,
  CheckCircle,
  Loader2,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Check,
  Circle,
  CheckCircle2,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useI18n } from "@/app/hooks/useI18n";

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface PrayerTime {
  name: string;
  arabic: string;
  time: string;
  status: "completed" | "current" | "upcoming";
}

interface AladhanResponse {
  data: {
    timings: {
      Fajr: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
      [key: string]: string;
    };
  };
}

// Popular Adhan Audio URL - Mishary Rashid Alafasy (most popular reciter worldwide)
// Using multiple fallback URLs for reliability
const ADHAN_URLS = [
  "https://www.islamcan.com/audio/adhan/azan1.mp3", // Full Adhan - Makkah style
  "https://media.sd.ma/assabile/adhan_3435/8bdb88c0b65f.mp3", // Mishary Rashid Alafasy
  "https://cdn.aladhan.com/audio/mishary/adhan.mp3", // Aladhan CDN fallback
];

export default function SholatPage() {
  const { t, locale } = useI18n();
  const [location, setLocation] = useState<Location | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");

  // Adhan Reminder States
  const [isAdhanEnabled, setIsAdhanEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    "granted" | "denied" | "default"
  >("default");
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);
  const [currentAdhanPrayer, setCurrentAdhanPrayer] = useState<string | null>(
    null
  );

  // Prayer Checklist States
  const [prayerChecklist, setPrayerChecklist] = useState<Record<string, boolean>>({});
  const [showMotivationDialog, setShowMotivationDialog] = useState(false);
  const [completedPrayerName, setCompletedPrayerName] = useState<string>("");

  // Refs
  const adhanAudioRef = useRef<HTMLAudioElement | null>(null);
  const adhanTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Helper to determine status based on current time and prayer time
  const getPrayerStatus = (
    prayerTimeStr: string,
    nextPrayerTimeStr: string | null
  ): "completed" | "current" | "upcoming" => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (!prayerTimeStr) return "upcoming";

    // API returns "04:45" or "04:45 (WIB)". We need to clean it just in case.
    const cleanTime = prayerTimeStr.split(" ")[0];
    const [pHeader, pMinute] = cleanTime.split(":").map(Number);
    const prayerTimeMinutes = pHeader * 60 + pMinute;

    if (currentTime < prayerTimeMinutes) {
      return "upcoming";
    }

    if (nextPrayerTimeStr) {
      const cleanNextTime = nextPrayerTimeStr.split(" ")[0];
      const [nHeader, nMinute] = cleanNextTime.split(":").map(Number);
      const nextPrayerTimeMinutes = nHeader * 60 + nMinute;
      if (
        currentTime >= prayerTimeMinutes &&
        currentTime < nextPrayerTimeMinutes
      ) {
        return "current";
      }
    } else {
      // Logic for Isha (last prayer of day)
      if (currentTime >= prayerTimeMinutes) {
        return "current";
      }
    }

    return "completed";
  };

  const fetchPrayerTimes = async (lat: number, lng: number) => {
    try {
      const date = new Date();
      // Ensure DD-MM-YYYY format with leading zeros
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const dateString = `${day}-${month}-${year}`;

      // Using Aladhan API with https protocol
      const apiUrl = `https://api.aladhan.com/v1/timings/${dateString}?latitude=${lat}&longitude=${lng}&method=20`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: AladhanResponse = await response.json();

      if (!data || !data.data || !data.data.timings) {
        throw new Error("Invalid API response structure");
      }

      const timings = data.data.timings;

      // Map API response to our interface - using i18n for prayer names
      const rawPrayers = [
        { name: t("prayer.prayerNames.fajr"), arabic: "الفجر", time: timings.Fajr },
        { name: t("prayer.prayerNames.dhuhr"), arabic: "الظهر", time: timings.Dhuhr },
        { name: t("prayer.prayerNames.asr"), arabic: "العصر", time: timings.Asr },
        { name: t("prayer.prayerNames.maghrib"), arabic: "المغرب", time: timings.Maghrib },
        { name: t("prayer.prayerNames.isha"), arabic: "العشاء", time: timings.Isha },
      ];

      const processedPrayers: PrayerTime[] = rawPrayers.map((p, index) => {
        const nextPrayer = rawPrayers[index + 1];
        const status = getPrayerStatus(
          p.time,
          nextPrayer ? nextPrayer.time : null
        );
        return {
          ...p,
          status,
        };
      });

      setPrayerTimes(processedPrayers);
    } catch (err) {
      console.error("Failed to fetch prayer times:", err);
      const errorMessages: Record<string, string> = {
        id: "Gagal memuat jadwal sholat. Periksa koneksi internet Anda.",
        en: "Failed to load prayer times. Check your internet connection.",
        ar: "فشل تحميل أوقات الصلاة. تحقق من اتصالك بالإنترنت.",
        fr: "Échec du chargement des horaires de prière. Vérifiez votre connexion Internet.",
        kr: "기도 시간을 불러오지 못했습니다. 인터넷 연결을 확인하세요.",
        jp: "礼拝時間の読み込みに失敗しました。インターネット接続を確認してください。",
      };
      setError(errorMessages[locale] || errorMessages.id);
    }
  };

  // Load prayer checklist from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedChecklist = localStorage.getItem(`prayer-checklist-${today}`);
    
    if (savedChecklist) {
      setPrayerChecklist(JSON.parse(savedChecklist));
    } else {
      // Reset checklist for new day
      setPrayerChecklist({});
    }
  }, []);

  // Save prayer checklist to localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`prayer-checklist-${today}`, JSON.stringify(prayerChecklist));
  }, [prayerChecklist]);

  // Update prayer names when locale changes
  useEffect(() => {
    if (prayerTimes.length > 0 && location) {
      const updatedPrayers = prayerTimes.map((prayer, index) => {
        const prayerNames = [
          t("prayer.prayerNames.fajr"),
          t("prayer.prayerNames.dhuhr"),
          t("prayer.prayerNames.asr"),
          t("prayer.prayerNames.maghrib"),
          t("prayer.prayerNames.isha"),
        ];
        return {
          ...prayer,
          name: prayerNames[index],
        };
      });
      setPrayerTimes(updatedPrayers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, t]);

  // Calculate prayer progress
  const prayerProgress = useMemo(() => {
    if (prayerTimes.length === 0) return 0;
    const checkedCount = Object.values(prayerChecklist).filter(Boolean).length;
    return Math.round((checkedCount / prayerTimes.length) * 100);
  }, [prayerChecklist, prayerTimes]);

  // Toggle prayer checklist
  const togglePrayerCheck = (prayerName: string) => {
    const newChecklist = { ...prayerChecklist };
    const isCurrentlyChecked = newChecklist[prayerName];
    
    if (!isCurrentlyChecked) {
      // Checking the prayer
      newChecklist[prayerName] = true;
      setPrayerChecklist(newChecklist);
      
      // Show motivation dialog
      setCompletedPrayerName(prayerName);
      setShowMotivationDialog(true);
    } else {
      // Unchecking the prayer
      newChecklist[prayerName] = false;
      setPrayerChecklist(newChecklist);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      const errorMessages: Record<string, string> = {
        id: "Geolocation tidak didukung oleh browser ini",
        en: "Geolocation is not supported by this browser",
        ar: "الموقع الجغرافي غير مدعوم في هذا المتصفح",
        fr: "La géolocalisation n'est pas prise en charge par ce navigateur",
        kr: "이 브라우저에서 지리적 위치를 지원하지 않습니다",
        jp: "このブラウザでは位置情報がサポートされていません",
      };
      setError(errorMessages[locale] || errorMessages.id);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocoding to get city name
          const localeMap: Record<string, string> = {
            id: "id",
            en: "en",
            ar: "ar",
            fr: "fr",
            kr: "ko",
            jp: "ja",
          };
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${localeMap[locale] || "id"}`
          );

          // Only process if response is OK
          const unknownLocation: Record<string, { city: string; country: string }> = {
            id: { city: "Lokasi tidak diketahui", country: "Indonesia" },
            en: { city: "Unknown location", country: "Indonesia" },
            ar: { city: "موقع غير معروف", country: "إندونيسيا" },
            fr: { city: "Emplacement inconnu", country: "Indonésie" },
            kr: { city: "알 수 없는 위치", country: "인도네시아" },
            jp: { city: "不明な場所", country: "インドネシア" },
          };
          let locationData = unknownLocation[locale] || unknownLocation.id;
          if (response.ok) {
            const data = await response.json();
            locationData = {
              city: data.city || data.locality || locationData.city,
              country: data.countryName || locationData.country,
            };
          }

          const newLocation: Location = {
            latitude,
            longitude,
            city: locationData.city,
            country: locationData.country,
          };

          setLocation(newLocation);
          // Fetch prayer times using real coordinates
          await fetchPrayerTimes(latitude, longitude);
          setPermissionStatus("granted");
        } catch (err) {
          console.error("Location or API Error:", err);
          const errorMessages: Record<string, string> = {
            id: "Gagal mendapatkan data lokasi atau jadwal.",
            en: "Failed to get location or schedule data.",
            ar: "فشل في الحصول على بيانات الموقع أو الجدول.",
            fr: "Échec de l'obtention des données de localisation ou d'horaire.",
            kr: "위치 또는 일정 데이터를 가져오지 못했습니다.",
            jp: "位置情報またはスケジュールデータの取得に失敗しました。",
          };
          setError(errorMessages[locale] || errorMessages.id);

          // Still try to set location if we have coordinates but geocoding failed
          const currentLocationText: Record<string, { city: string; country: string }> = {
            id: { city: "Lokasi saat ini", country: "Indonesia" },
            en: { city: "Current location", country: "Indonesia" },
            ar: { city: "الموقع الحالي", country: "إندونيسيا" },
            fr: { city: "Emplacement actuel", country: "Indonésie" },
            kr: { city: "현재 위치", country: "인도네시아" },
            jp: { city: "現在の場所", country: "インド네시아" },
          };
          const currentLoc = currentLocationText[locale] || currentLocationText.id;
          const newLocation: Location = {
            latitude,
            longitude,
            city: currentLoc.city,
            country: currentLoc.country,
          };
          setLocation(newLocation);
          // Still try to fetch prayer times even if city name failed
          await fetchPrayerTimes(latitude, longitude);
        }

        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setPermissionStatus("denied");
        const errorMessages: Record<string, Record<number, string>> = {
          id: {
            1: "Akses lokasi ditolak. Silakan izinkan akses lokasi untuk melihat jadwal sholat.",
            2: "Informasi lokasi tidak tersedia.",
            3: "Permintaan lokasi timeout.",
            0: "Terjadi kesalahan saat mendapatkan lokasi.",
          },
          en: {
            1: "Location access denied. Please allow location access to view prayer times.",
            2: "Location information unavailable.",
            3: "Location request timeout.",
            0: "An error occurred while getting location.",
          },
          ar: {
            1: "تم رفض الوصول إلى الموقع. يرجى السماح بالوصول إلى الموقع لعرض أوقات الصلاة.",
            2: "معلومات الموقع غير متاحة.",
            3: "انتهت مهلة طلب الموقع.",
            0: "حدث خطأ أثناء الحصول على الموقع.",
          },
          fr: {
            1: "Accès à la localisation refusé. Veuillez autoriser l'accès à la localisation pour voir les horaires de prière.",
            2: "Informations de localisation indisponibles.",
            3: "Délai d'attente de la demande de localisation expiré.",
            0: "Une erreur s'est produite lors de l'obtention de la localisation.",
          },
          kr: {
            1: "위치 액세스가 거부되었습니다. 기도 시간을 보려면 위치 액세스를 허용하세요.",
            2: "위치 정보를 사용할 수 없습니다.",
            3: "위치 요청 시간 초과.",
            0: "위치를 가져오는 중 오류가 발생했습니다.",
          },
          jp: {
            1: "位置情報へのアクセスが拒否されました。礼拝時間を表示するには、位置情報へのアクセスを許可してください。",
            2: "位置情報が利用できません。",
            3: "位置情報のリクエストがタイムアウトしました。",
            0: "位置情報の取得中にエラーが発生しました。",
          },
        };
        const messages = errorMessages[locale] || errorMessages.id;
        setError(messages[error.code as keyof typeof messages] || messages[0]);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  useEffect(() => {
    // Check if geolocation is available
    if (navigator.geolocation) {
      setPermissionStatus("prompt");
    } else {
      const errorMessages: Record<string, string> = {
        id: "Geolocation tidak didukung oleh browser ini",
        en: "Geolocation is not supported by this browser",
        ar: "الموقع الجغرافي غير مدعوم في هذا المتصفح",
        fr: "La géolocalisation n'est pas prise en charge par ce navigateur",
        kr: "이 브라우저에서 지리적 위치를 지원하지 않습니다",
        jp: "このブラウザでは位置情報がサポートされていません",
      };
      setError(errorMessages[locale] || errorMessages.id);
    }

    // Load adhan preference from localStorage
    const savedAdhanPref = localStorage.getItem("adhan-reminder-enabled");
    if (savedAdhanPref === "true") {
      setIsAdhanEnabled(true);
    }

    // Check notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    // Initialize audio element with fallback
    const initAudio = () => {
      const audio = new Audio(ADHAN_URLS[0]);
      audio.preload = "auto";

      // Add error handler to try fallback URLs
      let currentUrlIndex = 0;
      audio.onerror = () => {
        currentUrlIndex++;
        if (currentUrlIndex < ADHAN_URLS.length) {
          audio.src = ADHAN_URLS[currentUrlIndex];
          audio.load();
        }
      };

      return audio;
    };

    adhanAudioRef.current = initAudio();

    // Cleanup on unmount
    return () => {
      // Clear all timers
      adhanTimersRef.current.forEach((timer) => clearTimeout(timer));
      adhanTimersRef.current = [];

      // Stop and cleanup audio
      if (adhanAudioRef.current) {
        adhanAudioRef.current.pause();
        adhanAudioRef.current = null;
      }
    };
  }, []);

  // Play Adhan function
  const playAdhan = useCallback((prayerName: string) => {
    if (!adhanAudioRef.current) {
      adhanAudioRef.current = new Audio(ADHAN_URLS[0]);
    }

    setCurrentAdhanPrayer(prayerName);
    setIsAdhanPlaying(true);

    // Show notification
    if ("Notification" in window && Notification.permission === "granted") {
      const notificationTitles: Record<string, string> = {
        id: `Waktu ${prayerName}`,
        en: `${prayerName} Time`,
        ar: `وقت ${prayerName}`,
        fr: `Heure de ${prayerName}`,
        kr: `${prayerName} 시간`,
        jp: `${prayerName}の時間`,
      };
      const notificationBodies: Record<string, string> = {
        id: `Saatnya menunaikan sholat ${prayerName}`,
        en: `Time to perform ${prayerName} prayer`,
        ar: `حان وقت أداء صلاة ${prayerName}`,
        fr: `Il est temps d'effectuer la prière ${prayerName}`,
        kr: `${prayerName} 기도를 수행할 시간입니다`,
        jp: `${prayerName}の礼拝を行う時間です`,
      };
      new Notification(notificationTitles[locale] || notificationTitles.id, {
        body: notificationBodies[locale] || notificationBodies.id,
        icon: "/icons/icon-192x192.png",
        tag: `adhan-${prayerName}`,
        requireInteraction: true,
      });
    }

    // Play adhan audio
    adhanAudioRef.current.currentTime = 0;
    adhanAudioRef.current
      .play()
      .then(() => {
        console.log(`Playing adhan for ${prayerName}`);
      })
      .catch((err) => {
        console.error("Error playing adhan:", err);
        setIsAdhanPlaying(false);
        setCurrentAdhanPrayer(null);
      });

    // Handle audio end
    adhanAudioRef.current.onended = () => {
      setIsAdhanPlaying(false);
      setCurrentAdhanPrayer(null);
    };
  }, []);

  // Stop Adhan function
  const stopAdhan = useCallback(() => {
    if (adhanAudioRef.current) {
      adhanAudioRef.current.pause();
      adhanAudioRef.current.currentTime = 0;
    }
    setIsAdhanPlaying(false);
    setCurrentAdhanPrayer(null);
  }, []);

  // Schedule Adhan reminders
  const scheduleAdhanReminders = useCallback(() => {
    // Clear existing timers
    adhanTimersRef.current.forEach((timer) => clearTimeout(timer));
    adhanTimersRef.current = [];

    if (!isAdhanEnabled || prayerTimes.length === 0) return;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    prayerTimes.forEach((prayer) => {
      // Parse prayer time
      const cleanTime = prayer.time.split(" ")[0];
      const [hours, minutes] = cleanTime.split(":").map(Number);
      const prayerMinutes = hours * 60 + minutes;

      // Only schedule if prayer time is in the future
      if (prayerMinutes > currentMinutes) {
        const delayMs = (prayerMinutes - currentMinutes) * 60 * 1000;

        const timer = setTimeout(() => {
          playAdhan(prayer.name);
        }, delayMs);

        adhanTimersRef.current.push(timer);
        console.log(
          `Scheduled adhan for ${prayer.name} in ${Math.round(delayMs / 60000)} minutes`
        );
      }
    });
  }, [isAdhanEnabled, prayerTimes, playAdhan]);

  // Effect to schedule adhan when enabled or prayer times change
  useEffect(() => {
    scheduleAdhanReminders();

    // Reschedule every minute to handle edge cases
    const intervalId = setInterval(() => {
      scheduleAdhanReminders();
    }, 60000);

    return () => {
      clearInterval(intervalId);
      adhanTimersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, [scheduleAdhanReminders]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      const messages: Record<string, string> = {
        id: "Browser tidak mendukung notifikasi",
        en: "Browser does not support notifications",
        ar: "المتصفح لا يدعم الإشعارات",
        fr: "Le navigateur ne prend pas en charge les notifications",
        kr: "브라우저가 알림을 지원하지 않습니다",
        jp: "ブラウザが通知をサポートしていません",
      };
      alert(messages[locale] || messages.id);
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === "granted";
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      return false;
    }
  };

  // Toggle Adhan Reminder
  const toggleAdhanReminder = async () => {
    if (!isAdhanEnabled) {
      // Enabling - request notification permission first
      const hasPermission = await requestNotificationPermission();

      if (hasPermission || notificationPermission === "granted") {
        setIsAdhanEnabled(true);
        localStorage.setItem("adhan-reminder-enabled", "true");

        // Test audio can play (browsers require user interaction)
        if (adhanAudioRef.current) {
          adhanAudioRef.current.volume = 0.1;
          adhanAudioRef.current
            .play()
            .then(() => {
              setTimeout(() => {
                if (adhanAudioRef.current) {
                  adhanAudioRef.current.pause();
                  adhanAudioRef.current.currentTime = 0;
                  adhanAudioRef.current.volume = 1;
                }
              }, 500);
            })
            .catch((err) => {
              console.log("Audio autoplay blocked:", err);
            });
        }
      } else {
        const messages: Record<string, string> = {
          id: "Izinkan notifikasi untuk mengaktifkan pengingat adzan. Silakan cek pengaturan browser Anda.",
          en: "Allow notifications to enable adhan reminder. Please check your browser settings.",
          ar: "السماح بالإشعارات لتفعيل تذكير الأذان. يرجى التحقق من إعدادات المتصفح.",
          fr: "Autorisez les notifications pour activer le rappel d'adhan. Veuillez vérifier les paramètres de votre navigateur.",
          kr: "아잔 알림을 활성화하려면 알림을 허용하세요. 브라우저 설정을 확인하세요.",
          jp: "アザーンリマインダーを有効にするには、通知を許可してください。ブラウザの設定を確認してください。",
        };
        alert(messages[locale] || messages.id);
      }
    } else {
      // Disabling
      setIsAdhanEnabled(false);
      localStorage.setItem("adhan-reminder-enabled", "false");
      stopAdhan();

      // Clear all scheduled timers
      adhanTimersRef.current.forEach((timer) => clearTimeout(timer));
      adhanTimersRef.current = [];
    }
  };

  // Test play adhan
  const testPlayAdhan = () => {
    if (isAdhanPlaying) {
      stopAdhan();
    } else {
      const testText: Record<string, string> = {
        id: "Test",
        en: "Test",
        ar: "اختبار",
        fr: "Test",
        kr: "테스트",
        jp: "テスト",
      };
      playAdhan(testText[locale] || testText.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <h1 className="text-xl font-bold text-awqaf-primary font-comfortaa text-center">
              {t("prayer.title")}
            </h1>
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center mt-1">
              {t("prayer.subtitle")}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Location Card */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-awqaf-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-card-foreground font-comfortaa">
                  {t("prayer.currentLocation")}
                </h2>
                {location ? (
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    {location.city}, {location.country}
                  </p>
                ) : (
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    {t("prayer.locationNotSet")}
                  </p>
                )}
              </div>
              {permissionStatus === "granted" && (
                <CheckCircle className="w-5 h-5 text-success" />
              )}
            </div>

            {!location && (
              <div className="space-y-3">
                <Button
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("prayer.gettingLocation")}
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      {t("prayer.useCurrentLocation")}
                    </>
                  )}
                </Button>

                {/* Error message displayed below the button */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600 font-comfortaa">
                      {error}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Adhan Reminder Card */}
        {location && prayerTimes.length > 0 && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isAdhanEnabled
                        ? "bg-awqaf-primary text-white"
                        : "bg-accent-100 text-awqaf-primary"
                    }`}
                  >
                    {isAdhanEnabled ? (
                      <Bell className="w-5 h-5" />
                    ) : (
                      <BellOff className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground font-comfortaa">
                      {t("prayer.adhanReminder")}
                    </h3>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {isAdhanEnabled
                        ? t("prayer.adhanActive")
                        : t("prayer.activateReminder")}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={toggleAdhanReminder}
                  variant={isAdhanEnabled ? "default" : "outline"}
                  size="sm"
                  className={`font-comfortaa ${
                    isAdhanEnabled
                      ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                      : "border-awqaf-border-light"
                  }`}
                >
                  {isAdhanEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" />
                      {t("prayer.active")}
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 mr-2" />
                      {t("prayer.inactive")}
                    </>
                  )}
                </Button>
              </div>

              {/* Test Play Button & Status */}
              {isAdhanEnabled && (
                <div className="mt-4 pt-4 border-t border-awqaf-border-light">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                        {isAdhanPlaying
                          ? `${t("prayer.playingAdhan")} ${currentAdhanPrayer}...`
                          : t("prayer.testAdhan")}
                      </span>
                    </div>
                    <Button
                      onClick={testPlayAdhan}
                      variant="outline"
                      size="sm"
                      className="border-awqaf-border-light font-comfortaa"
                    >
                      {isAdhanPlaying ? (
                        <>
                          <Square className="w-4 h-4 mr-2" />
                          {t("prayer.stop")}
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          {t("prayer.test")}
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Scheduled Prayers Info */}
                  <div className="mt-3 text-xs text-awqaf-foreground-secondary font-comfortaa">
                    <p>
                      {t("prayer.scheduledPrayers")}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {prayerTimes
                        .filter((p) => p.status === "upcoming" || p.status === "current")
                        .map((prayer) => (
                          <span
                            key={prayer.name}
                            className="px-2 py-1 bg-accent-100 rounded-full text-awqaf-primary"
                          >
                            {prayer.name} ({prayer.time})
                          </span>
                        ))}
                      {prayerTimes.filter(
                        (p) => p.status === "upcoming" || p.status === "current"
                      ).length === 0 && (
                        <span className="text-awqaf-foreground-secondary">
                          {t("prayer.allPrayersPassed")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Permission Warning */}
              {isAdhanEnabled && notificationPermission !== "granted" && (
                <div className="mt-3 flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <p className="text-xs text-yellow-700 font-comfortaa">
                    {t("prayer.allowNotification")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Prayer Times */}
        {location && prayerTimes.length > 0 && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-awqaf-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground font-comfortaa">
                    {t("prayer.todaySchedule")}
                  </h3>
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    {new Date().toLocaleDateString(
                      locale === "id" ? "id-ID" :
                      locale === "en" ? "en-US" :
                      locale === "ar" ? "ar-SA" :
                      locale === "fr" ? "fr-FR" :
                      locale === "kr" ? "ko-KR" :
                      locale === "jp" ? "ja-JP" : "id-ID",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* Prayer Progress */}
              <div className="mb-6 p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl border border-awqaf-border-light">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-awqaf-primary" />
                    <span className="font-semibold text-card-foreground font-comfortaa">
                      Progress Sholat Hari Ini
                    </span>
                  </div>
                  <span className={`text-2xl font-bold font-comfortaa ${prayerProgress === 100 ? "text-success" : "text-awqaf-primary"}`}>
                    {prayerProgress}%
                  </span>
                </div>
                <Progress value={prayerProgress} className="h-3 bg-accent-200" />
                <div className="flex items-center justify-between mt-2 text-xs font-comfortaa">
                  <span className="text-awqaf-foreground-secondary">
                    {Object.values(prayerChecklist).filter(Boolean).length} / {prayerTimes.length} Sholat
                  </span>
                  {prayerProgress === 100 ? (
                    <span className="text-success font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Alhamdulillah, lengkap!
                    </span>
                  ) : (
                    <span className="text-awqaf-primary font-semibold">
                      Tetap semangat! 💪
                    </span>
                  )}
                </div>
                <p className="text-xs text-center text-awqaf-foreground-secondary font-comfortaa mt-3 italic">
                  Klik lingkaran untuk menandai sholat yang sudah dikerjakan
                </p>
              </div>

              <div className="space-y-3">
                {prayerTimes.map((prayer) => {
                  const isChecked = prayerChecklist[prayer.name] || false;
                  
                  return (
                    <div
                      key={prayer.name}
                      className={`
                        flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-200
                        ${
                          isChecked
                            ? "bg-success/10 border-2 border-success/30"
                            : prayer.status === "current"
                            ? "bg-accent-100 border border-accent-200"
                            : "hover:bg-accent-50 border border-transparent"
                        }
                      `}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Checkbox */}
                        <button
                          onClick={() => togglePrayerCheck(prayer.name)}
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center transition-all
                            ${
                              isChecked
                                ? "bg-success text-white"
                                : prayer.status === "current"
                                ? "bg-awqaf-primary text-white hover:bg-awqaf-primary/90"
                                : "bg-accent-100 text-awqaf-primary hover:bg-accent-200"
                            }
                          `}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-card-foreground font-comfortaa font-semibold text-lg ${isChecked ? "line-through opacity-70" : ""}`}>
                              {prayer.name}
                            </span>
                            {isChecked && (
                              <CheckCircle className="w-4 h-4 text-success" />
                            )}
                          </div>
                          <p className="text-sm text-awqaf-primary font-tajawal">
                            {prayer.arabic}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`
                            font-comfortaa font-bold text-xl
                            ${
                              isChecked
                                ? "text-success"
                                : prayer.status === "current"
                                ? "text-awqaf-primary"
                                : "text-awqaf-foreground-secondary"
                            }
                          `}
                        >
                          {prayer.time}
                        </span>
                        {isChecked && (
                          <p className="text-xs text-success font-comfortaa mt-1 font-semibold">
                            ✓ Sudah Sholat
                          </p>
                        )}
                        {!isChecked && prayer.status === "current" && (
                          <p className="text-xs text-success font-comfortaa mt-1">
                            {t("prayer.currentlyOngoing")}
                          </p>
                        )}
                        {!isChecked && prayer.status === "completed" && (
                          <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mt-1">
                            {t("prayer.completed")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Location Message or Error Persistence (if location null but tried) */}
        {!location && !isLoading && !error && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-awqaf-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                {t("prayer.locationRequired")}
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-4">
                {t("prayer.locationRequiredDesc")}
              </p>
              <Button
                onClick={getCurrentLocation}
                className="bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {t("prayer.allowLocationAccess")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Additional error display if location failed but UI is in "No Location" state */}
        {!location && error && (
          <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg mx-4">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-sm text-red-600 font-comfortaa">{error}</p>
          </div>
        )}
      </main>

      {/* Motivation Dialog */}
      <Dialog open={showMotivationDialog} onOpenChange={setShowMotivationDialog}>
        <DialogContent className="border-awqaf-border-light p-0 max-w-sm">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
            </div>
            <DialogTitle className="font-comfortaa text-center text-xl">
              Alhamdulillah! 🎉
            </DialogTitle>
            <DialogDescription className="text-center font-comfortaa text-sm text-awqaf-foreground-secondary">
              Anda telah menyelesaikan sholat <span className="font-semibold text-awqaf-primary">{completedPrayerName}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 pb-6 space-y-4">
            <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-4 rounded-lg border border-awqaf-border-light">
              <p className="text-sm text-center text-awqaf-foreground font-comfortaa leading-relaxed">
                &quot;Sesungguhnya sholat itu mencegah dari perbuatan keji dan mungkar&quot;
              </p>
              <p className="text-xs text-center text-awqaf-foreground-secondary font-comfortaa mt-2">
                - QS. Al-Ankabut: 45
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                Terus jaga sholat 5 waktu untuk kebaikan dunia dan akhirat! 💪
              </p>
            </div>

            <Button
              onClick={() => setShowMotivationDialog(false)}
              className="w-full bg-success hover:bg-success/90 text-white font-comfortaa"
            >
              <Check className="w-4 h-4 mr-2" />
              Alhamdulillah
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}