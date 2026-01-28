"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  HelpCircle,
  MessageCircle,
  ChevronRight,
  FileQuestion,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/app/hooks/useI18n";

// Import Detail Component
import HelpDetail from "./detail";

// --- 1. TYPES ---
export type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface HelpItem {
  id: string;
  category: "app" | "prayer" | "quran" | "account";
  question: string;
  answer: string; // HTML string
}

interface UIText {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  cantFind: string;
  contactUs: string;
  categories: {
    app: string;
    prayer: string;
    quran: string;
    account: string;
  };
}

// --- 2. DATA DUMMY (6 BAHASA) ---
const HELP_DATA: Record<LocaleCode, HelpItem[]> = {
  id: [
    {
      id: "1",
      category: "prayer",
      question: "Mengapa waktu shalat tidak sesuai?",
      answer:
        "<p>Waktu shalat dapat berbeda tergantung pada metode perhitungan yang dipilih (Kemenag, Muhammadiyah, atau Liga Dunia Islam). Silakan cek menu <strong>Pengaturan > Metode Perhitungan</strong> untuk menyesuaikan.</p>",
    },
    {
      id: "2",
      category: "quran",
      question: "Bagaimana cara mengunduh audio Al-Quran?",
      answer:
        "<p>Masuk ke halaman Surah, ketuk ikon <strong>Unduh</strong> di pojok kanan atas. Pastikan koneksi internet Anda stabil.</p>",
    },
    {
      id: "3",
      category: "app",
      question: "Aplikasi tidak mengeluarkan suara Adzan",
      answer:
        "<p>Pastikan izin notifikasi diaktifkan di pengaturan HP Anda. Cek juga apakah mode 'Jangan Ganggu' sedang aktif.</p>",
    },
  ],
  en: [
    {
      id: "1",
      category: "prayer",
      question: "Why are prayer times incorrect?",
      answer:
        "<p>Prayer times vary based on the calculation method selected. Please check <strong>Settings > Calculation Method</strong>.</p>",
    },
    {
      id: "2",
      category: "quran",
      question: "How to download Quran audio?",
      answer:
        "<p>Go to the Surah page and tap the <strong>Download</strong> icon in the top right corner. Ensure your internet connection is stable.</p>",
    },
    {
      id: "3",
      category: "app",
      question: "The app does not play Adhan sound",
      answer:
        "<p>Ensure notification permissions are enabled in your phone settings. Also, check if 'Do Not Disturb' mode is active.</p>",
    },
  ],
  ar: [
    {
      id: "1",
      category: "prayer",
      question: "لماذا أوقات الصلاة غير صحيحة؟",
      answer:
        "<p>تختلف أوقات الصلاة حسب طريقة الحساب المختارة. يرجى التحقق من <strong>الإعدادات > طريقة الحساب</strong> للتعديل.</p>",
    },
    {
      id: "2",
      category: "quran",
      question: "كيف يمكنني تحميل صوت القرآن؟",
      answer:
        "<p>ادخل إلى صفحة السورة، واضغط على أيقونة <strong>التحميل</strong> في الزاوية العلوية. تأكد من استقرار اتصالك بالإنترنت.</p>",
    },
    {
      id: "3",
      category: "app",
      question: "التطبيق لا يصدر صوت الأذان",
      answer:
        "<p>تأكد من تفعيل إذن الإشعارات في إعدادات هاتفك. تحقق أيضًا مما إذا كان وضع 'عدم الإزعاج' نشطًا.</p>",
    },
  ],
  fr: [
    {
      id: "1",
      category: "prayer",
      question: "Pourquoi les horaires de prière sont incorrects ?",
      answer:
        "<p>Les horaires de prière varient selon la méthode de calcul sélectionnée. Veuillez vérifier <strong>Paramètres > Méthode de calcul</strong>.</p>",
    },
    {
      id: "2",
      category: "quran",
      question: "Comment télécharger l'audio du Coran ?",
      answer:
        "<p>Allez sur la page de la Sourate et appuyez sur l'icône <strong>Télécharger</strong> en haut à droite.</p>",
    },
    {
      id: "3",
      category: "app",
      question: "L'application ne joue pas le son de l'Adhan",
      answer:
        "<p>Assurez-vous que les notifications sont activées dans les paramètres de votre téléphone.</p>",
    },
  ],
  kr: [
    {
      id: "1",
      category: "prayer",
      question: "기도 시간이 왜 맞지 않나요?",
      answer:
        "<p>기도 시간은 선택한 계산 방법에 따라 다를 수 있습니다. <strong>설정 > 계산 방법</strong>을 확인해 주세요.</p>",
    },
    {
      id: "2",
      category: "quran",
      question: "꾸란 오디오는 어떻게 다운로드하나요?",
      answer:
        "<p>수라 페이지로 이동하여 오른쪽 상단의 <strong>다운로드</strong> 아이콘을 탭하세요.</p>",
    },
    {
      id: "3",
      category: "app",
      question: "앱에서 아잔 소리가 나지 않습니다",
      answer:
        "<p>휴대전화 설정에서 알림 권한이 활성화되어 있는지 확인하세요. 방해 금지 모드가 켜져 있는지도 확인해 주세요.</p>",
    },
  ],
  jp: [
    {
      id: "1",
      category: "prayer",
      question: "礼拝の時間が正しくないのはなぜですか？",
      answer:
        "<p>礼拝時間は選択された計算方法によって異なります。<strong>設定 > 計算方法</strong>を確認してください。</p>",
    },
    {
      id: "2",
      category: "quran",
      question: "コーランの音声をダウンロードするには？",
      answer:
        "<p>スーラのページに移動し、右上の<strong>ダウンロード</strong>アイコンをタップしてください。</p>",
    },
    {
      id: "3",
      category: "app",
      question: "アプリからアザーンの音が鳴りません",
      answer:
        "<p>携帯電話の設定で通知許可が有効になっていることを確認してください。また、「おやすみモード」がオンになっていないかも確認してください。</p>",
    },
  ],
};

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Bantuan",
    subtitle: "Pusat Informasi",
    searchPlaceholder: "Cari kendala...",
    cantFind: "Tidak menemukan jawaban?",
    contactUs: "Hubungi Kami",
    categories: {
      app: "Aplikasi",
      prayer: "Shalat",
      quran: "Al-Quran",
      account: "Akun",
    },
  },
  en: {
    title: "Help Center",
    subtitle: "Support & FAQ",
    searchPlaceholder: "Search issues...",
    cantFind: "Can't find answer?",
    contactUs: "Contact Us",
    categories: {
      app: "App",
      prayer: "Prayer",
      quran: "Quran",
      account: "Account",
    },
  },
  ar: {
    title: "المساعدة",
    subtitle: "مركز الدعم",
    searchPlaceholder: "بحث عن مشكلة...",
    cantFind: "لم تجد إجابة؟",
    contactUs: "اتصل بنا",
    categories: {
      app: "التطبيق",
      prayer: "الصلاة",
      quran: "القرآن",
      account: "الحساب",
    },
  },
  fr: {
    title: "Aide",
    subtitle: "Support & FAQ",
    searchPlaceholder: "Rechercher...",
    cantFind: "Pas de réponse ?",
    contactUs: "Contactez-nous",
    categories: {
      app: "App",
      prayer: "Prière",
      quran: "Coran",
      account: "Compte",
    },
  },
  kr: {
    title: "고객센터",
    subtitle: "지원 및 FAQ",
    searchPlaceholder: "문제 검색...",
    cantFind: "답을 찾을 수 없나요?",
    contactUs: "문의하기",
    categories: {
      app: "앱",
      prayer: "기도",
      quran: "꾸란",
      account: "계정",
    },
  },
  jp: {
    title: "ヘルプ",
    subtitle: "サポート＆FAQ",
    searchPlaceholder: "問題を検索...",
    cantFind: "答えが見つかりませんか？",
    contactUs: "お問い合わせ",
    categories: {
      app: "アプリ",
      prayer: "礼拝",
      quran: "コーラン",
      account: "アカウント",
    },
  },
};

