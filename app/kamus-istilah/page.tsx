"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, BookA, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
// Import Service & Types
import { useGetDictionaryEntriesQuery } from "@/services/public/dictionary.service";
import { DictionaryEntry } from "@/types/public/dictionary";
import { useI18n } from "@/app/hooks/useI18n";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function KamusPage() {
  const { t, locale } = useI18n(); // Import hook i18n
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");

  // Fetch Data from API
  const {
    data: dictionaryEntries,
    isLoading,
    error,
  } = useGetDictionaryEntriesQuery();

  // --- HELPER TRANSLATION ---
  const getDefinition = (entry: DictionaryEntry) => {
    // 1. Cari translation sesuai locale aktif
    const localized = entry.translations.find((t) => t.locale === locale);

    // 2. Jika ada dan definition tidak kosong
    if (localized && localized.definition) {
      return localized.definition;
    }

    // 3. Fallback ke 'id' jika locale aktif kosong
    const idFallback = entry.translations.find((t) => t.locale === "id");
    if (idFallback && idFallback.definition) {
      return idFallback.definition;
    }

    // 4. Fallback terakhir ke root object
    return entry.definition;
  };
  // --------------------------

  // 1. Filter Logic
  const filteredTerms = useMemo(() => {
    if (!dictionaryEntries) return [];

    return dictionaryEntries.filter((item) => {
      const q = searchQuery.toLowerCase();
      // Gunakan definition yang sudah diterjemahkan untuk pencarian
      const definitionText = getDefinition(item).toLowerCase();

      const matchesSearch =
        item.term.toLowerCase().includes(q) || definitionText.includes(q);

      const matchesLetter =
        selectedLetter === "ALL" || item.alphabet_index === selectedLetter;

      return matchesSearch && matchesLetter;
    });
  }, [dictionaryEntries, searchQuery, selectedLetter, locale]); // Add locale dependency

  // 2. Grouping Logic (Group by Alphabet)
  const groupedTerms = useMemo(() => {
    return filteredTerms.reduce(
      (acc, item) => {
        const letter = item.alphabet_index;
        if (!acc[letter]) {
          acc[letter] = [];
        }
        acc[letter].push(item);
        return acc;
      },
      {} as Record<string, DictionaryEntry[]>,
    );
  }, [filteredTerms]);

  // Sort keys alphabetically
  const sortedKeys = useMemo(() => {
    return Object.keys(groupedTerms).sort();
  }, [groupedTerms]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 -ml-2 rounded-full h-8 w-8 p-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BookA className="w-6 h-6" />
              <h1 className="text-xl font-bold font-comfortaa">
                {t("dictionary.title") || "Kamus Islam"}
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={
                t("dictionary.searchPlaceholder") ||
                "Cari istilah (cth: Taqwa)..."
              }
              className="pl-9 h-10 bg-white text-gray-800 border-none rounded-full font-comfortaa focus-visible:ring-2 focus-visible:ring-teal-300 placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Alphabet Navigation */}
        <div className="bg-white p-2 rounded-xl border border-awqaf-border-light shadow-sm sticky top-[100px] z-20">
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide items-center">
            <Button
              size="sm"
              variant={selectedLetter === "ALL" ? "default" : "ghost"}
              className={`h-8 px-3 rounded-lg text-xs font-bold font-mono transition-colors ${
                selectedLetter === "ALL"
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedLetter("ALL")}
            >
              ALL
            </Button>
            <div className="w-px h-4 bg-gray-200 mx-1 flex-shrink-0"></div>
            {ALPHABETS.map((char) => (
              <Button
                key={char}
                size="sm"
                variant={selectedLetter === char ? "default" : "ghost"}
                className={`h-8 w-8 p-0 rounded-lg text-xs font-bold font-mono flex-shrink-0 transition-colors ${
                  selectedLetter === char
                    ? "bg-teal-600 hover:bg-teal-700 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedLetter(char)}
              >
                {char}
              </Button>
            ))}
          </div>
        </div>

        {/* Terms List Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-teal-600" />
            <p className="font-comfortaa">
              {t("dictionary.loading") || "Memuat kamus..."}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-comfortaa">
              {t("dictionary.failedToLoad") || "Gagal memuat data kamus."}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              {t("common.retry") || "Coba Lagi"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedKeys.length > 0 ? (
              sortedKeys.map((letter) => (
                <div
                  key={letter}
                  className="scroll-mt-24"
                  id={`section-${letter}`}
                >
                  {/* Letter Header */}
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold font-mono text-sm border border-teal-200">
                      {letter}
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-teal-200 to-transparent"></div>
                  </div>

                  {/* Terms Cards */}
                  <div className="space-y-3">
                    {groupedTerms[letter].map((item) => {
                      // Ambil definisi yang sudah diterjemahkan
                      const definition = getDefinition(item);

                      return (
                        <Card
                          key={item.id}
                          className="border-awqaf-border-light hover:border-teal-200 transition-colors group"
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-gray-800 text-lg font-comfortaa mb-1 group-hover:text-teal-600 transition-colors">
                                {item.term}
                              </h3>
                              <Badge
                                variant="outline"
                                className="text-[10px] font-mono text-gray-400"
                              >
                                {item.alphabet_index}
                              </Badge>
                            </div>
                            {/* Render HTML Definition (Localized) */}
                            <div
                              className="text-sm text-gray-600 font-comfortaa leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: definition,
                              }}
                            />
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold font-comfortaa">
                  {t("dictionary.noTermsFound") || "Istilah tidak ditemukan"}
                </h3>
                <p className="text-sm text-gray-500 font-comfortaa">
                  {t("dictionary.tryDifferentKeyword") ||
                    "Coba cari dengan kata kunci lain."}
                </p>
              </div>
            )}
          </div>
        )}

        {!isLoading && !error && (
          <div className="text-center py-6">
            <p className="text-xs text-gray-400 font-comfortaa">
              {t("dictionary.showing") || "Menampilkan"} {filteredTerms.length}{" "}
              {t("dictionary.terms") || "istilah"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}