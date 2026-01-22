"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  MapPin,
  Navigation,
  Clock,
  Users,
  Star,
  Globe,
  Car,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// Import Service yang sudah dibuat sebelumnya
import { useGetPlacesQuery } from "@/services/public/places.service";
import { Place } from "@/types/public/places";
import { useI18n } from "@/app/hooks/useI18n";

// Extended Interface untuk kebutuhan UI Masjid (Simulasi data tambahan)
interface Masjid extends Place {
  reviewCount: number;
  capacity: number;
  isOpen: boolean;
  prayerTimes?: {
    subuh: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
  };
  contact?: {
    phone?: string;
    website?: string;
  };
}

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export default function MasjidPage() {
  const { t, locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "masjid" | "mushola"
  >("all");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "name">(
    "distance",
  );

  // Radius state (default 5km)
  const [radius, setRadius] = useState([5]);

  // Default Location (Jakarta)
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: -6.2088,
    longitude: 106.8456,
    city: "Jakarta",
    country: "Indonesia",
  });

  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Hook API Service
  const {
    data: placesData,
    isLoading: isLoadingPlaces,
    isFetching,
    refetch,
  } = useGetPlacesQuery({
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    radius: radius[0],
  });

  // Helper Translation
  const getPlaceContent = (place: Place) => {
    const localized = place.translations.find((t) => t.locale === locale);
    if (localized && localized.name) {
      return {
        name: localized.name,
        description: localized.description,
        address: place.address,
      }; // Asumsi address ada di root atau perlu logic serupa
    }
    const idFallback = place.translations.find((t) => t.locale === "id");
    if (idFallback && idFallback.name) {
      return {
        name: idFallback.name,
        description: idFallback.description,
        address: place.address,
      };
    }
    return {
      name: place.name,
      description: place.description,
      address: place.address,
    };
  };

  const getCurrentLocation = async () => {
    setIsLocating(true);
    setLocationError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation tidak didukung oleh browser ini");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          });
        },
      );

      const { latitude, longitude } = position.coords;

      try {
        // Reverse Geocoding (Optional, untuk nama kota)
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${locale}`,
        );
        const data = await response.json();

        setUserLocation({
          latitude,
          longitude,
          city: data.city || data.locality || "Lokasi Terkini",
          country: data.countryName || "Indonesia",
        });
      } catch {
        setUserLocation({
          latitude,
          longitude,
          city: "Lokasi Terkini",
          country: "Indonesia",
        });
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal mengambil lokasi";
      setLocationError(errorMessage);
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Data Processing (Mapping & Filtering)
  const processedData = useMemo(() => {
    if (!placesData) return [];

    // 1. Convert API Data to Masjid Interface & Filter Type Base
    // Hanya ambil data yang type-nya mengandung 'masjid' atau 'mushola'
    const baseList = placesData
      .filter((p) => {
        const type = p.type.toLowerCase();
        return type.includes("masjid") || type.includes("mushola");
      })
      .map((place) => {
        // Simulasi data tambahan yang belum ada di API Places standar
        // Agar UI tetap kaya
        return {
          ...place,
          reviewCount: Math.floor(Math.random() * 500) + 50,
          capacity: Math.floor(Math.random() * 2000) + 100,
          isOpen: true, // Asumsi buka
          prayerTimes: {
            subuh: "04:30",
            dzuhur: "12:00",
            ashar: "15:15",
            maghrib: "18:00",
            isya: "19:15",
          },
        } as Masjid;
      });

    let filtered = baseList;

    // 2. Filter Search Query (Name/Address)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((masjid) => {
        const content = getPlaceContent(masjid);
        return (
          content.name.toLowerCase().includes(q) ||
          content.address.toLowerCase().includes(q)
        );
      });
    }

    // 3. Filter Tab Type
    if (selectedType !== "all") {
      filtered = filtered.filter((masjid) =>
        masjid.type?.toLowerCase().includes(selectedType),
      );
    }

    // 4. Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance;
        case "rating":
          return parseFloat(b.rating) - parseFloat(a.rating);
        case "name":
          const nameA = getPlaceContent(a).name;
          const nameB = getPlaceContent(b).name;
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

    return filtered;
  }, [placesData, searchQuery, sortBy, selectedType, locale]);

  // Helpers
  const formatDistance = (distance?: number): string => {
    if (!distance) return "-";
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const formatCapacity = (capacity: number): string => {
    if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)}K jamaah`;
    }
    return `${capacity} jamaah`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isLoading = isLocating || isLoadingPlaces || isFetching;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary"
                >
                  <Navigation className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                {t("mosque.title") || "Masjid & Mushola"}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary"
                onClick={() => {
                  getCurrentLocation();
                  // Refetch trigger otomatis karena state userLocation berubah
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Location Status */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-awqaf-primary" />
              </div>
              <div className="flex-1">
                <div>
                  <p className="font-medium text-card-foreground font-comfortaa">
                    {userLocation.city}, {userLocation.country}
                  </p>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    {getCurrentTime()} •{" "}
                    {isLocating ? "Mencari..." : "Lokasi terdeteksi"}
                  </p>
                </div>
              </div>
              {!locationError ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
            </div>
          </CardContent>
        </Card>

        {locationError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800 font-comfortaa">Error</p>
                <p className="text-sm text-red-700 font-comfortaa">
                  {locationError}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* --- SEARCH & RADIUS CONTROL --- */}
        <div className="space-y-4">
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary" />
                <Input
                  placeholder={
                    t("mosque.searchPlaceholder") ||
                    "Cari masjid atau mushola..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-comfortaa"
                />
              </div>

              {/* Radius Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 font-comfortaa flex items-center gap-1">
                    <div className="w-4 h-4 border-2 border-gray-400 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    {t("mosque.searchRadius") || "Radius Pencarian"}
                  </label>
                  <span className="text-xs font-bold text-awqaf-primary bg-accent-50 px-2 py-1 rounded-full">
                    {radius[0]} km
                  </span>
                </div>
                <Slider
                  defaultValue={[5]}
                  max={50}
                  min={1}
                  step={1}
                  value={radius}
                  onValueChange={(val) => setRadius(val)}
                  className="w-full"
                />
                <p className="text-[10px] text-gray-400 text-center font-comfortaa">
                  Geser untuk memperluas area pencarian
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Filters Types & Sorting */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("all")}
              className="flex-shrink-0"
            >
              Semua
            </Button>
            <Button
              variant={selectedType === "masjid" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("masjid")}
              className="flex-shrink-0"
            >
              Masjid
            </Button>
            <Button
              variant={selectedType === "mushola" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("mushola")}
              className="flex-shrink-0"
            >
              Mushola
            </Button>
            <div className="flex-shrink-0 flex items-center gap-1 ml-2">
              <Filter className="w-4 h-4 text-awqaf-foreground-secondary" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm bg-transparent border-none outline-none text-awqaf-foreground-secondary"
              >
                <option value="distance">Jarak</option>
                <option value="rating">Rating</option>
                <option value="name">Nama</option>
              </select>
            </div>
          </div>
        </div>

        {/* Masjid List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {isLoadingPlaces
                ? "Memuat..."
                : `${processedData.length} Tempat Ditemukan`}
            </h2>
          </div>

          <div className="space-y-4">
            {isLoadingPlaces ? (
              <div className="text-center py-10">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-awqaf-primary" />
                <p className="text-sm text-gray-500 mt-2 font-comfortaa">
                  Mencari masjid terdekat ({radius[0]} km)...
                </p>
              </div>
            ) : (
              processedData.map((masjid) => {
                const content = getPlaceContent(masjid);
                return (
                  <Card
                    key={masjid.id}
                    className="border-awqaf-border-light hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4 space-y-4">
                      {/* Image */}
                      <div>
                        <Image
                          unoptimized
                          src={
                            masjid.image ||
                            "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=627&auto=format&fit=crop"
                          }
                          alt={content.name}
                          width={400}
                          height={200}
                          className="w-full h-40 object-cover rounded-lg bg-gray-100"
                        />
                      </div>

                      {/* Title & Rating */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-card-foreground font-comfortaa">
                              {content.name}
                            </h3>
                            <Badge
                              variant={
                                masjid.type?.toLowerCase().includes("masjid")
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {masjid.type?.toLowerCase().includes("mushola")
                                ? "Mushola"
                                : "Masjid"}
                            </Badge>
                          </div>
                          {/* Render HTML address */}
                          <div
                            className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html: content.address,
                            }}
                          />
                        </div>
                        <div className="text-right pl-2">
                          <div className="flex items-center justify-end gap-1 mb-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-card-foreground font-comfortaa">
                              {masjid.rating}
                            </span>
                            <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                              ({masjid.reviewCount})
                            </span>
                          </div>
                          <p className="text-xs text-awqaf-foreground-secondary font-comfortaa font-bold text-awqaf-primary">
                            {formatDistance(masjid.distance)}
                          </p>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-awqaf-foreground-secondary" />
                          <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                            {formatCapacity(masjid.capacity)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-awqaf-foreground-secondary" />
                          <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                            {masjid.isOpen ? "Buka 24 Jam" : "Tutup"}
                          </span>
                        </div>
                      </div>

                      {/* Facilities */}
                      {masjid.facilities && masjid.facilities.length > 0 && (
                        <div>
                          <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-2">
                            Fasilitas
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {masjid.facilities
                              .slice(0, 4)
                              .map((facility, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {facility}
                                </Badge>
                              ))}
                            {masjid.facilities.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{masjid.facilities.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${masjid.latitude},${masjid.longitude}`;
                            window.open(url, "_blank");
                          }}
                        >
                          <Car className="w-4 h-4 mr-2" /> Navigasi
                        </Button>
                        {masjid.contact?.website && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(masjid.contact?.website, "_blank")
                            }
                          >
                            <Globe className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {!isLoadingPlaces && processedData.length === 0 && (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                  Tidak ada masjid/mushola ditemukan
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Coba perluas radius pencarian atau ubah lokasi.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}