"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, Users, MapPin, Heart, Share2 } from "lucide-react";
import {
  getDonationsByCategory,
  formatCurrency,
  formatNumber,
  getDaysRemaining,
  Donation,
} from "../data/donations";
import ImageWithFallback from "../components/ImageWithFallback";
import Link from "next/link";

export default function KurbanPage() {
  const [favoriteDonations, setFavoriteDonations] = useState<Set<string>>(
    new Set()
  );

  const kurbanDonations = getDonationsByCategory("kurban");

  const handleDonateClick = (donation: Donation) => {
    // TODO: Implement payment gateway integration
    console.log("Donate clicked:", donation);
    alert(`Fitur donasi untuk "${donation.title}" akan segera tersedia!`);
  };

  const handleFavoriteToggle = (donationId: string) => {
    setFavoriteDonations((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(donationId)) {
        newFavorites.delete(donationId);
      } else {
        newFavorites.add(donationId);
      }
      return newFavorites;
    });
  };

  const handleShare = (donation: Donation) => {
    if (navigator.share) {
      navigator.share({
        title: donation.title,
        text: donation.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `${donation.title} - ${donation.description}`
      );
      alert("Link donasi telah disalin ke clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-error to-error/80 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/donasi">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">🐄</span>
              <h1 className="text-2xl font-bold font-comfortaa">Kurban</h1>
            </div>
            <p className="text-white/90 font-comfortaa max-w-2xl mx-auto">
              Tunaikan ibadah kurban untuk berbagi kebahagiaan dengan sesama.
              Hewan kurban akan didistribusikan kepada yang membutuhkan
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Info Section */}
        <Card className="border-awqaf-border-light mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-error font-comfortaa mb-1">
                  {kurbanDonations.length}
                </div>
                <div className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Program Kurban Aktif
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-error font-comfortaa mb-1">
                  {formatCurrency(
                    kurbanDonations.reduce((sum, d) => sum + d.currentAmount, 0)
                  )}
                </div>
                <div className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Total Terkumpul
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-error font-comfortaa mb-1">
                  {formatNumber(
                    kurbanDonations.reduce((sum, d) => sum + d.donorCount, 0)
                  )}
                </div>
                <div className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Total Donatur
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kurbanDonations.map((donation) => {
            const daysRemaining = getDaysRemaining(donation.endDate);
            const isFavorite = favoriteDonations.has(donation.id);

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
                    <Badge className="bg-error text-white text-xs px-2 py-1">
                      KURBAN
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFavoriteToggle(donation.id)}
                      className={`w-8 h-8 p-0 rounded-full ${
                        isFavorite
                          ? "bg-error text-white"
                          : "bg-black/20 hover:bg-black/40 text-white"
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(donation)}
                      className="w-8 h-8 p-0 rounded-full bg-black/20 hover:bg-black/40 text-white"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
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
                      <span className="text-xs font-medium text-error font-comfortaa">
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
                      <span className="font-comfortaa">
                        {daysRemaining} hari
                      </span>
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
                    onClick={() => handleDonateClick(donation)}
                    className="w-full bg-error hover:bg-error/90 text-white text-xs font-comfortaa"
                    size="sm"
                  >
                    Kurban Sekarang
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Motivational Quote */}
        <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200 mt-8">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-error font-comfortaa mb-2">
              &quot;Maka dirikanlah shalat karena Tuhanmu dan berkurbanlah&quot;
            </p>
            <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
              - QS. Al-Kautsar: 2
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
