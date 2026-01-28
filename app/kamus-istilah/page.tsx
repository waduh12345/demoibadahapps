"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  BookA,
  Loader2,
  BookOpen,
  X,
  Hash,
} from "lucide-react";
import Link from "next/link";
// Import Service & Types
import { useGetDictionaryEntriesQuery } from "@/services/public/dictionary.service";
import { DictionaryEntry } from "@/types/public/dictionary";
import { useI18n } from "@/app/hooks/useI18n";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function KamusPage() {
  const { t, locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");

  // Fetch Data
  const {
    data: dictionaryEntries,
    isLoading,
    error,
  } = useGetDictionaryEntriesQuery();

  // --- HELPER TRANSLATION ---
  const getDefinition = (entry: DictionaryEntry) => {
    const localized = entry.translations.find((t) => t.locale === locale);
    if (localized?.definition) return localized.definition;

    const idFallback = entry.translations.find((t) => t.locale === "id");
    if (idFallback?.definition) return idFallback.definition;

    return entry.definition;
  };

  // --- FILTER LOGIC ---
  const filteredTerms = useMemo(() => {
    if (!dictionaryEntries) return [];

    return dictionaryEntries.filter((item) => {
      const q = searchQuery.toLowerCase();
      const definitionText = getDefinition(item).toLowerCase();

      const matchesSearch =
        item.term.toLowerCase().includes(q) || definitionText.includes(q);

      const matchesLetter =
        selectedLetter === "ALL" || item.alphabet_index === selectedLetter;

      return matchesSearch && matchesLetter;
    });
  }, [dictionaryEntries, searchQuery, selectedLetter, locale]);

  // --- GROUPING LOGIC ---
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

  const sortedKeys = useMemo(() => {
    return Object.keys(groupedTerms).sort();
  }, [groupedTerms]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* HEADER: Floating Glass */}
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
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa flex items-center justify-center gap-2">
                  <BookA className="w-5 h-5 text-awqaf-primary" />
                  {t("dictionary.title") || "Kamus Islam"}
                </h1>
              </div>
              <div className="w-10 h-10" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-2 space-y-6">
        {/* Search Bar Widget */}
        <div className="relative">
          <div className="relative bg-white/80 backdrop-blur rounded-xl shadow-sm border border-awqaf-border-light/50 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-awqaf-primary/20 focus-within:border-awqaf-primary">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-awqaf-foreground-primary" />
            <Input
              placeholder={
                t("dictionary.searchPlaceholder") ||
                "Cari istilah (cth: Taqwa)..."
              }
              className="bg-transparent border-0 h-12 focus-visible:ring-0 pl-10 pr-10 placeholder:text-awqaf-foreground-primary/70 text-awqaf-primary font-comfortaa text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-accent-100 hover:bg-accent-200 flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 text-awqaf-primary" />
              </button>
            )}
          </div>
        </div>

        {/* Alphabet Navigation Pills */}
        <div className="sticky top-[90px] z-20 bg-white/80 backdrop-blur-md p-2 rounded-xl border border-awqaf-border-light/50 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide items-center">
            <button
              onClick={() => setSelectedLetter("ALL")}
              className={`
                flex-shrink-0 h-8 px-4 rounded-lg text-xs font-bold font-comfortaa transition-all border
                ${
                  selectedLetter === "ALL"
                    ? "bg-awqaf-primary text-white border-awqaf-primary shadow-md"
                    : "bg-white text-awqaf-foreground-primary border-awqaf-border-light hover:bg-accent-50"
                }
              `}
            >
              ALL
            </button>
            <div className="w-px h-4 bg-awqaf-border-light mx-1 flex-shrink-0"></div>
            {ALPHABETS.map((char) => (
              <button
                key={char}
                onClick={() => setSelectedLetter(char)}
                className={`
                  flex-shrink-0 w-8 h-8 rounded-lg text-xs font-bold font-comfortaa transition-all border flex items-center justify-center
                  ${
                    selectedLetter === char
                      ? "bg-awqaf-primary text-white border-awqaf-primary shadow-md"
                      : "bg-white text-awqaf-foreground-primary border-awqaf-border-light hover:bg-accent-50"
                  }
                `}
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary mb-2" />
            <p className="text-sm text-awqaf-foreground-primary font-comfortaa">
              {t("dictionary.loading") || "Memuat kamus..."}
            </p>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-sm text-red-700 font-comfortaa mb-4">
                {t("dictionary.failedToLoad") || "Gagal memuat data kamus."}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="bg-white border-red-200 text-red-600 hover:bg-red-50 font-comfortaa"
              >
                {t("common.retry") || "Coba Lagi"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {sortedKeys.length > 0 ? (
              sortedKeys.map((letter) => (
                <div
                  key={letter}
                  id={`section-${letter}`}
                  className="scroll-mt-32"
                >
                  {/* Letter Header Separator */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent-50 text-awqaf-primary flex items-center justify-center font-bold font-comfortaa text-lg border border-accent-100 shadow-sm">
                      {letter}
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-awqaf-border-light to-transparent"></div>
                  </div>

                  {/* Terms List */}
                  <div className="grid gap-3">
                    {groupedTerms[letter].map((item) => {
                      const definition = getDefinition(item);
                      return (
                        <Card
                          key={item.id}
                          className="border-awqaf-border-light hover:border-awqaf-primary/30 transition-all duration-300 hover:shadow-md bg-white/95 backdrop-blur-sm rounded-2xl group"
                        >
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-awqaf-primary text-lg font-comfortaa group-hover:text-awqaf-primary transition-colors">
                                {item.term}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="bg-accent-50 text-awqaf-foreground-primary border border-accent-100 text-[10px] font-mono px-2"
                              >
                                <Hash className="w-3 h-3 mr-1 opacity-50" />
                                {item.alphabet_index}
                              </Badge>
                            </div>

                            <div className="text-sm text-awqaf-foreground-primary font-comfortaa leading-relaxed">
                              <div
                                dangerouslySetInnerHTML={{ __html: definition }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-awqaf-border-light">
                  <Search className="w-8 h-8 text-awqaf-foreground-primary/50" />
                </div>
                <h3 className="text-awqaf-primary font-bold font-comfortaa mb-1">
                  {t("dictionary.noTermsFound") || "Istilah tidak ditemukan"}
                </h3>
                <p className="text-xs text-awqaf-foreground-primary font-comfortaa">
                  {t("dictionary.tryDifferentKeyword") ||
                    "Coba cari dengan kata kunci lain."}
                </p>
              </div>
            )}
          </div>
        )}

        {!isLoading && !error && filteredTerms.length > 0 && (
          <div className="text-center pt-4 pb-8">
            <p className="text-xs text-awqaf-foreground-primary/50 font-comfortaa">
              {t("dictionary.showing") || "Menampilkan"}{" "}
              <span className="font-bold text-awqaf-primary">
                {filteredTerms.length}
              </span>{" "}
              {t("dictionary.terms") || "istilah"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}