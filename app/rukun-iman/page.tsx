"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Book,
  Feather, // Representasi Malaikat (Sayap/Halus)
  Users, // Representasi Rasul
  CloudSun, // Representasi Allah (Pencipta Semesta)
  Hourglass, // Representasi Hari Akhir
  GitCommitHorizontal, // Representasi Takdir/Qada Qadr (Jalur hidup)
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// Import komponen detail
import ImanDetail from "./iman-detail";

// --- 1. DEFINISI TIPE DATA (Strict Types) ---
export type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface ImanItem {
  id: string;
  order: number;
  title: string;
  shortDesc: string;
  content: string; // HTML string
}

interface UIText {
  title: string;
  subtitle: string;
  read: string;
  back: string;
}

// --- 2. DATA DUMMY (6 BAHASA) ---
const IMAN_DATA: Record<LocaleCode, ImanItem[]> = {
  id: [
    {
      id: "1",
      order: 1,
      title: "Iman Kepada Allah",
      shortDesc:
        "Meyakini bahwa Allah SWT adalah satu-satunya Tuhan yang berhak disembah.",
      content: `<p>Iman kepada Allah adalah pondasi utama dalam Islam. Kita wajib meyakini bahwa Allah ada, Esa dalam Dzat, Sifat, dan Perbuatan-Nya.</p><p>Tidak ada sekutu bagi-Nya dan hanya kepada-Nya kita memohon pertolongan.</p>`,
    },
    {
      id: "2",
      order: 2,
      title: "Iman Kepada Malaikat",
      shortDesc:
        "Meyakini keberadaan malaikat sebagai makhluk ghaib ciptaan Allah.",
      content: `<p>Malaikat diciptakan dari cahaya (nur), tidak makan, tidak minum, dan selalu taat kepada Allah. Kita wajib mengimani keberadaan mereka dan tugas-tugas khususnya, seperti Jibril pembawa wahyu.</p>`,
    },
    {
      id: "3",
      order: 3,
      title: "Iman Kepada Kitab-Kitab",
      shortDesc: "Meyakini kitab-kitab yang diturunkan kepada para Nabi.",
      content: `<p>Allah menurunkan kitab-kitab sebagai pedoman hidup. Kita wajib mengimani Taurat, Zabur, Injil, dan Al-Qur'an sebagai penyempurna kitab-kitab sebelumnya.</p>`,
    },
    {
      id: "4",
      order: 4,
      title: "Iman Kepada Rasul",
      shortDesc: "Meyakini utusan Allah yang membawa risalah kebenaran.",
      content: `<p>Para Rasul adalah manusia pilihan yang diutus untuk membimbing umat manusia. Nabi Muhammad SAW adalah penutup para Nabi (Khatamul Anbiya).</p>`,
    },
    {
      id: "5",
      order: 5,
      title: "Iman Kepada Hari Akhir",
      shortDesc: "Meyakini adanya hari kiamat dan kehidupan setelah mati.",
      content: `<p>Dunia ini sementara. Kita wajib meyakini akan adanya hari pembalasan, surga, dan neraka, di mana setiap amal perbuatan akan dihisab.</p>`,
    },
    {
      id: "6",
      order: 6,
      title: "Iman Kepada Qada & Qadr",
      shortDesc: "Meyakini takdir baik dan buruk berasal dari Allah.",
      content: `<p>Segala sesuatu yang terjadi di alam semesta ini telah ditetapkan oleh Allah dalam Lauhul Mahfuz. Kita wajib berusaha (ikhtiar) dan bertawakal menerima ketetapan-Nya.</p>`,
    },
  ],
  en: [
    {
      id: "1",
      order: 1,
      title: "Belief in Allah",
      shortDesc:
        "Believing that Allah is the One and Only God worthy of worship.",
      content: `<p>Belief in Allah is the main foundation of Islam. We must believe that Allah exists, is One in His Essence, Attributes, and Actions.</p>`,
    },
    {
      id: "2",
      order: 2,
      title: "Belief in Angels",
      shortDesc:
        "Believing in the existence of angels as unseen creatures created by Allah.",
      content: `<p>Angels are created from light, do not eat or drink, and always obey Allah.</p>`,
    },
    {
      id: "3",
      order: 3,
      title: "Belief in Books",
      shortDesc: "Believing in the Holy Books revealed to the Prophets.",
      content: "<p>Allah revealed books as guidance...</p>",
    },
    {
      id: "4",
      order: 4,
      title: "Belief in Messengers",
      shortDesc: "Believing in the Messengers sent with the truth.",
      content: "<p>Messengers are chosen humans...</p>",
    },
    {
      id: "5",
      order: 5,
      title: "Belief in the Last Day",
      shortDesc: "Believing in the Day of Judgment and life after death.",
      content: "<p>This world is temporary...</p>",
    },
    {
      id: "6",
      order: 6,
      title: "Belief in Destiny",
      shortDesc: "Believing that all good and bad destiny comes from Allah.",
      content: "<p>Everything is written in Lauhul Mahfuz...</p>",
    },
  ],
  ar: [
    {
      id: "1",
      order: 1,
      title: "الإيمان بالله",
      shortDesc: "التصديق الجازم بوجود الله تعالى وأنه رب كل شيء ومليكه.",
      content: `<p>الإيمان بالله هو الركن الأول وأساس العقيدة الإسلامية...</p>`,
    },
    {
      id: "2",
      order: 2,
      title: "الإيمان بالملائكة",
      shortDesc: "الإيمان بوجود الملائكة وأنهم عباد مكرمون.",
      content: "<p>الملائكة خلقهم الله من نور...</p>",
    },
    {
      id: "3",
      order: 3,
      title: "الإيمان بالكتب",
      shortDesc: "التصديق بالكتب السماوية المنزلة.",
      content: "<p>نؤمن بالكتب التي أنزلها الله...</p>",
    },
    {
      id: "4",
      order: 4,
      title: "الإيمان بالرسل",
      shortDesc: "التصديق بأن الله بعث في كل أمة رسولاً.",
      content: "<p>الرسل هم سفراء الله إلى خلقه...</p>",
    },
    {
      id: "5",
      order: 5,
      title: "الإيمان باليوم الآخر",
      shortDesc: "التصديق بيوم القيامة والبعث والنشور.",
      content: "<p>الدنيا دار فناء والآخرة دار بقاء...</p>",
    },
    {
      id: "6",
      order: 6,
      title: "الإيمان بالقضاء والقدر",
      shortDesc: "الإيمان بأن كل ما يقع في الكون هو بتقدير الله.",
      content: "<p>كل شيء خلقناه بقدر...</p>",
    },
  ],
  fr: [
    {
      id: "1",
      order: 1,
      title: "Croyance en Allah",
      shortDesc:
        "Croire qu'Allah est le Seul et Unique Dieu digne d'adoration.",
      content: `<p>La foi en Allah est le fondement principal de l'Islam...</p>`,
    },
    // ... data dummy disingkat untuk brevity, tapi struktur harus array 6 item
    {
      id: "2",
      order: 2,
      title: "Croyance aux Anges",
      shortDesc: "Croire aux anges...",
      content: "<p>...</p>",
    },
    {
      id: "3",
      order: 3,
      title: "Croyance aux Livres",
      shortDesc: "Croire aux livres saints...",
      content: "<p>...</p>",
    },
    {
      id: "4",
      order: 4,
      title: "Croyance aux Prophètes",
      shortDesc: "Croire aux messagers...",
      content: "<p>...</p>",
    },
    {
      id: "5",
      order: 5,
      title: "Croyance au Jour Dernier",
      shortDesc: "Croire au jour du jugement...",
      content: "<p>...</p>",
    },
    {
      id: "6",
      order: 6,
      title: "Croyance au Destin",
      shortDesc: "Croire au destin...",
      content: "<p>...</p>",
    },
  ],
  kr: [
    {
      id: "1",
      order: 1,
      title: "알라에 대한 믿음",
      shortDesc: "알라만이 숭배받을 가치가 있는 유일신임을 믿는 것.",
      content: `<p>알라에 대한 믿음은 이슬람의 주요 기초입니다...</p>`,
    },
    // ... dummy data filler
    {
      id: "2",
      order: 2,
      title: "천사에 대한 믿음",
      shortDesc: "천사의 존재를 믿는 것.",
      content: "<p>...</p>",
    },
    {
      id: "3",
      order: 3,
      title: "경전에 대한 믿음",
      shortDesc: "성서를 믿는 것.",
      content: "<p>...</p>",
    },
    {
      id: "4",
      order: 4,
      title: "사도에 대한 믿음",
      shortDesc: "선지자를 믿는 것.",
      content: "<p>...</p>",
    },
    {
      id: "5",
      order: 5,
      title: "심판의 날에 대한 믿음",
      shortDesc: "사후 세계를 믿는 것.",
      content: "<p>...</p>",
    },
    {
      id: "6",
      order: 6,
      title: "정명에 대한 믿음",
      shortDesc: "운명을 믿는 것.",
      content: "<p>...</p>",
    },
  ],
  jp: [
    {
      id: "1",
      order: 1,
      title: "アッラーへの信仰",
      shortDesc: "アッラーこそが崇拝に値する唯一の神であると信じること。",
      content: `<p>アッラーへの信仰はイスラム教の主要な基盤です...</p>`,
    },
    // ... dummy data filler
    {
      id: "2",
      order: 2,
      title: "天使への信仰",
      shortDesc: "天使の存在を信じること。",
      content: "<p>...</p>",
    },
    {
      id: "3",
      order: 3,
      title: "啓典への信仰",
      shortDesc: "聖典を信じること。",
      content: "<p>...</p>",
    },
    {
      id: "4",
      order: 4,
      title: "使徒への信仰",
      shortDesc: "預言者を信じること。",
      content: "<p>...</p>",
    },
    {
      id: "5",
      order: 5,
      title: "来世への信仰",
      shortDesc: "審判の日を信じること。",
      content: "<p>...</p>",
    },
    {
      id: "6",
      order: 6,
      title: "定命への信仰",
      shortDesc: "運命を信じること。",
      content: "<p>...</p>",
    },
  ],
};

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Rukun Iman",
    subtitle: "6 Pilar Keyakinan",
    read: "Pelajari",
    back: "Kembali",
  },
  en: {
    title: "Pillars of Faith",
    subtitle: "6 Pillars of Belief",
    read: "Learn",
    back: "Back",
  },
  ar: {
    title: "أركان الإيمان",
    subtitle: "٦ أركان للعقيدة",
    read: "تعلم",
    back: "رجوع",
  },
  fr: {
    title: "Piliers de la Foi",
    subtitle: "6 Piliers de Croyance",
    read: "Apprendre",
    back: "Retour",
  },
  kr: {
    title: "믿음의 기둥",
    subtitle: "6가지 믿음",
    read: "배우기",
    back: "뒤로",
  },
  jp: { title: "信仰の柱", subtitle: "6つの信仰", read: "学ぶ", back: "戻る" },
};

