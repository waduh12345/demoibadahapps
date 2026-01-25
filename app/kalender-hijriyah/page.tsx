"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowLeft,
  Info,
  Star,
  Clock,
  BookOpen,
  Sparkles,
  Gift,
  Moon,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  hariBesarData,
  namaBulanHijriyah,
  namaHari,
  getHariBesar,
  toHijriyah,
  getHijriMonthDays,
  getHijriDayOfWeek,
  type HariBesar,
} from "./data-hari-besar";
import { useI18n } from "@/app/hooks/useI18n";

interface CalendarDay {
  gregorianDay: number;
  gregorianMonth: number;
  gregorianYear: number;
  hijriDate: { year: number; month: number; day: number };
  hariBesar: HariBesar | null;
  isToday: boolean;
  isCurrentMonth: boolean;
}

export default function KalenderHijriyahPage() {
  const { t, locale } = useI18n();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const currentHijriDate = toHijriyah(new Date(currentYear, currentMonth, 1));
  const [selectedHariBesar, setSelectedHariBesar] = useState<HariBesar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const hariBesarSectionRef = useRef<HTMLDivElement>(null);

  // Nama bulan Masehi
  const namaBulanMasehi = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Generate calendar days for Gregorian calendar
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const today = new Date();
    
    // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(currentYear, currentMonth, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Get number of days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Get number of days in previous month
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Add empty cells for days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(currentYear, currentMonth - 1, day);
      const hijriDate = toHijriyah(date);
      const hariBesar = getHariBesar(hijriDate.month, hijriDate.day);
      
      days.push({
        gregorianDay: day,
        gregorianMonth: currentMonth - 1,
        gregorianYear: currentYear,
        hijriDate,
        hariBesar,
        isToday: false,
        isCurrentMonth: false,
      });
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const hijriDate = toHijriyah(date);
      const hariBesar = getHariBesar(hijriDate.month, hijriDate.day);
      const isToday = 
        day === today.getDate() && 
        currentMonth === today.getMonth() && 
        currentYear === today.getFullYear();
      
      days.push({
        gregorianDay: day,
        gregorianMonth: currentMonth,
        gregorianYear: currentYear,
        hijriDate,
        hariBesar,
        isToday,
        isCurrentMonth: true,
      });
    }
    
    // Add days from next month to complete the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      const hijriDate = toHijriyah(date);
      const hariBesar = getHariBesar(hijriDate.month, hijriDate.day);
      
      days.push({
        gregorianDay: day,
        gregorianMonth: currentMonth + 1,
        gregorianYear: currentYear,
        hijriDate,
        hariBesar,
        isToday: false,
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Navigation functions
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  // Handle day click
  const handleDayClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return; // Skip days from other months
    
    setSelectedDay(day);
    
    if (day.hariBesar) {
      setSelectedHariBesar(day.hariBesar);
      setIsModalOpen(true);
    } else {
      // Scroll to hari besar section
      if (hariBesarSectionRef.current) {
        hariBesarSectionRef.current.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }
    }
  };

  // Get type color and text
  const getTypeInfo = (type: string) => {
    switch (type) {
      case "wajib":
        return { 
          color: "bg-red-100 text-red-700 border-red-200", 
          text: "Wajib",
          bgColor: "bg-red-50"
        };
      case "sunnah":
        return { 
          color: "bg-green-100 text-green-700 border-green-200", 
          text: "Sunnah",
          bgColor: "bg-green-50"
        };
      case "sejarah":
        return { 
          color: "bg-blue-100 text-blue-700 border-blue-200", 
          text: "Sejarah",
          bgColor: "bg-blue-50"
        };
      case "peringatan":
        return { 
          color: "bg-yellow-100 text-yellow-700 border-yellow-200", 
          text: "Peringatan",
          bgColor: "bg-yellow-50"
        };
      default:
        return { 
          color: "bg-gray-100 text-gray-700 border-gray-200", 
          text: "Lainnya",
          bgColor: "bg-gray-50"
        };
    }
  };

  // Get hari besar for current month (check all days in current month)
  const getHariBesarThisMonth = () => {
    const hariBesarInMonth: HariBesar[] = [];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const hijriDate = toHijriyah(date);
      const hariBesar = getHariBesar(hijriDate.month, hijriDate.day);
      
      if (hariBesar && !hariBesarInMonth.find(h => h.id === hariBesar.id)) {
        hariBesarInMonth.push(hariBesar);
      }
    }
    
    return hariBesarInMonth;
  };

  const hariBesarThisMonth = getHariBesarThisMonth();

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
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t("hijriCalendar.title")}
                </h1>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {namaBulanMasehi[currentMonth]} {currentYear}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                title={t("hijriCalendar.today")}
              >
                <Clock className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Current Date Info */}
        <Card className="border-awqaf-border-light bg-gradient-to-br from-awqaf-primary to-awqaf-primary/80 text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 opacity-10">
              <Sun className="w-32 h-32 -mt-4 -mr-4" />
            </div>
            <div className="absolute top-0 left-0 opacity-10">
              <Moon className="w-24 h-24 -mt-2 -ml-2" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-comfortaa opacity-90">
                  Hari Ini
                </span>
              </div>
              <h2 className="text-3xl font-bold font-comfortaa text-center mb-2">
                {new Date().getDate()} {namaBulanMasehi[new Date().getMonth()]} {new Date().getFullYear()}
              </h2>
              <div className="text-center mb-2">
                <p className="text-sm font-comfortaa opacity-90">
                  {new Date().toLocaleDateString(locale === "id" ? "id-ID" : locale === "en" ? "en-US" : locale === "ar" ? "ar-SA" : locale === "fr" ? "fr-FR" : locale === "kr" ? "ko-KR" : "ja-JP", {
                    weekday: "long",
                  })}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/20">
                <Moon className="w-4 h-4" />
                <p className="text-sm font-arabic opacity-90">
                  {toHijriyah(new Date()).day} {namaBulanHijriyah[toHijriyah(new Date()).month - 1]} {toHijriyah(new Date()).year} H
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Navigation */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
                className="flex items-center gap-2 font-comfortaa"
              >
                <ChevronLeft className="w-4 h-4" />
                {t("hijriCalendar.previous")}
              </Button>

              <div className="text-center">
                <p className="text-sm font-semibold text-awqaf-primary font-comfortaa">
                  {namaBulanMasehi[currentMonth]}
                </p>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {currentYear}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
                className="flex items-center gap-2 font-comfortaa"
              >
                {t("hijriCalendar.next")}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-3">
              {namaHari.map((hari) => (
                <div
                  key={hari}
                  className="text-center text-xs font-semibold text-awqaf-foreground-secondary font-comfortaa p-2"
                >
                  {hari.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const { gregorianDay, hijriDate, hariBesar, isToday, isCurrentMonth } = day;
                const typeInfo = hariBesar ? getTypeInfo(hariBesar.type) : null;

                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(day)}
                    disabled={!isCurrentMonth}
                    className={`h-16 flex flex-col items-center justify-center text-xs font-comfortaa rounded-lg transition-all duration-200 relative group ${
                      !isCurrentMonth
                        ? "opacity-30 cursor-default"
                        : isToday
                        ? "bg-gradient-to-br from-awqaf-primary to-awqaf-primary/80 text-white shadow-lg scale-105 cursor-pointer"
                        : hariBesar
                        ? `${typeInfo?.bgColor} hover:shadow-md border-2 ${typeInfo?.color.split(' ')[2]} cursor-pointer`
                        : "hover:bg-accent-100 border border-transparent hover:border-awqaf-border-light cursor-pointer"
                    }`}
                  >
                    {/* Tanggal Masehi (besar) */}
                    <span className={`font-bold text-base ${isToday ? "text-white" : isCurrentMonth ? "text-card-foreground" : "text-gray-400"}`}>
                      {gregorianDay}
                    </span>
                    
                    {/* Tanggal Hijriyah (kecil di bawah) */}
                    {isCurrentMonth && (
                      <span className={`text-[9px] leading-tight font-arabic mt-0.5 ${isToday ? "text-white/90" : "text-awqaf-foreground-secondary"}`}>
                        {hijriDate.day} {namaBulanHijriyah[hijriDate.month - 1].slice(0, 3)}
                      </span>
                    )}
                    
                    {/* Icon hari besar */}
                    {hariBesar && isCurrentMonth && (
                      <div className="absolute -top-1 -right-1 text-xs">
                        {hariBesar.icon}
                      </div>
                    )}
                    
                    {/* Indicator hari ini */}
                    {isToday && (
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full border border-white animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-awqaf-border-light">
              <div className="flex flex-wrap gap-3 text-xs font-comfortaa">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-awqaf-primary"></div>
                  <span className="text-awqaf-foreground-secondary">{t("hijriCalendar.importantDay")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-awqaf-foreground-secondary">{t("hijriCalendar.todayMarker")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hari Besar List */}
        <div ref={hariBesarSectionRef} className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-awqaf-primary" />
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {t("hijriCalendar.importantDays")} {namaBulanMasehi[currentMonth]}
            </h2>
            {hariBesarThisMonth.length > 0 && (
              <Badge variant="secondary" className="bg-awqaf-primary text-white">
                {hariBesarThisMonth.length}
              </Badge>
            )}
          </div>

          {hariBesarThisMonth.length > 0 ? (
            <div className="space-y-3">
              {hariBesarThisMonth.map((hari) => {
                const typeInfo = getTypeInfo(hari.type);
                return (
                  <Card
                    key={hari.id}
                    className={`border-2 hover:shadow-lg transition-all duration-200 cursor-pointer ${typeInfo.color.split(' ')[2]}`}
                    onClick={() => {
                      setSelectedHariBesar(hari);
                      setIsModalOpen(true);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{hari.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-card-foreground font-comfortaa">
                              {hari.name}
                            </h3>
                            <Badge className={`text-xs ${typeInfo.color}`}>
                              {typeInfo.text}
                            </Badge>
                          </div>
                          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-2 mb-1">
                            {hari.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-awqaf-foreground-secondary font-comfortaa">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {hari.date.day} {namaBulanHijriyah[hari.date.month - 1]}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-awqaf-foreground-secondary" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {t("hijriCalendar.noImportantDays")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* All Hari Besar Reference */}
        <Card className="border-awqaf-border-light bg-accent-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-awqaf-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-card-foreground font-comfortaa mb-1">
                  {t("hijriCalendar.information")}
                </h4>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa leading-relaxed">
                  {t("hijriCalendar.infoDescription")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Hari Besar Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          {selectedHariBesar && (
            <>
              <DialogHeader className="pb-4 border-b border-awqaf-border-light">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl">{selectedHariBesar.icon}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                    className="w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <DialogTitle className="text-xl font-comfortaa">
                  {selectedHariBesar.name}
                </DialogTitle>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={`text-xs ${getTypeInfo(selectedHariBesar.type).color}`}>
                    {getTypeInfo(selectedHariBesar.type).text}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-awqaf-foreground-secondary font-comfortaa">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {selectedHariBesar.date.day} {namaBulanHijriyah[selectedHariBesar.date.month - 1]}
                    </span>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-awqaf-primary" />
                    <h4 className="font-semibold text-card-foreground font-comfortaa">
                      {t("hijriCalendar.explanation")}
                    </h4>
                  </div>
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed">
                    {selectedHariBesar.description}
                  </p>
                </div>

                {selectedDay && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900 font-comfortaa">
                        {t("hijriCalendar.selectedDate")}
                      </h4>
                    </div>
                    <p className="text-sm text-blue-800 font-comfortaa mb-1">
                      <span className="font-semibold">Masehi:</span> {selectedDay.gregorianDay} {namaBulanMasehi[selectedDay.gregorianMonth]} {selectedDay.gregorianYear}
                    </p>
                    <p className="text-sm text-blue-800 font-comfortaa">
                      <span className="font-semibold">Hijriyah:</span> {selectedDay.hijriDate.day} {namaBulanHijriyah[selectedDay.hijriDate.month - 1]} {selectedDay.hijriDate.year} H
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
