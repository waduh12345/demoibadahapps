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

// --- 2. DATA DUMMY (SAMA SEPERTI SEBELUMNYA) ---
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
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={safeLocale === "ar" ? "rtl" : "ltr"}
    >
      {/* HEADER: KIBLAT STYLE */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                >
                  <ArrowLeft
                    className={`w-5 h-5 ${safeLocale === "ar" ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t.title}
                </h1>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {t.subtitle}
                </p>
              </div>
              {/* Spacer agar title tetap di tengah */}
              <div className="w-10 h-10" />
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-md mx-auto px-4 py-2 space-y-4">
        {/* Search Bar - Moved to body like a widget */}
        <div className="relative">
          <div className="relative bg-white/80 backdrop-blur rounded-xl shadow-sm border border-awqaf-border-light/50 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-awqaf-primary/20 focus-within:border-awqaf-primary">
            <Search
              className={`absolute ${
                safeLocale === "ar" ? "right-3" : "left-3"
              } top-1/2 -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary`}
            />
            <Input
              placeholder={t.searchPlaceholder}
              className={`bg-transparent border-0 h-12 focus-visible:ring-0 ${
                safeLocale === "ar" ? "pr-10" : "pl-10"
              } placeholder:text-awqaf-foreground-secondary/70 text-awqaf-primary font-comfortaa`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedHelp(item)}
                className="cursor-pointer group"
              >
                <Card className="border-awqaf-border-light hover:border-awqaf-primary/50 transition-all duration-300 hover:shadow-md bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent-50 flex items-center justify-center text-awqaf-primary flex-shrink-0 border border-accent-100">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-awqaf-primary font-comfortaa text-sm line-clamp-2">
                        {item.question}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-awqaf-foreground-secondary group-hover:text-awqaf-primary flex-shrink-0 transition-colors ${
                        safeLocale === "ar" ? "rotate-180" : ""
                      }`}
                    />
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="w-8 h-8 text-awqaf-foreground-secondary/50" />
              </div>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {safeLocale === "en" ? "Not found." : "Tidak ditemukan."}
              </p>
            </div>
          )}
        </div>

        {/* Contact Support Box */}
        <Card className="border-awqaf-border-light bg-gradient-to-br from-accent-50 to-white mt-6">
          <CardContent className="p-5 text-center">
            <p className="text-awqaf-foreground-secondary font-medium font-comfortaa text-sm mb-3">
              {t.cantFind}
            </p>
            <Button className="bg-awqaf-primary hover:bg-awqaf-primary/90 text-white rounded-xl w-full shadow-md font-bold font-comfortaa transition-all hover:scale-[1.02]">
              <MessageCircle
                className={`w-4 h-4 ${safeLocale === "ar" ? "ml-2" : "mr-2"}`}
              />
              {t.contactUs}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}