export default function RukunImanPage() {
  const { locale } = useI18n();
  // Safe Access Locale (Type Safe)
  const currentLocale = (
    Object.keys(IMAN_DATA).includes(locale) ? locale : "id"
  ) as LocaleCode;

  const t = UI_TEXT[currentLocale];
  const data = IMAN_DATA[currentLocale];

  // STATE
  const [selectedItem, setSelectedItem] = useState<ImanItem | null>(null);

  // MAPPING ICON BERDASARKAN URUTAN (1-6)
  const getIcon = (order: number) => {
    switch (order) {
      case 1:
        return CloudSun;
      case 2:
        return Feather;
      case 3:
        return Book;
      case 4:
        return Users;
      case 5:
        return Hourglass;
      case 6:
        return GitCommitHorizontal;
      default:
        return ShieldCheck;
    }
  };

  // --- RENDER DETAIL ---
  if (selectedItem) {
    return (
      <ImanDetail
        item={selectedItem}
        locale={currentLocale}
        onBack={() => setSelectedItem(null)}
        icon={getIcon(selectedItem.order)}
      />
    );
  }

  // --- RENDER LIST ---
  return (
    <div
      className="min-h-screen bg-slate-50 mb-20"
      dir={currentLocale === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-10 shadow-xl overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-br from-awqaf-primary to-awqaf-secondary p-6 pb-12 rounded-b-[40px] relative overflow-hidden">
          {/* Pattern Decoration */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

          <div className="relative z-10">
            <Link href="/bekal-islam">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-auto mb-4 rounded-full"
              >
                <ArrowLeft
                  className={`w-6 h-6 ${currentLocale === "ar" ? "rotate-180" : ""}`}
                />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-comfortaa">
                  {t.title}
                </h1>
                <p className="text-white/80 text-xs font-comfortaa">
                  {t.subtitle}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* List Items */}
        <main className="px-5 -mt-6 relative z-20 space-y-4">
          {data.map((item) => {
            const Icon = getIcon(item.order);
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="cursor-pointer group"
              >
                <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white hover:-translate-y-1">
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Number Badge with Icon */}
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <div className="absolute inset-0 bg-accent-100 rounded-xl rotate-3 group-hover:rotate-6 transition-transform"></div>
                      <div className="absolute inset-0 bg-white border border-accent-100 rounded-xl flex items-center justify-center shadow-sm z-10">
                        <Icon className="w-6 h-6 text-awqaf-primary" />
                      </div>
                      <Badge className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-awqaf-secondary text-[10px] z-20 border-2 border-white">
                        {item.order}
                      </Badge>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-awqaf-primary font-comfortaa mb-1 group-hover:text-awqaf-secondary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.shortDesc}
                      </p>
                    </div>

                    <ChevronRight
                      className={`w-5 h-5 text-slate-300 group-hover:text-awqaf-primary transition-colors ${currentLocale === "ar" ? "rotate-180" : ""}`}
                    />
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}