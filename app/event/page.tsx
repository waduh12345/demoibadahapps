"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
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
  Calendar,
  MapPin,
  Video,
  User,
  ExternalLink,
  ArrowLeft,
  Ticket,
  Loader2,
  Clock,
  Info,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// Import Service & Type
import { useGetEventsQuery } from "@/services/public/event.service";
import { useI18n } from "@/app/hooks/useI18n";
import { Event } from "@/types/public/event";

type FilterType = "all" | "online" | "offline";

// Translation Maps
const viewDetailText: Record<string, string> = {
  id: "Lihat Detail",
  en: "View Details",
  ar: "عرض التفاصيل",
  fr: "Voir les détails",
  kr: "세부 정보 보기",
  jp: "詳細を見る",
};

const labels: Record<
  string,
  {
    date: string;
    time: string;
    location: string;
    description: string;
    notAvailable: string;
  }
> = {
  id: {
    date: "Tanggal",
    time: "Waktu",
    location: "Lokasi",
    description: "Deskripsi",
    notAvailable: "Registrasi Tidak Tersedia",
  },
  en: {
    date: "Date",
    time: "Time",
    location: "Location",
    description: "Description",
    notAvailable: "Registration Not Available",
  },
  ar: {
    date: "تاريخ",
    time: "وقت",
    location: "موقع",
    description: "وصف",
    notAvailable: "التسجيل غير متاح",
  },
  fr: {
    date: "Date",
    time: "Temps",
    location: "Lieu",
    description: "Description",
    notAvailable: "Inscription non disponible",
  },
  kr: {
    date: "날짜",
    time: "시간",
    location: "위치",
    description: "설명",
    notAvailable: "등록 불가",
  },
  jp: {
    date: "日付",
    time: "時間",
    location: "位置",
    description: "説明",
    notAvailable: "登録できません",
  },
};