export default function HelpPage() {
  const { locale } = useI18n();
  // Safe Locale Access with correct type
  const safeLocale = (
    HELP_DATA[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TEXT[safeLocale];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHelp, setSelectedHelp] = useState<HelpItem | null>(null);

  const filteredData = useMemo(() => {
    const raw = HELP_DATA[safeLocale] || HELP_DATA.id;
    return raw.filter((item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [safeLocale, searchQuery]);

  if (selectedHelp) {
    return (
      <HelpDetail
        item={selectedHelp}
        locale={safeLocale}
        onBack={() => setSelectedHelp(null)}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50"
      dir={safeLocale === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-20">
        {/* HEADER */}
        <div className="bg-awqaf-primary pb-8 pt-4 rounded-b-[32px] shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
          <div className="px-4 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-white/10 text-white rounded-full"
                >
                  <ArrowLeft
                    className={`w-6 h-6 ${safeLocale === "ar" ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white font-comfortaa">
                  {t.title}
                </h1>
                <p className="text-white/80 text-xs font-comfortaa mt-0.5">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search
                className={`absolute ${safeLocale === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`}
              />
              <Input
                placeholder={t.searchPlaceholder}
                className={`bg-white text-slate-800 border-0 h-11 rounded-xl shadow-md ${safeLocale === "ar" ? "pr-10" : "pl-10"}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <main className="px-5 py-6 space-y-4">
          {/* FAQ List */}
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedHelp(item)}
                className="cursor-pointer group"
              >
                <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all hover:bg-slate-50 rounded-xl">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-50 flex items-center justify-center text-awqaf-primary flex-shrink-0">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-700 font-comfortaa text-sm line-clamp-2">
                        {item.question}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-300 group-hover:text-awqaf-primary flex-shrink-0 ${safeLocale === "ar" ? "rotate-180" : ""}`}
                    />
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400">
              <FileQuestion className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {safeLocale === "en" ? "Not found." : "Tidak ditemukan."}
              </p>
            </div>
          )}

          {/* Contact Support Box */}
          <div className="mt-8 bg-gradient-to-r from-accent-50 to-white p-5 rounded-2xl border border-accent-100 text-center">
            <p className="text-slate-600 font-medium text-sm mb-3">
              {t.cantFind}
            </p>
            <Button className="bg-awqaf-primary hover:bg-awqaf-secondary text-white hover:text-yellow-800 rounded-full w-full shadow-md font-bold">
              <MessageCircle
                className={`w-4 h-4 ${safeLocale === "ar" ? "ml-2" : "mr-2"}`}
              />
              {t.contactUs}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}