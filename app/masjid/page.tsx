"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Navigation,
  Clock,
  Users,
  Star,
  Phone,
  Globe,
  Car,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Masjid {
  id: string;
  name: string;
  type: "masjid" | "mushola";
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  rating: number;
  reviewCount: number;
  capacity: number;
  facilities: string[];
  prayerTimes: {
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
  isOpen: boolean;
  nextPrayer?: {
    name: string;
    time: string;
    minutesLeft: number;
  };
}

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

const sampleMasjidData: Masjid[] = [
  {
    id: "1",
    name: "Masjid Istiqlal",
    type: "masjid",
    address:
      "Jl. Taman Wijaya Kusuma, Ps. Baru, Kecamatan Sawah Besar, Kota Jakarta Pusat",
    latitude: -6.1702,
    longitude: 106.8294,
    rating: 4.8,
    reviewCount: 1250,
    capacity: 200000,
    facilities: [
      "Parkir",
      "AC",
      "Sound System",
      "Wudhu",
      "Perpustakaan",
      "Kantin",
    ],
    prayerTimes: {
      subuh: "04:30",
      dzuhur: "12:00",
      ashar: "15:15",
      maghrib: "18:00",
      isya: "19:15",
    },
    contact: {
      phone: "(021) 3811708",
      website: "https://istiqlal.or.id",
    },
    isOpen: true,
  },
  {
    id: "2",
    name: "Masjid Al-Azhar",
    type: "masjid",
    address: "Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan",
    latitude: -6.2458,
    longitude: 106.8006,
    rating: 4.6,
    reviewCount: 890,
    capacity: 5000,
    facilities: ["Parkir", "AC", "Sound System", "Wudhu", "Perpustakaan"],
    prayerTimes: {
      subuh: "04:32",
      dzuhur: "12:02",
      ashar: "15:17",
      maghrib: "18:02",
      isya: "19:17",
    },
    isOpen: true,
  },
  {
    id: "3",
    name: "Mushola Al-Hidayah",
    type: "mushola",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    latitude: -6.2088,
    longitude: 106.8456,
    rating: 4.3,
    reviewCount: 156,
    capacity: 200,
    facilities: ["Parkir", "Wudhu"],
    prayerTimes: {
      subuh: "04:31",
      dzuhur: "12:01",
      ashar: "15:16",
      maghrib: "18:01",
      isya: "19:16",
    },
    isOpen: true,
  },
  {
    id: "4",
    name: "Masjid Cut Meutia",
    type: "masjid",
    address: "Jl. Cut Meutia No. 1, Menteng, Jakarta Pusat",
    latitude: -6.1944,
    longitude: 106.8229,
    rating: 4.5,
    reviewCount: 320,
    capacity: 1000,
    facilities: ["Parkir", "AC", "Sound System", "Wudhu", "Perpustakaan"],
    prayerTimes: {
      subuh: "04:30",
      dzuhur: "12:00",
      ashar: "15:15",
      maghrib: "18:00",
      isya: "19:15",
    },
    isOpen: true,
  },
  {
    id: "5",
    name: "Mushola Baiturrahman",
    type: "mushola",
    address: "Jl. Thamrin No. 45, Jakarta Pusat",
    latitude: -6.1944,
    longitude: 106.8229,
    rating: 4.2,
    reviewCount: 89,
    capacity: 150,
    facilities: ["Wudhu"],
    prayerTimes: {
      subuh: "04:31",
      dzuhur: "12:01",
      ashar: "15:16",
      maghrib: "18:01",
      isya: "19:16",
    },
    isOpen: true,
  },
];

export default function MasjidPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "masjid" | "mushola"
  >("all");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "name">(
    "distance"
  );
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [masjidData, setMasjidData] = useState<Masjid[]>(sampleMasjidData);

  // Get user location
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
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
            maximumAge: 300000, // 5 minutes
          });
        }
      );

      const { latitude, longitude } = position.coords;

      // Reverse geocoding to get city name
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`
        );
        const data = await response.json();

        setUserLocation({
          latitude,
          longitude,
          city: data.city || data.locality || "Lokasi tidak diketahui",
          country: data.countryName || "Indonesia",
        });
      } catch {
        setUserLocation({
          latitude,
          longitude,
          city: "Lokasi tidak diketahui",
          country: "Indonesia",
        });
      }

      // Calculate distances
      const masjidWithDistance = sampleMasjidData.map((masjid) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          masjid.latitude,
          masjid.longitude
        );
        return { ...masjid, distance };
      });

      setMasjidData(masjidWithDistance);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mendapatkan lokasi";
      setLocationError(errorMessage);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get next prayer time
  const getNextPrayer = (prayerTimes: Masjid["prayerTimes"]) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: "Subuh", time: prayerTimes.subuh },
      { name: "Dzuhur", time: prayerTimes.dzuhur },
      { name: "Ashar", time: prayerTimes.ashar },
      { name: "Maghrib", time: prayerTimes.maghrib },
      { name: "Isya", time: prayerTimes.isya },
    ];

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(":").map(Number);
      const prayerTime = hours * 60 + minutes;

      if (prayerTime > currentTime) {
        return {
          name: prayer.name,
          time: prayer.time,
          minutesLeft: prayerTime - currentTime,
        };
      }
    }

    // If no prayer found for today, return tomorrow's first prayer
    return {
      name: "Subuh",
      time: prayerTimes.subuh,
      minutesLeft: 24 * 60 - currentTime + (4 * 60 + 30), // Tomorrow's subuh
    };
  };

  // Filter and sort masjid data
  const filteredMasjidData = useMemo(() => {
    let filtered = masjidData;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (masjid) =>
          masjid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          masjid.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((masjid) => masjid.type === selectedType);
    }

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return (a.distance || 0) - (b.distance || 0);
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [masjidData, searchQuery, selectedType, sortBy]);

  // Format distance
  const formatDistance = (distance?: number): string => {
    if (!distance) return "Jarak tidak diketahui";
    if (distance < 1) {
      return `${Math.round(distance * 1000)} meter`;
    }
    return `${distance.toFixed(1)} km`;
  };

  // Format capacity
  const formatCapacity = (capacity: number): string => {
    if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)}K jamaah`;
    }
    return `${capacity} jamaah`;
  };

  // Get current time
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                  <Navigation className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                Masjid & Mushola
              </h1>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? (
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
                {userLocation ? (
                  <div>
                    <p className="font-medium text-card-foreground font-comfortaa">
                      {userLocation.city}, {userLocation.country}
                    </p>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {getCurrentTime()} • Lokasi terdeteksi
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-card-foreground font-comfortaa">
                      Lokasi belum terdeteksi
                    </p>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      Tekan tombol refresh untuk mendapatkan lokasi
                    </p>
                  </div>
                )}
              </div>
              {userLocation ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {locationError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800 font-comfortaa">
                    Error
                  </p>
                  <p className="text-sm text-red-700 font-comfortaa">
                    {locationError}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="space-y-4">
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary" />
                <Input
                  placeholder="Cari masjid atau mushola..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-comfortaa"
                />
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
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
              {filteredMasjidData.length} Tempat Ibadah Ditemukan
            </h2>
          </div>

          <div className="space-y-4">
            {filteredMasjidData.map((masjid) => {
              const nextPrayer = getNextPrayer(masjid.prayerTimes);
              return (
                <Card key={masjid.id} className="border-awqaf-border-light">
                  <CardContent className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-card-foreground font-comfortaa">
                            {masjid.name}
                          </h3>
                          <Badge
                            variant={
                              masjid.type === "masjid" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {masjid.type === "masjid" ? "Masjid" : "Mushola"}
                          </Badge>
                        </div>
                        <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                          {masjid.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium text-card-foreground font-comfortaa">
                            {masjid.rating}
                          </span>
                          <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                            ({masjid.reviewCount})
                          </span>
                        </div>
                        <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                          {formatDistance(masjid.distance)}
                        </p>
                      </div>
                    </div>

                    {/* Prayer Time */}
                    <div className="bg-accent-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-awqaf-primary" />
                          <span className="text-sm font-medium text-card-foreground font-comfortaa">
                            Sholat {nextPrayer.name} berikutnya
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-awqaf-primary font-comfortaa">
                            {nextPrayer.time}
                          </p>
                          <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                            {nextPrayer.minutesLeft} menit lagi
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
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
                          {masjid.isOpen ? "Buka" : "Tutup"}
                        </span>
                      </div>
                    </div>

                    {/* Facilities */}
                    <div>
                      <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-2">
                        Fasilitas:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {masjid.facilities.slice(0, 4).map((facility) => (
                          <Badge
                            key={facility}
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
                        <Car className="w-4 h-4 mr-2" />
                        Navigasi
                      </Button>
                      {masjid.contact?.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            window.open(
                              `tel:${masjid.contact?.phone}`,
                              "_self"
                            );
                          }}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      )}
                      {masjid.contact?.website && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            window.open(masjid.contact?.website, "_blank");
                          }}
                        >
                          <Globe className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredMasjidData.length === 0 && (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                  Tidak ada masjid atau mushola ditemukan
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Coba ubah kata kunci pencarian atau filter
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
