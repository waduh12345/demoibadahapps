"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BookMarked,
  Download,
  Star,
  Clock,
  BookA,
  ArrowRight,
  Languages,
  Loader2,
  Library,
  Navigation,
  User,
  Calendar,
  X,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useGetEbookCategoriesQuery,
  useGetEbookByCategoryQuery,
} from "@/services/public/e-book.service";
import { useI18n } from "@/app/hooks/useI18n";
import { Ebook, EbookCategory } from "@/types/public/e-book";

export default function EBookPage() {
  const { t, locale } = useI18n();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  // State untuk modal
  const [selectedBook, setSelectedBook] = useState<Ebook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- HELPER TRANSLATION ---
  const getCategoryContent = (cat: EbookCategory) => {
    // 1. Cari translation sesuai locale aktif
    const localized = cat.translations.find((t) => t.locale === locale);
    if (localized && localized.name) return { name: localized.name };

    // 2. Fallback ke 'id' jika locale aktif kosong
    const idFallback = cat.translations.find((t) => t.locale === "id");
    if (idFallback && idFallback.name) return { name: idFallback.name };

    // 3. Fallback terakhir ke root object
    return { name: cat.name };
  };

  const getEbookContent = (book: Ebook) => {
    // 1. Cari translation sesuai locale aktif
    const localized = book.translations.find((t) => t.locale === locale);
    if (localized && localized.title) {
      return {
        title: localized.title,
        description: localized.description ?? "",
      };
    }

    // 2. Fallback ke 'id' jika locale aktif kosong
    const idFallback = book.translations.find((t) => t.locale === "id");
    if (idFallback && idFallback.title) {
      return {
        title: idFallback.title,
        description: idFallback.description ?? "",
      };
    }

    // 3. Fallback terakhir ke root object
    return {
      title: book.title,
      description: book.description ?? "",
    };
  };
  // --------------------------

  // 1. Fetch Categories
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetEbookCategoriesQuery({
      page: 1,
      paginate: 10,
    });

  // Set default category
  useEffect(() => {
    if (
      categoriesData?.data &&
      categoriesData.data.length > 0 &&
      selectedCategoryId === null
    ) {
      setSelectedCategoryId(categoriesData.data[0].id);
    }
  }, [categoriesData, selectedCategoryId]);

  // 2. Fetch Books by Category
  const {
    data: booksData,
    isLoading: isLoadingBooks,
    isFetching: isFetchingBooks,
  } = useGetEbookByCategoryQuery(
    {
      category: selectedCategoryId || 0,
      page: 1,
      paginate: 10,
    },
    {
      skip: selectedCategoryId === null,
    },
  );

  // Helper untuk mendapatkan nama kategori
  const getCategoryName = (id: number | null) => {
    if (!id || !categoriesData?.data) return t("ebook.selectedCategory");
    const cat = categoriesData.data.find((c) => c.id === id);
    if (!cat) return t("ebook.selectedCategory");

    // Gunakan helper translation
    return getCategoryContent(cat).name;
  };

  const handleOpenPdf = (url: string) => {
    window.open(url, "_blank");
  };

  // Helper untuk simulasi rating & downloads (karena API belum menyediakan)
  const getBookMeta = (id: number) => {
    // Generate random but deterministic values based on ID
    const rating = (4 + (id % 10) / 10).toFixed(1);
    const downloads = `${(10 + (id % 50)).toFixed(1)}K`;
    const pages = 100 + ((id * 10) % 500);
    return { rating, downloads, pages };
  };

  const openBookDetail = (book: Ebook) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md shadow-sm border-b border-awqaf-border-light sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 text-awqaf-primary"
              >
                <Navigation className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-awqaf-primary font-comfortaa">
                {t("ebook.title")}
              </h1>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {t("ebook.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Categories Grid (Loading State) */}
        {isLoadingCategories ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-4 h-24 animate-pulse bg-gray-200"
              />
            ))}
          </div>
        ) : (
          /* Categories Grid (Data) */
          <div className="grid grid-cols-2 gap-4 mb-6">
            {categoriesData?.data.map((category) => {
              const content = getCategoryContent(category);
              return (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`bg-card rounded-2xl shadow-sm p-4 text-center hover:shadow-md transition-all duration-200 border cursor-pointer active:scale-95 ${
                    selectedCategoryId === category.id
                      ? "border-awqaf-primary ring-1 ring-awqaf-primary bg-accent-50"
                      : "border-awqaf-border-light"
                  }`}
                >
                  {/* Ikon dinamis sederhana berdasarkan ID ganjil/genap untuk variasi */}
                  {category.id % 2 !== 0 ? (
                    <BookMarked className="w-8 h-8 text-awqaf-primary mx-auto mb-2" />
                  ) : (
                    <Star className="w-8 h-8 text-warning mx-auto mb-2" />
                  )}
                  <h3 className="font-semibold text-card-foreground text-sm font-comfortaa line-clamp-1">
                    {content.name}
                  </h3>
                  <div
                    className="text-xs text-awqaf-foreground-secondary mt-1 font-comfortaa line-clamp-1"
                    dangerouslySetInnerHTML={{
                      __html: category.description || "",
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Books List Section */}
        <div className="bg-card rounded-2xl shadow-sm p-6 border border-awqaf-border-light mb-6 min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground font-comfortaa">
              {getCategoryName(selectedCategoryId)}
            </h3>
            {isLoadingBooks || isFetchingBooks ? (
              <Loader2 className="w-4 h-4 animate-spin text-awqaf-primary" />
            ) : null}
          </div>

          {isLoadingBooks ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-xl border border-gray-100 animate-pulse"
                >
                  <div className="w-16 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                    <div className="flex gap-4 mt-2">
                      <div className="h-3 w-12 bg-gray-200 rounded" />
                      <div className="h-3 w-12 bg-gray-200 rounded" />
                      <div className="h-3 w-12 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : booksData?.data.length === 0 ? (
            <div className="text-center py-10">
              <Library className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-comfortaa">
                {t("ebook.noBooksInCategory")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {booksData?.data.map((book) => {
                const meta = getBookMeta(book.id);
                const content = getEbookContent(book);

                return (
                  <div
                    key={book.id}
                    onClick={() => openBookDetail(book)}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-accent-100"
                  >
                    <div className="w-16 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative border border-gray-200">
                      {book.cover ? (
                        <Image
                          src={book.cover}
                          alt={content.title}
                          fill
                          className="object-cover"
                          unoptimized // Fix potential image URL issues
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent-100">
                          <BookMarked className="w-6 h-6 text-awqaf-primary" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-card-foreground font-comfortaa text-sm line-clamp-2 leading-snug">
                        {content.title}
                      </h4>
                      <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mt-1 truncate">
                        {book.author}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning fill-current" />
                          <span className="text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                            {meta.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3 text-awqaf-foreground-secondary" />
                          <span className="text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                            {meta.downloads}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-awqaf-foreground-secondary" />
                          <span className="text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                            {meta.pages} {t("ebook.pages")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Download Status */}
        <div className="bg-gradient-to-r from-accent-100 to-accent-200 rounded-2xl p-6 border border-accent-200">
          <div className="text-center">
            <h4 className="font-semibold text-awqaf-primary font-comfortaa mb-2">
              {t("ebook.freeDownload")}
            </h4>
            <p className="text-awqaf-foreground-secondary text-sm font-comfortaa">
              {t("ebook.freeDownloadDescription")}
            </p>
          </div>
        </div>
      </main>

      {/* --- EBOOK DETAIL MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border-awqaf-border-light p-0">
          {selectedBook &&
            (() => {
              const content = getEbookContent(selectedBook);
              const meta = getBookMeta(selectedBook.id);

              return (
                <>
                  <div className="relative h-64 bg-gradient-to-b from-accent-100 to-white flex items-center justify-center p-6">
                    <div className="relative w-32 h-48 rounded-lg shadow-xl overflow-hidden border-2 border-white transform hover:scale-105 transition-transform duration-300">
                      {selectedBook.cover ? (
                        <Image
                          src={selectedBook.cover}
                          alt={content.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full bg-white/50 hover:bg-white"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <X className="w-5 h-5 text-gray-700" />
                    </Button> */}
                  </div>

                  <div className="px-6 pb-6 space-y-5">
                    {/* Title & Author */}
                    <div className="text-center space-y-1">
                      <h2 className="text-xl font-bold text-gray-900 font-comfortaa leading-tight">
                        {content.title}
                      </h2>
                      <p className="text-sm text-gray-500 font-comfortaa">
                        {selectedBook.author}
                      </p>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100">
                      <div className="flex flex-col items-center justify-center gap-1 p-2">
                        <div className="flex items-center gap-1 text-warning">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-bold text-sm">
                            {meta.rating}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                          Rating
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-1 p-2 border-x border-gray-100">
                        <span className="font-bold text-sm text-gray-800">
                          {selectedBook.publication_year}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                          Tahun
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-1 p-2">
                        <span className="font-bold text-sm text-gray-800">
                          {meta.pages}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                          Halaman
                        </span>
                      </div>
                    </div>

                    {/* Publisher */}
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <Library className="w-5 h-5 text-awqaf-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-0.5">
                          Penerbit
                        </p>
                        <p className="text-sm text-gray-700 font-medium leading-snug">
                          {selectedBook.publisher}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                        Sinopsis
                      </h3>
                      <div
                        className="text-sm text-gray-600 leading-relaxed font-comfortaa text-justify"
                        dangerouslySetInnerHTML={{
                          __html: content.description ?? "",
                        }}
                      />
                    </div>

                    {/* ISBN if available */}
                    {selectedBook.isbn && (
                      <div className="text-xs text-gray-400 font-mono text-center">
                        ISBN: {selectedBook.isbn}
                      </div>
                    )}
                  </div>

                  <DialogFooter className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <Button
                      className="w-full h-12 bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-bold text-base shadow-lg shadow-awqaf-primary/20"
                      onClick={() => handleOpenPdf(selectedBook.pdf)}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download E-Book
                    </Button>
                  </DialogFooter>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}