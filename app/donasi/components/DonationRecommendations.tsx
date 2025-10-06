"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, MapPin, Heart } from "lucide-react";
import {
  Donation,
  formatCurrency,
  formatNumber,
  getDaysRemaining,
} from "../data/donations";
import ImageWithFallback from "./ImageWithFallback";

interface DonationRecommendationsProps {
  donations: Donation[];
  onDonateClick?: (donation: Donation) => void;
  onFavoriteToggle?: (donationId: string) => void;
}

export default function DonationRecommendations({
  donations,
  onDonateClick,
  onFavoriteToggle,
}: DonationRecommendationsProps) {
  if (donations.length === 0) {
    return (
      <Card className="border-awqaf-border-light">
        <CardContent className="p-6 text-center">
          <p className="text-awqaf-foreground-secondary font-comfortaa">
            Tidak ada rekomendasi donasi saat ini
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground font-comfortaa">
            Rekomendasi Donasi
          </h3>
          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
            Donasi yang mungkin menarik untuk Anda
          </p>
        </div>
        <Badge
          variant="secondary"
          className="bg-awqaf-primary text-white text-xs px-2 py-1"
        >
          {donations.length} Donasi
        </Badge>
      </div>

      {/* Donation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {donations.map((donation) => {
          const daysRemaining = getDaysRemaining(donation.endDate);

          return (
            <Card
              key={donation.id}
              className="border-awqaf-border-light hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={donation.image}
                  alt={donation.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {donation.isUrgent && (
                    <Badge className="bg-error text-white text-xs px-2 py-1">
                      Urgent
                    </Badge>
                  )}
                  <Badge className="bg-awqaf-primary text-white text-xs px-2 py-1">
                    {donation.category.toUpperCase()}
                  </Badge>
                </div>

                {/* Favorite Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFavoriteToggle?.(donation.id)}
                  className="absolute top-3 right-3 w-8 h-8 p-0 rounded-full bg-black/20 hover:bg-black/40 text-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <CardContent className="p-4">
                {/* Title and Organization */}
                <div className="mb-3">
                  <h4 className="font-semibold text-card-foreground text-sm font-comfortaa mb-1 line-clamp-2">
                    {donation.title}
                  </h4>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    {donation.organization}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-3 line-clamp-2">
                  {donation.description}
                </p>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      Progress
                    </span>
                    <span className="text-xs font-medium text-awqaf-primary font-comfortaa">
                      {donation.progress}%
                    </span>
                  </div>
                  <Progress
                    value={donation.progress}
                    className="h-1.5 bg-accent-100"
                  />
                  <div className="flex justify-between text-xs text-awqaf-foreground-secondary font-comfortaa mt-1">
                    <span>{formatCurrency(donation.currentAmount)}</span>
                    <span>{formatCurrency(donation.targetAmount)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-3 text-xs text-awqaf-foreground-secondary">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span className="font-comfortaa">
                      {formatNumber(donation.donorCount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span className="font-comfortaa">{daysRemaining} hari</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="font-comfortaa truncate max-w-20">
                      {donation.location}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => onDonateClick?.(donation)}
                  className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white text-xs font-comfortaa"
                  size="sm"
                >
                  Donasi Sekarang
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <Button
          variant="outline"
          className="border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-primary font-comfortaa"
        >
          Lihat Semua Donasi
        </Button>
      </div>
    </div>
  );
}
