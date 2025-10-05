"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Heart,
  Share2,
  Copy,
  CheckCircle,
  Navigation,
  Crown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface AsmaulHusna {
  id: number;
  arabic: string;
  latin: string;
  meaning: string;
  isFavorite?: boolean;
}

const asmaulHusnaData: AsmaulHusna[] = [
  {
    id: 1,
    arabic: "الرَّحْمَنُ",
    latin: "Ar-Rahman",
    meaning: "Yang Maha Pengasih",
  },
  {
    id: 2,
    arabic: "الرَّحِيمُ",
    latin: "Ar-Rahim",
    meaning: "Yang Maha Penyayang",
  },
  {
    id: 3,
    arabic: "الْمَلِكُ",
    latin: "Al-Malik",
    meaning: "Yang Maha Merajai",
  },
  {
    id: 4,
    arabic: "الْقُدُّوسُ",
    latin: "Al-Quddus",
    meaning: "Yang Maha Suci",
  },
  {
    id: 5,
    arabic: "السَّلَامُ",
    latin: "As-Salam",
    meaning: "Yang Maha Memberi Kesejahteraan",
  },
  {
    id: 6,
    arabic: "الْمُؤْمِنُ",
    latin: "Al-Mu'min",
    meaning: "Yang Maha Memberi Keamanan",
  },
  {
    id: 7,
    arabic: "الْمُهَيْمِنُ",
    latin: "Al-Muhaymin",
    meaning: "Yang Maha Memelihara",
  },
  {
    id: 8,
    arabic: "الْعَزِيزُ",
    latin: "Al-Aziz",
    meaning: "Yang Maha Perkasa",
  },
  {
    id: 9,
    arabic: "الْجَبَّارُ",
    latin: "Al-Jabbar",
    meaning: "Yang Maha Memaksa",
  },
  {
    id: 10,
    arabic: "الْمُتَكَبِّرُ",
    latin: "Al-Mutakabbir",
    meaning: "Yang Maha Megah",
  },
  {
    id: 11,
    arabic: "الْخَالِقُ",
    latin: "Al-Khaliq",
    meaning: "Yang Maha Pencipta",
  },
  {
    id: 12,
    arabic: "الْبَارِئُ",
    latin: "Al-Bari'",
    meaning: "Yang Maha Mengadakan",
  },
  {
    id: 13,
    arabic: "الْمُصَوِّرُ",
    latin: "Al-Musawwir",
    meaning: "Yang Maha Membentuk",
  },
  {
    id: 14,
    arabic: "الْغَفَّارُ",
    latin: "Al-Ghaffar",
    meaning: "Yang Maha Pengampun",
  },
  {
    id: 15,
    arabic: "الْقَهَّارُ",
    latin: "Al-Qahhar",
    meaning: "Yang Maha Memaksa",
  },
  {
    id: 16,
    arabic: "الْوَهَّابُ",
    latin: "Al-Wahhab",
    meaning: "Yang Maha Pemberi",
  },
  {
    id: 17,
    arabic: "الرَّزَّاقُ",
    latin: "Ar-Razzaq",
    meaning: "Yang Maha Pemberi Rezeki",
  },
  {
    id: 18,
    arabic: "الْفَتَّاحُ",
    latin: "Al-Fattah",
    meaning: "Yang Maha Pembuka",
  },
  {
    id: 19,
    arabic: "الْعَلِيمُ",
    latin: "Al-Alim",
    meaning: "Yang Maha Mengetahui",
  },
  {
    id: 20,
    arabic: "الْقَابِضُ",
    latin: "Al-Qabid",
    meaning: "Yang Maha Menyempitkan",
  },
  {
    id: 21,
    arabic: "الْبَاسِطُ",
    latin: "Al-Basit",
    meaning: "Yang Maha Melapangkan",
  },
  {
    id: 22,
    arabic: "الْخَافِضُ",
    latin: "Al-Khafid",
    meaning: "Yang Maha Merendahkan",
  },
  {
    id: 23,
    arabic: "الرَّافِعُ",
    latin: "Ar-Rafi'",
    meaning: "Yang Maha Meninggikan",
  },
  {
    id: 24,
    arabic: "الْمُعِزُّ",
    latin: "Al-Mu'izz",
    meaning: "Yang Maha Memuliakan",
  },
  {
    id: 25,
    arabic: "الْمُذِلُّ",
    latin: "Al-Mudhill",
    meaning: "Yang Maha Menghinakan",
  },
  {
    id: 26,
    arabic: "السَّمِيعُ",
    latin: "As-Sami'",
    meaning: "Yang Maha Mendengar",
  },
  {
    id: 27,
    arabic: "الْبَصِيرُ",
    latin: "Al-Basir",
    meaning: "Yang Maha Melihat",
  },
  {
    id: 28,
    arabic: "الْحَكَمُ",
    latin: "Al-Hakam",
    meaning: "Yang Maha Menetapkan",
  },
  {
    id: 29,
    arabic: "الْعَدْلُ",
    latin: "Al-Adl",
    meaning: "Yang Maha Adil",
  },
  {
    id: 30,
    arabic: "اللَّطِيفُ",
    latin: "Al-Latif",
    meaning: "Yang Maha Lembut",
  },
  {
    id: 31,
    arabic: "الْخَبِيرُ",
    latin: "Al-Khabir",
    meaning: "Yang Maha Mengetahui",
  },
  {
    id: 32,
    arabic: "الْحَلِيمُ",
    latin: "Al-Halim",
    meaning: "Yang Maha Penyantun",
  },
  {
    id: 33,
    arabic: "الْعَظِيمُ",
    latin: "Al-Azim",
    meaning: "Yang Maha Agung",
  },
  {
    id: 34,
    arabic: "الْغَفُورُ",
    latin: "Al-Ghafur",
    meaning: "Yang Maha Pengampun",
  },
  {
    id: 35,
    arabic: "الشَّكُورُ",
    latin: "Asy-Syakur",
    meaning: "Yang Maha Mensyukuri",
  },
  {
    id: 36,
    arabic: "الْعَلِيُّ",
    latin: "Al-Aliyy",
    meaning: "Yang Maha Tinggi",
  },
  {
    id: 37,
    arabic: "الْكَبِيرُ",
    latin: "Al-Kabir",
    meaning: "Yang Maha Besar",
  },
  {
    id: 38,
    arabic: "الْحَفِيظُ",
    latin: "Al-Hafiz",
    meaning: "Yang Maha Memelihara",
  },
  {
    id: 39,
    arabic: "الْمُقِيتُ",
    latin: "Al-Muqit",
    meaning: "Yang Maha Memberi Kecukupan",
  },
  {
    id: 40,
    arabic: "الْحَسِيبُ",
    latin: "Al-Hasib",
    meaning: "Yang Maha Membuat Perhitungan",
  },
  {
    id: 41,
    arabic: "الْجَلِيلُ",
    latin: "Al-Jalil",
    meaning: "Yang Maha Mulia",
  },
  {
    id: 42,
    arabic: "الْكَرِيمُ",
    latin: "Al-Karim",
    meaning: "Yang Maha Pemurah",
  },
  {
    id: 43,
    arabic: "الرَّقِيبُ",
    latin: "Ar-Raqib",
    meaning: "Yang Maha Mengawasi",
  },
  {
    id: 44,
    arabic: "الْمُجِيبُ",
    latin: "Al-Mujib",
    meaning: "Yang Maha Mengabulkan",
  },
  {
    id: 45,
    arabic: "الْوَاسِعُ",
    latin: "Al-Wasi'",
    meaning: "Yang Maha Luas",
  },
  {
    id: 46,
    arabic: "الْحَكِيمُ",
    latin: "Al-Hakim",
    meaning: "Yang Maha Bijaksana",
  },
  {
    id: 47,
    arabic: "الْوَدُودُ",
    latin: "Al-Wadud",
    meaning: "Yang Maha Mencintai",
  },
  {
    id: 48,
    arabic: "الْمَجِيدُ",
    latin: "Al-Majid",
    meaning: "Yang Maha Mulia",
  },
  {
    id: 49,
    arabic: "الْبَاعِثُ",
    latin: "Al-Ba'ith",
    meaning: "Yang Maha Membangkitkan",
  },
  {
    id: 50,
    arabic: "الشَّهِيدُ",
    latin: "Asy-Syahid",
    meaning: "Yang Maha Menyaksikan",
  },
  {
    id: 51,
    arabic: "الْحَقُّ",
    latin: "Al-Haqq",
    meaning: "Yang Maha Benar",
  },
  {
    id: 52,
    arabic: "الْوَكِيلُ",
    latin: "Al-Wakil",
    meaning: "Yang Maha Memelihara",
  },
  {
    id: 53,
    arabic: "الْقَوِيُّ",
    latin: "Al-Qawiyy",
    meaning: "Yang Maha Kuat",
  },
  {
    id: 54,
    arabic: "الْمَتِينُ",
    latin: "Al-Matin",
    meaning: "Yang Maha Kokoh",
  },
  {
    id: 55,
    arabic: "الْوَلِيُّ",
    latin: "Al-Waliyy",
    meaning: "Yang Maha Melindungi",
  },
  {
    id: 56,
    arabic: "الْحَمِيدُ",
    latin: "Al-Hamid",
    meaning: "Yang Maha Terpuji",
  },
  {
    id: 57,
    arabic: "الْمُحْصِي",
    latin: "Al-Muhsi",
    meaning: "Yang Maha Menghitung",
  },
  {
    id: 58,
    arabic: "الْمُبْدِئُ",
    latin: "Al-Mubdi'",
    meaning: "Yang Maha Memulai",
  },
  {
    id: 59,
    arabic: "الْمُعِيدُ",
    latin: "Al-Mu'id",
    meaning: "Yang Maha Mengembalikan",
  },
  {
    id: 60,
    arabic: "الْمُحْيِي",
    latin: "Al-Muhyi",
    meaning: "Yang Maha Menghidupkan",
  },
  {
    id: 61,
    arabic: "الْمُمِيتُ",
    latin: "Al-Mumit",
    meaning: "Yang Maha Mematikan",
  },
  {
    id: 62,
    arabic: "الْحَيُّ",
    latin: "Al-Hayy",
    meaning: "Yang Maha Hidup",
  },
  {
    id: 63,
    arabic: "الْقَيُّومُ",
    latin: "Al-Qayyum",
    meaning: "Yang Maha Berdiri Sendiri",
  },
  {
    id: 64,
    arabic: "الْوَاجِدُ",
    latin: "Al-Wajid",
    meaning: "Yang Maha Menemukan",
  },
  {
    id: 65,
    arabic: "الْمَاجِدُ",
    latin: "Al-Majid",
    meaning: "Yang Maha Mulia",
  },
  {
    id: 66,
    arabic: "الْوَاحِدُ",
    latin: "Al-Wahid",
    meaning: "Yang Maha Esa",
  },
  {
    id: 67,
    arabic: "الْأَحَدُ",
    latin: "Al-Ahad",
    meaning: "Yang Maha Tunggal",
  },
  {
    id: 68,
    arabic: "الصَّمَدُ",
    latin: "As-Samad",
    meaning: "Yang Maha Dibutuhkan",
  },
  {
    id: 69,
    arabic: "الْقَادِرُ",
    latin: "Al-Qadir",
    meaning: "Yang Maha Kuasa",
  },
  {
    id: 70,
    arabic: "الْمُقْتَدِرُ",
    latin: "Al-Muqtadir",
    meaning: "Yang Maha Berkuasa",
  },
  {
    id: 71,
    arabic: "الْمُقَدِّمُ",
    latin: "Al-Muqaddim",
    meaning: "Yang Maha Mendahulukan",
  },
  {
    id: 72,
    arabic: "الْمُؤَخِّرُ",
    latin: "Al-Mu'akhkhir",
    meaning: "Yang Maha Mengakhirkan",
  },
  {
    id: 73,
    arabic: "الْأَوَّلُ",
    latin: "Al-Awwal",
    meaning: "Yang Maha Awal",
  },
  {
    id: 74,
    arabic: "الْآخِرُ",
    latin: "Al-Akhir",
    meaning: "Yang Maha Akhir",
  },
  {
    id: 75,
    arabic: "الظَّاهِرُ",
    latin: "Az-Zahir",
    meaning: "Yang Maha Nyata",
  },
  {
    id: 76,
    arabic: "الْبَاطِنُ",
    latin: "Al-Batin",
    meaning: "Yang Maha Tersembunyi",
  },
  {
    id: 77,
    arabic: "الْوَالِي",
    latin: "Al-Wali",
    meaning: "Yang Maha Memerintah",
  },
  {
    id: 78,
    arabic: "الْمُتَعَالِي",
    latin: "Al-Muta'ali",
    meaning: "Yang Maha Tinggi",
  },
  {
    id: 79,
    arabic: "الْبَرُّ",
    latin: "Al-Barr",
    meaning: "Yang Maha Baik",
  },
  {
    id: 80,
    arabic: "التَّوَّابُ",
    latin: "At-Tawwab",
    meaning: "Yang Maha Menerima Taubat",
  },
  {
    id: 81,
    arabic: "الْمُنْتَقِمُ",
    latin: "Al-Muntaqim",
    meaning: "Yang Maha Menuntut Balas",
  },
  {
    id: 82,
    arabic: "الْعَفُوُّ",
    latin: "Al-Afuww",
    meaning: "Yang Maha Pemaaf",
  },
  {
    id: 83,
    arabic: "الرَّءُوفُ",
    latin: "Ar-Ra'uf",
    meaning: "Yang Maha Pengasih",
  },
  {
    id: 84,
    arabic: "مَالِكُ الْمُلْكِ",
    latin: "Malikul Mulk",
    meaning: "Yang Maha Memiliki Kerajaan",
  },
  {
    id: 85,
    arabic: "ذُو الْجَلَالِ وَالْإِكْرَامِ",
    latin: "Dzul Jalali wal Ikram",
    meaning: "Yang Maha Memiliki Kebesaran dan Kemuliaan",
  },
  {
    id: 86,
    arabic: "الْمُقْسِطُ",
    latin: "Al-Muqsit",
    meaning: "Yang Maha Adil",
  },
  {
    id: 87,
    arabic: "الْجَامِعُ",
    latin: "Al-Jami'",
    meaning: "Yang Maha Mengumpulkan",
  },
  {
    id: 88,
    arabic: "الْغَنِيُّ",
    latin: "Al-Ghaniyy",
    meaning: "Yang Maha Kaya",
  },
  {
    id: 89,
    arabic: "الْمُغْنِي",
    latin: "Al-Mughni",
    meaning: "Yang Maha Memberi Kekayaan",
  },
  {
    id: 90,
    arabic: "الْمَانِعُ",
    latin: "Al-Mani'",
    meaning: "Yang Maha Mencegah",
  },
  {
    id: 91,
    arabic: "الضَّارُّ",
    latin: "Ad-Darr",
    meaning: "Yang Maha Memberi Bahaya",
  },
  {
    id: 92,
    arabic: "النَّافِعُ",
    latin: "An-Nafi'",
    meaning: "Yang Maha Memberi Manfaat",
  },
  {
    id: 93,
    arabic: "النُّورُ",
    latin: "An-Nur",
    meaning: "Yang Maha Bercahaya",
  },
  {
    id: 94,
    arabic: "الْهَادِي",
    latin: "Al-Hadi",
    meaning: "Yang Maha Memberi Petunjuk",
  },
  {
    id: 95,
    arabic: "الْبَدِيعُ",
    latin: "Al-Badi'",
    meaning: "Yang Maha Pencipta",
  },
  {
    id: 96,
    arabic: "الْبَاقِي",
    latin: "Al-Baqi",
    meaning: "Yang Maha Kekal",
  },
  {
    id: 97,
    arabic: "الْوَارِثُ",
    latin: "Al-Warith",
    meaning: "Yang Maha Mewarisi",
  },
  {
    id: 98,
    arabic: "الرَّشِيدُ",
    latin: "Ar-Rashid",
    meaning: "Yang Maha Pandai",
  },
  {
    id: 99,
    arabic: "الصَّبُورُ",
    latin: "As-Sabur",
    meaning: "Yang Maha Sabar",
  },
];