export default function EventPage() {
  const { t, locale } = useI18n();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper untuk mendapatkan label statis
  const currentLabels = labels[locale] || labels.id;

  // Fetch Events from API
  const {
    data: eventsData,
    isLoading,
    isError,
  } = useGetEventsQuery({
    page: 1,
    paginate: 20,
  });

  // --- HELPER TRANSLATION ---
  const getEventContent = (event: Event) => {
    // 1. Cari translation sesuai locale aktif
    const localized = event.translations.find((t) => t.locale === locale);

    // 2. Jika ada dan title tidak kosong
    if (localized && localized.title) {
      return {
        title: localized.title,
        description: localized.description ?? "", // Handle null
      };
    }

    // 3. Fallback ke 'id' jika locale aktif kosong
    const idFallback = event.translations.find((t) => t.locale === "id");
    if (idFallback && idFallback.title) {
      return {
        title: idFallback.title,
        description: idFallback.description ?? "", // Handle null
      };
    }

    // 4. Fallback terakhir ke root object
    return {
      title: event.title,
      description: event.description ?? "", // Handle null
    };
  };
  // --------------------------

  // Helper Format Tanggal & Jam
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      id: "id-ID",
      en: "en-US",
      ar: "ar-SA",
      fr: "fr-FR",
      kr: "ko-KR",
      jp: "ja-JP",
    };
    const currentLocale = localeMap[locale] || "id-ID";
    return {
      day: date.toLocaleDateString(currentLocale, { day: "numeric" }),
      month: date.toLocaleDateString(currentLocale, { month: "short" }),
      fullDate: date.toLocaleDateString(currentLocale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: date.toLocaleTimeString(currentLocale, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // Filter Logic
  const filteredEvents = useMemo(() => {
    if (!eventsData?.data) return [];

    return eventsData.data.filter((evt) => {
      if (filter === "all") return true;
      if (filter === "online") return evt.is_online === 1;
      if (filter === "offline") return evt.is_online === 0;
      return true;
    });
  }, [eventsData, filter]);

  // Handle Open Modal
  const openDetailModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header Sticky */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-awqaf-border-light shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full -ml-2 hover:bg-accent-100 text-awqaf-primary"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                {t("event.title")}
              </h1>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                {t("event.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "all", label: t("event.all"), icon: Calendar },
            { id: "online", label: t("event.online"), icon: Video },
            { id: "offline", label: t("event.offline"), icon: MapPin },
          ].map((item) => (
            <Button
              key={item.id}
              size="sm"
              variant={filter === item.id ? "default" : "outline"}
              className={`rounded-full px-4 font-comfortaa text-xs h-9 gap-2 transition-all ${
                filter === item.id
                  ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                  : "bg-white border-awqaf-border-light text-gray-500 hover:bg-gray-50"
              }`}
              onClick={() => setFilter(item.id as FilterType)}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* Event List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary mb-2" />
              <p className="text-sm text-gray-500 font-comfortaa">
                {t("event.loading")}
              </p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500 font-comfortaa text-sm">
              {t("event.failedToLoad")}
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((evt) => {
              const dateInfo = formatEventDate(evt.start_date);
              const content = getEventContent(evt);

              return (
                <Card
                  key={evt.id}
                  className="overflow-hidden border-awqaf-border-light hover:shadow-md transition-shadow duration-200 group flex flex-col cursor-pointer"
                  onClick={() => openDetailModal(evt)}
                >
                  {/* Optional Image Banner */}
                  {evt.image && (
                    <div className="relative h-32 w-full bg-gray-100">
                      <Image
                        src={evt.image}
                        alt={content.title}
                        fill
                        className="object-cover"
                        unoptimized // Tambahkan unoptimized untuk fix masalah URL
                      />
                    </div>
                  )}

                  <div className="flex">
                    {/* Left Column: Date Badge */}
                    <div className="w-20 bg-accent-50 border-r border-gray-100 flex flex-col items-center justify-center p-2 text-center shrink-0">
                      <span className="text-sm font-bold text-awqaf-primary uppercase font-comfortaa">
                        {dateInfo.month}
                      </span>
                      <span className="text-3xl font-bold text-gray-800 font-comfortaa leading-none my-1">
                        {dateInfo.day}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {dateInfo.time}
                      </span>
                    </div>

                    {/* Right Column: Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        {/* Category & Status */}
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            variant="outline"
                            className="text-[10px] border-accent-200 text-awqaf-primary bg-accent-50/50"
                          >
                            Event
                          </Badge>
                          {evt.is_online === 1 ? (
                            <Badge className="text-[10px] bg-sky-100 text-sky-700 hover:bg-sky-200 border-0 px-1.5 h-5 gap-1">
                              <Video className="w-3 h-3" /> Online
                            </Badge>
                          ) : (
                            <Badge className="text-[10px] bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 px-1.5 h-5 gap-1">
                              <MapPin className="w-3 h-3" /> Offline
                            </Badge>
                          )}
                        </div>

                        {/* Title (Localized) */}
                        <h3 className="font-bold text-gray-800 text-base font-comfortaa leading-snug mb-2 group-hover:text-awqaf-primary transition-colors line-clamp-2">
                          {content.title}
                        </h3>

                        {/* Organizer */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                          <User className="w-3.5 h-3.5" />
                          <span className="font-comfortaa truncate">
                            {evt.organizer}
                          </span>
                        </div>

                        {/* Location Text */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          {evt.is_online === 1 ? (
                            <Video className="w-3.5 h-3.5 text-sky-500" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                          )}
                          <span className="font-comfortaa line-clamp-1">
                            {evt.location}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="mt-3 w-full group-hover:text-white group-hover:bg-awqaf-primary/90 transition-colors"
                      >
                        <span className="text-[10px] text-awqaf-primary group-hover:text-white font-comfortaa flex items-center justify-center gap-1 w-full">
                          {viewDetailText[locale] || "Lihat Detail"}
                          <Info className="w-3 h-3" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            // Empty State
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                <Ticket className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="font-bold text-gray-800 font-comfortaa">
                {t("event.noEvents")}
              </h3>
              <p className="text-sm text-gray-500 font-comfortaa">
                {t("event.noEventsInCategory")}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* --- EVENT DETAIL MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border-awqaf-border-light p-0">
          {selectedEvent &&
            (() => {
              const content = getEventContent(selectedEvent);
              const dateInfo = formatEventDate(selectedEvent.start_date);

              return (
                <>
                  {/* Header Image */}
                  {selectedEvent.image && (
                    <div className="relative h-48 w-full bg-gray-100">
                      <Image
                        src={selectedEvent.image}
                        alt={content.title}
                        fill
                        className="object-cover"
                        unoptimized // Fix image loading
                      />
                      <div className="absolute top-2 right-2">
                        {selectedEvent.is_online === 1 ? (
                          <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-200 border-0">
                            Online
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0">
                            Offline
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    <DialogHeader className="p-0">
                      <DialogTitle className="text-xl font-bold text-awqaf-primary font-comfortaa leading-tight">
                        {content.title}
                      </DialogTitle>
                      <DialogDescription className="hidden">
                        Detail Event
                      </DialogDescription>
                    </DialogHeader>

                    {/* Organizer Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-accent-50 p-2 rounded-lg">
                      <User className="w-4 h-4 text-awqaf-primary" />
                      <span className="font-semibold font-comfortaa">
                        {selectedEvent.organizer}
                      </span>
                    </div>

                    {/* Date & Time Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold">
                          <Calendar className="w-3.5 h-3.5" />{" "}
                          {currentLabels.date}
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          {dateInfo.fullDate}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold">
                          <Clock className="w-3.5 h-3.5" /> {currentLabels.time}
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          {dateInfo.time} WIB
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-1 border-t border-b border-gray-100 py-3">
                      <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold">
                        <MapPin className="w-3.5 h-3.5" />{" "}
                        {currentLabels.location}
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {selectedEvent.location}
                      </p>
                    </div>

                    {/* Description (HTML) */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-sm text-gray-800 font-comfortaa">
                        {currentLabels.description}
                      </h4>
                      {/* FIXED: Added fallback string for null description */}
                      <div
                        className="text-sm text-gray-600 leading-relaxed font-comfortaa"
                        dangerouslySetInnerHTML={{
                          __html: content.description ?? "",
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer Action */}
                  <DialogFooter className="p-4 pt-0">
                    {selectedEvent.registration_link ? (
                      <Button
                        className="w-full bg-awqaf-primary text-white hover:bg-awqaf-primary/90 font-comfortaa"
                        onClick={() =>
                          window.open(selectedEvent.registration_link, "_blank")
                        }
                      >
                        {t("event.registerNow")}{" "}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        {currentLabels.notAvailable}
                      </Button>
                    )}
                  </DialogFooter>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}