"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RotateCcw,
  Settings,
  X,
  Info,
  Check,
  ArrowLeft,
  Plus,
  Trash2,
  Vibrate,
  Target,
  Percent,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/app/hooks/useI18n";
import { LocaleCode } from "@/lib/i18n";

// --- TYPES ---
interface DhikrItem {
  id: string;
  label: string;
  arabic: string;
  isCustom?: boolean;
}

interface TasbihSettings {
  target: number;
  activeDhikrId: string;
  vibrate: boolean;
}

// --- CONSTANTS ---
const DEFAULT_DHIKR: DhikrItem[] = [
  { id: "subhanallah", label: "Subhanallah", arabic: "سُبْحَانَ اللّٰهِ" },
  { id: "alhamdulillah", label: "Alhamdulillah", arabic: "اَلْحَمْدُ لِلّٰهِ" },
  { id: "allahuakbar", label: "Allahu Akbar", arabic: "اَللّٰهُ أَكْبَرُ" },
  {
    id: "lailahaillallah",
    label: "Laa Ilaaha Illallah",
    arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ",
  },
  {
    id: "astaghfirullah",
    label: "Astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللّٰهَ",
  },
  {
    id: "sholawat",
    label: "Sholawat Nabi",
    arabic: "صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ",
  },
];

const TARGET_OPTIONS = [33, 99, 100, 1000, Infinity];

// --- TRANSLATIONS ---
interface UIText {
  title: string;
  subtitle: string;
  settings: string;
  selectDhikr: string;
  targetCount: string;
  customDhikr: string;
  add: string;
  labelPlaceholder: string;
  arabicPlaceholder: string;
  reset: string;
  guide: string;
  guideDesc: string;
  vibration: string;
  completed: string;
  tapToCount: string;
  statTotal: string;
  statTarget: string;
  statProgress: string;
}

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Tasbih Digital",
    subtitle: "Penghitung Dzikir",
    settings: "Pengaturan",
    selectDhikr: "Pilih Bacaan",
    targetCount: "Target",
    customDhikr: "Tambah Bacaan Baru",
    add: "Simpan",
    labelPlaceholder: "Judul Dzikir",
    arabicPlaceholder: "Teks Arab / Latin",
    reset: "Reset",
    guide: "Panduan",
    guideDesc:
      "Tekan lingkaran besar untuk menghitung. Getaran akan muncul saat mencapai target.",
    vibration: "Getaran",
    completed: "Selesai",
    tapToCount: "Tekan",
    statTotal: "Jumlah",
    statTarget: "Target",
    statProgress: "Progres",
  },
  en: {
    title: "Digital Tasbih",
    subtitle: "Dhikr Counter",
    settings: "Settings",
    selectDhikr: "Select Dhikr",
    targetCount: "Target",
    customDhikr: "Add Custom Dhikr",
    add: "Save",
    labelPlaceholder: "Title",
    arabicPlaceholder: "Arabic / Text",
    reset: "Reset",
    guide: "Guide",
    guideDesc:
      "Tap the large circle to count. It will vibrate when the target is reached.",
    vibration: "Vibration",
    completed: "Done",
    tapToCount: "Tap",
    statTotal: "Count",
    statTarget: "Target",
    statProgress: "Progress",
  },
  ar: {
    title: "السبحة الإلكترونية",
    subtitle: "عداد الذكر",
    settings: "الإعدادات",
    selectDhikr: "اختر الذكر",
    targetCount: "الهدف",
    customDhikr: "إضافة ذكر خاص",
    add: "حفظ",
    labelPlaceholder: "العنوان",
    arabicPlaceholder: "النص العربي",
    reset: "إعادة ضبط",
    guide: "دليل",
    guideDesc: "اضغط على الدائرة الكبيرة للعد. سيهتز الجهاز عند الوصول للهدف.",
    vibration: "اهتزاز",
    completed: "اكتمل",
    tapToCount: "اضغط",
    statTotal: "العدد",
    statTarget: "الهدف",
    statProgress: "التقدم",
  },
  fr: {
    title: "Tasbih Numérique",
    subtitle: "Compteur de Dhikr",
    settings: "Paramètres",
    selectDhikr: "Choisir Dhikr",
    targetCount: "Objectif",
    customDhikr: "Ajouter personnalisé",
    add: "Sauvegarder",
    labelPlaceholder: "Titre",
    arabicPlaceholder: "Texte",
    reset: "Réinitialiser",
    guide: "Guide",
    guideDesc: "Appuyez sur le grand cercle.",
    vibration: "Vibration",
    completed: "Terminé",
    tapToCount: "Appuyer",
    statTotal: "Total",
    statTarget: "Cible",
    statProgress: "Progrès",
  },
  kr: {
    title: "디지털 타스비",
    subtitle: "지크르 카운터",
    settings: "설정",
    selectDhikr: "지크르 선택",
    targetCount: "목표",
    customDhikr: "사용자 지정 추가",
    add: "저장",
    labelPlaceholder: "제목",
    arabicPlaceholder: "텍스트",
    reset: "초기화",
    guide: "가이드",
    guideDesc: "큰 원을 탭하여 카운트하세요.",
    vibration: "진동",
    completed: "완료",
    tapToCount: "탭",
    statTotal: "합계",
    statTarget: "목표",
    statProgress: "진행",
  },
  jp: {
    title: "デジタルタスビ",
    subtitle: "カウンター",
    settings: "設定",
    selectDhikr: "選択",
    targetCount: "目標",
    customDhikr: "カスタム追加",
    add: "保存",
    labelPlaceholder: "タイトル",
    arabicPlaceholder: "テキスト",
    reset: "リセット",
    guide: "ガイド",
    guideDesc: "円をタップしてカウントします。",
    vibration: "振動",
    completed: "完了",
    tapToCount: "タップ",
    statTotal: "合計",
    statTarget: "目標",
    statProgress: "進捗",
  },
};