export default function AsmaulHusnaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("asmaul-husna-favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(
      "asmaul-husna-favorites",
      JSON.stringify([...favorites])
    );
  }, [favorites]);

  // Filter asmaul husna based on search
  const filteredAsmaulHusna = useMemo(() => {
    if (!searchQuery) return asmaulHusnaData;

    return asmaulHusnaData.filter(
      (item) =>
        item.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleToggleFavorite = (itemId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const handleCopyAsma = async (item: AsmaulHusna) => {
    const text = `${item.id}. ${item.arabic}\n${item.latin}\n${item.meaning}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareAsma = async (item: AsmaulHusna) => {
    const text = `${item.id}. ${item.arabic}\n${item.latin}\n${item.meaning}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Asmaul Husna",
          text: text,
        });
      } catch (err) {
        console.error("Failed to share:", err);
      }
    } else {
      // Fallback to copy
      handleCopyAsma(item);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
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
                  <Navigation className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                Asmaul Husna
              </h1>
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Search and View Mode */}
        <div className="space-y-4">
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary" />
                <Input
                  placeholder="Cari nama Allah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-comfortaa"
                />
              </div>
            </CardContent>
          </Card>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-awqaf-primary" />
              <span className="text-sm font-medium text-awqaf-primary font-comfortaa">
                99 Nama Allah
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="text-xs"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="text-xs"
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Asmaul Husna List */}
        <div className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredAsmaulHusna.map((item) => (
                <Card
                  key={item.id}
                  className="border-awqaf-border-light hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Number and Favorite */}
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="text-xs font-bold bg-awqaf-primary text-white"
                      >
                        {item.id}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(item.id)}
                        className="p-1 h-6 w-6"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorites.has(item.id)
                              ? "fill-red-500 text-red-500"
                              : "text-awqaf-foreground-secondary"
                          }`}
                        />
                      </Button>
                    </div>

                    {/* Arabic Text */}
                    <div className="bg-accent-50 p-3 rounded-lg">
                      <p className="text-lg font-tajawal text-awqaf-primary text-center leading-relaxed">
                        {item.arabic}
                      </p>
                    </div>

                    {/* Latin and Meaning */}
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-card-foreground font-comfortaa text-center">
                        {item.latin}
                      </p>
                      <p className="text-xs text-awqaf-foreground-secondary font-comfortaa text-center leading-relaxed">
                        {item.meaning}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyAsma(item)}
                        className="flex-1 text-xs"
                      >
                        {copiedId === item.id ? (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShareAsma(item)}
                        className="text-xs"
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAsmaulHusna.map((item) => (
                <Card
                  key={item.id}
                  className="border-awqaf-border-light hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Number */}
                      <div className="flex-shrink-0">
                        <Badge
                          variant="secondary"
                          className="text-sm font-bold bg-awqaf-primary text-white w-8 h-8 flex items-center justify-center"
                        >
                          {item.id}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-card-foreground font-comfortaa">
                            {item.latin}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(item.id)}
                            className="p-1 h-6 w-6"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                favorites.has(item.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-awqaf-foreground-secondary"
                              }`}
                            />
                          </Button>
                        </div>

                        <div className="bg-accent-50 p-3 rounded-lg mb-2">
                          <p className="text-lg font-tajawal text-awqaf-primary text-center leading-relaxed">
                            {item.arabic}
                          </p>
                        </div>

                        <p className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed">
                          {item.meaning}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex flex-col gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyAsma(item)}
                          className="text-xs"
                        >
                          {copiedId === item.id ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareAsma(item)}
                          className="text-xs"
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredAsmaulHusna.length === 0 && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                Tidak ada nama Allah ditemukan
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                Coba ubah kata kunci pencarian
              </p>
            </CardContent>
          </Card>
        )}

        {/* Favorites Summary */}
        {favorites.size > 0 && (
          <Card className="border-awqaf-border-light bg-accent-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600 fill-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-card-foreground font-comfortaa">
                    {favorites.size} Nama Favorit
                  </p>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    Nama-nama Allah yang Anda sukai
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
