"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Gift } from "lucide-react";
import DonationCarousel from "./components/DonationCarousel";
import DonationNavigation from "./components/DonationNavigation";
import DonationRecommendations from "./components/DonationRecommendations";
import {
  popularDonations,
  donationCategories,
  recommendedDonations,
  Donation,
} from "./data/donations";

export default function DonasiPage() {
  const handleDonateClick = (donation: Donation) => {
    // TODO: Implement payment gateway integration
    console.log("Donate clicked:", donation);
    alert(`Fitur donasi untuk "${donation.title}" akan segera tersedia!`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-awqaf-primary to-awqaf-primary/80 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gift className="w-8 h-8" />
              <h1 className="text-2xl font-bold font-comfortaa">
                Donasi & Sedekah
              </h1>
            </div>
            <p className="text-white/90 font-comfortaa max-w-2xl mx-auto">
              Berikan donasi terbaik Anda untuk kemaslahatan umat. Setiap rupiah
              yang Anda berikan akan membantu sesama yang membutuhkan.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Popular Donations Carousel */}
        <section>
          <DonationCarousel
            donations={popularDonations}
            onDonateClick={handleDonateClick}
          />
        </section>

        {/* Donation Categories Navigation */}
        <section>
          <DonationNavigation categories={donationCategories} />
        </section>

        {/* Donation Recommendations */}
        <section>
          <DonationRecommendations
            donations={recommendedDonations}
            onDonateClick={handleDonateClick}
          />
        </section>

        {/* Quick Actions */}
        <section>
          <Card className="border-awqaf-border-light">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-card-foreground font-comfortaa mb-2">
                  Butuh Bantuan?
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Tim kami siap membantu Anda dalam proses donasi
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-primary font-comfortaa"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Donasi Favorit
                </Button>
                <Button
                  variant="outline"
                  className="border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-primary font-comfortaa"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan
                </Button>
                <Button
                  variant="outline"
                  className="border-awqaf-border-light text-awqaf-foreground-secondary hover:border-awqaf-primary hover:text-awqaf-primary font-comfortaa"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Riwayat Donasi
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Motivational Quote */}
        <section>
          <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-awqaf-primary font-comfortaa mb-2">
                &quot;Sesungguhnya sedekah itu akan memadamkan panas kubur bagi
                pelakunya, dan sesungguhnya di hari kiamat seorang mukmin akan
                berlindung di bawah naungan sedekahnya&quot;
              </p>
              <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
                - HR. Thabrani
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
