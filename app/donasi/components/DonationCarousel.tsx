"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Users } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Donation,
  formatCurrency,
  formatNumber,
  getDaysRemaining,
} from "../data/donations";
import ImageWithFallback from "./ImageWithFallback";
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

interface DonationCarouselProps {
  donations: Donation[];
  onDonateClick?: (donation: Donation) => void;
}

export default function DonationCarousel({
  donations,
  onDonateClick,
}: DonationCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [api]);

  if (donations.length === 0) {
    return (
      <Card className="border-awqaf-border-light">
        <CardContent className="p-6 text-center">
          <p className="text-awqaf-foreground-secondary font-comfortaa">
            Tidak ada donasi populer saat ini
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {donations.map((donation) => {
            const daysRemaining = getDaysRemaining(donation.endDate);

            return (
              <CarouselItem key={donation.id}>
                <Card className="border-awqaf-border-light overflow-hidden p-0">
                  <div className="relative aspect-video">
                    {/* Background Image - Full Coverage */}
                    <div className="absolute inset-0">
                      <ImageWithFallback
                        src={donation.image}
                        alt={donation.title}
                        fill
                        className="object-cover"
                      />
                      {/* Darker overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-6">
                      {/* Title Only */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white font-comfortaa leading-tight">
                          {donation.title}
                        </h3>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-100 font-comfortaa font-medium">
                            Progress
                          </span>
                          <span className="text-base font-bold text-white font-comfortaa">
                            {donation.progress}%
                          </span>
                        </div>
                        <Progress
                          value={donation.progress}
                          className="h-2 bg-white/20 mb-2"
                        />
                        <div className="flex justify-between text-xs text-gray-200 font-comfortaa">
                          <span className="font-medium">
                            {formatCurrency(donation.currentAmount)}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(donation.targetAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Stats - Simplified */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-100">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="font-comfortaa font-medium">
                            {formatNumber(donation.donorCount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="font-comfortaa font-medium">
                            {daysRemaining} hari
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => onDonateClick?.(donation)}
                        className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa text-base py-2 h-auto"
                      >
                        Donasi Sekarang
                      </Button>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Dots Indicator */}
      {donations.length > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          {donations.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current
                  ? "bg-awqaf-primary scale-125"
                  : "bg-awqaf-border-light hover:bg-awqaf-primary/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