export default function TasbihPage() {
  const { locale } = useI18n();
  const safeLocale = (
    UI_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // --- STATE ---
  const [isLoaded, setIsLoaded] = useState(false);
  const [count, setCount] = useState(0);
  const [settings, setSettings] = useState<TasbihSettings>({
    target: 33,
    activeDhikrId: "subhanallah",
    vibrate: true,
  });
  const [customDhikrs, setCustomDhikrs] = useState<DhikrItem[]>([]);

  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [ripple, setRipple] = useState(false);

  // Inputs
  const [newLabel, setNewLabel] = useState("");
  const [newArabic, setNewArabic] = useState("");

  // --- PERSISTENCE ---
  useEffect(() => {
    const savedSettings = localStorage.getItem("tasbih-settings");
    const savedCustoms = localStorage.getItem("tasbih-customs");
    const savedCount = localStorage.getItem("tasbih-count");

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedCustoms) setCustomDhikrs(JSON.parse(savedCustoms));
    if (savedCount) setCount(parseInt(savedCount));

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("tasbih-settings", JSON.stringify(settings));
      localStorage.setItem("tasbih-customs", JSON.stringify(customDhikrs));
      localStorage.setItem("tasbih-count", count.toString());
    }
  }, [settings, customDhikrs, count, isLoaded]);

  // --- LOGIC ---
  const allDhikr = [...DEFAULT_DHIKR, ...customDhikrs];
  const activeDhikr =
    allDhikr.find((d) => d.id === settings.activeDhikrId) || DEFAULT_DHIKR[0];

  const handleCount = () => {
    if (settings.vibrate && navigator.vibrate) navigator.vibrate(10);

    setRipple(true);
    setTimeout(() => setRipple(false), 200);

    const nextCount = count + 1;

    // Target Logic
    if (settings.target !== Infinity && nextCount > settings.target) {
      setCount(1);
      return;
    }

    if (nextCount === settings.target) {
      if (settings.vibrate && navigator.vibrate)
        navigator.vibrate([50, 100, 50]);
    }

    setCount(nextCount);
  };

  const handleReset = () => {
    if (settings.vibrate && navigator.vibrate) navigator.vibrate(30);
    setCount(0);
  };

  const addCustomDhikr = () => {
    if (!newLabel || !newArabic) return;
    const newItem: DhikrItem = {
      id: `custom-${Date.now()}`,
      label: newLabel,
      arabic: newArabic,
      isCustom: true,
    };
    setCustomDhikrs([...customDhikrs, newItem]);
    setSettings({ ...settings, activeDhikrId: newItem.id });
    setNewLabel("");
    setNewArabic("");
    setCount(0);
  };

  const deleteCustomDhikr = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = customDhikrs.filter((d) => d.id !== id);
    setCustomDhikrs(filtered);
    if (settings.activeDhikrId === id) {
      setSettings({ ...settings, activeDhikrId: "subhanallah" });
      setCount(0);
    }
  };

  const progress =
    settings.target === Infinity
      ? 0
      : Math.min((count / settings.target) * 100, 100);
  // Radius 120 -> Circumference approx 754
  const strokeDashoffset = 754 * (1 - progress / 100);

  if (!isLoaded) return null;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* HEADER */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors"
                >
                  <ArrowLeft
                    className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t.title}
                </h1>
                <p className="text-xs text-awqaf-foreground-primary font-comfortaa">
                  {t.subtitle}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInfo(true)}
                  className="w-9 h-9 p-0 rounded-full hover:bg-accent-100 text-awqaf-primary transition-colors"
                >
                  <Info className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="w-9 h-9 p-0 rounded-full hover:bg-accent-100 text-awqaf-primary transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-2 space-y-6">
        {/* ACTIVE DHIKR CARD */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardContent className="p-6 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-awqaf-primary to-awqaf-primary"></div>
            <h2 className="text-2xl font-bold text-awqaf-primary font-serif leading-loose mb-1 drop-shadow-sm px-2">
              {activeDhikr.arabic}
            </h2>
            <p className="text-sm font-medium text-awqaf-foreground-primary font-comfortaa">
              {activeDhikr.label}
            </p>
          </CardContent>
        </Card>

        {/* MAIN COUNTER */}
        <div className="flex justify-center py-2 relative">
          {/* Background Pulse Animation for Target Reached */}
          {count === settings.target && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-awqaf-primary/20 rounded-full animate-ping"></div>
          )}

          <div className="relative">
            {/* SVG Progress Ring */}
            <svg className="transform -rotate-90 w-72 h-72 drop-shadow-xl">
              {/* Track */}
              <circle
                cx="144"
                cy="144"
                r="120"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-white opacity-60"
              />
              {/* Progress Indicator */}
              {settings.target !== Infinity && (
                <circle
                  cx="144"
                  cy="144"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="754"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-awqaf-primary transition-all duration-300 ease-out"
                />
              )}
            </svg>

            {/* Tap Button */}
            <button
              onClick={handleCount}
              className={`
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-56 h-56 rounded-full 
                    bg-gradient-to-br from-awqaf-primary to-awqaf-primary/90
                    shadow-inner flex flex-col items-center justify-center 
                    text-white transition-all duration-150
                    active:scale-95 focus:outline-none select-none
                    border-[6px] border-white/30
                    ${ripple ? "scale-[0.97]" : ""}
                 `}
            >
              <span className="text-7xl font-bold font-mono tracking-tighter drop-shadow-md">
                {count}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] opacity-80 font-comfortaa mt-2">
                {t.tapToCount}
              </span>
            </button>
          </div>
        </div>

        {/* STATS GRID (NEAT & CLEAN) */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-awqaf-border-light bg-white/80 backdrop-blur shadow-sm rounded-2xl">
            <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full">
              <Hash className="w-4 h-4 text-awqaf-primary mb-1" />
              <p className="text-[10px] text-awqaf-foreground-primary uppercase font-bold tracking-wide">
                {t.statTotal}
              </p>
              <p className="text-lg font-bold text-awqaf-primary font-mono">
                {count}
              </p>
            </CardContent>
          </Card>

          <Card className="border-awqaf-border-light bg-white/80 backdrop-blur shadow-sm rounded-2xl">
            <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full">
              <Target className="w-4 h-4 text-awqaf-primary mb-1" />
              <p className="text-[10px] text-awqaf-foreground-primary uppercase font-bold tracking-wide">
                {t.statTarget}
              </p>
              <p className="text-lg font-bold text-awqaf-primary font-mono">
                {settings.target === Infinity ? "∞" : settings.target}
              </p>
            </CardContent>
          </Card>

          <Card className="border-awqaf-border-light bg-white/80 backdrop-blur shadow-sm rounded-2xl">
            <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full">
              <Percent className="w-4 h-4 text-awqaf-primary mb-1" />
              <p className="text-[10px] text-awqaf-foreground-primary uppercase font-bold tracking-wide">
                {t.statProgress}
              </p>
              <p className="text-lg font-bold text-awqaf-primary font-mono">
                {settings.target === Infinity
                  ? "-"
                  : `${Math.round(progress)}%`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* RESET BUTTON */}
        <div className="flex justify-center pb-6">
          <Button
            onClick={handleReset}
            variant="outline"
            className="rounded-full h-10 px-6 gap-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-comfortaa text-xs uppercase tracking-wide bg-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.reset}
          </Button>
        </div>

        {/* SETTINGS MODAL */}
        {showSettings && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-end sm:items-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom border border-awqaf-border-light">
              {/* Modal Header */}
              <div className="p-4 border-b border-awqaf-border-light flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="font-bold text-lg text-awqaf-primary font-comfortaa">
                  {t.settings}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="rounded-full h-8 w-8 p-0 hover:bg-accent-50"
                >
                  <X className="w-5 h-5 text-awqaf-foreground-primary" />
                </Button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                {/* Vibration Toggle */}
                <div className="flex items-center justify-between bg-accent-50 p-4 rounded-xl border border-awqaf-border-light">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-awqaf-primary shadow-sm border border-awqaf-border-light">
                      <Vibrate className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm text-awqaf-primary font-comfortaa">
                      {t.vibration}
                    </span>
                  </div>
                  <div
                    onClick={() =>
                      setSettings({ ...settings, vibrate: !settings.vibrate })
                    }
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.vibrate ? "bg-awqaf-primary" : "bg-gray-300"}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.vibrate ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </div>
                </div>

                {/* Target Selector */}
                <div>
                  <h4 className="text-xs font-bold text-awqaf-foreground-primary mb-3 uppercase tracking-wide font-comfortaa">
                    {t.targetCount}
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {TARGET_OPTIONS.map((tgt) => (
                      <button
                        key={tgt}
                        onClick={() => {
                          setSettings({ ...settings, target: tgt });
                          setCount(0);
                        }}
                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all font-comfortaa
                                   ${
                                     settings.target === tgt
                                       ? "bg-awqaf-primary text-white border-awqaf-primary shadow-md"
                                       : "bg-white text-awqaf-foreground-primary border-awqaf-border-light hover:border-awqaf-primary/50"
                                   }
                                `}
                      >
                        {tgt === Infinity ? "∞" : tgt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dhikr Selector */}
                <div>
                  <h4 className="text-xs font-bold text-awqaf-foreground-primary mb-3 uppercase tracking-wide font-comfortaa">
                    {t.selectDhikr}
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {allDhikr.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          setSettings({ ...settings, activeDhikrId: d.id });
                          setCount(0);
                          setShowSettings(false);
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all group
                                   ${
                                     settings.activeDhikrId === d.id
                                       ? "bg-accent-50 border-awqaf-primary shadow-sm"
                                       : "bg-white border-awqaf-border-light hover:border-awqaf-primary/30"
                                   }
                                `}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p
                            className={`font-bold text-sm font-comfortaa truncate ${settings.activeDhikrId === d.id ? "text-awqaf-primary" : "text-gray-700"}`}
                          >
                            {d.label}
                          </p>
                          <p className="text-base text-gray-500 font-serif mt-0.5 truncate">
                            {d.arabic}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {settings.activeDhikrId === d.id && (
                            <Check className="w-5 h-5 text-awqaf-primary" />
                          )}
                          {d.isCustom && (
                            <button
                              onClick={(e) => deleteCustomDhikr(d.id, e)}
                              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Custom Dhikr */}
                <div className="bg-accent-50/50 p-4 rounded-xl border border-dashed border-awqaf-border-light">
                  <h4 className="text-xs font-bold text-awqaf-primary mb-3 font-comfortaa flex items-center gap-2 uppercase tracking-wide">
                    <Plus className="w-3 h-3" /> {t.customDhikr}
                  </h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-awqaf-foreground-primary font-bold uppercase">
                        {t.labelPlaceholder}
                      </Label>
                      <Input
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        className="bg-white border-awqaf-border-light focus:border-awqaf-primary font-comfortaa h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-awqaf-foreground-primary font-bold uppercase">
                        {t.arabicPlaceholder}
                      </Label>
                      <Input
                        value={newArabic}
                        onChange={(e) => setNewArabic(e.target.value)}
                        className="bg-white border-awqaf-border-light focus:border-awqaf-primary font-serif h-9 text-right text-sm"
                        dir="auto"
                      />
                    </div>
                    <Button
                      onClick={addCustomDhikr}
                      disabled={!newLabel || !newArabic}
                      className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa h-9 text-xs font-bold uppercase tracking-wide"
                    >
                      {t.add}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INFO MODAL */}
        {showInfo && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 border border-awqaf-border-light">
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-3 text-awqaf-primary border border-accent-100">
                  <Info className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-awqaf-primary font-comfortaa">
                  {t.guide}
                </h3>
              </div>
              <p className="text-center text-awqaf-foreground-primary font-comfortaa text-sm leading-relaxed">
                {t.guideDesc}
              </p>
              <Button
                onClick={() => setShowInfo(false)}
                className="w-full mt-6 bg-awqaf-primary hover:bg-awqaf-primary/90 text-white rounded-xl font-comfortaa"
              >
                OK
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}