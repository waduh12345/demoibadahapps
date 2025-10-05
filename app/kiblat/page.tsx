"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  MapPin,
  Navigation,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Globe,
} from "lucide-react";
import Link from "next/link";

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface QiblaData {
  direction: number;
  distance: number;
  bearing: number;
}

// Kaaba coordinates (Mecca)
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export default function QiblaPage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");
  const [isCompassSupported, setIsCompassSupported] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);

  // Check if device supports compass/magnetometer
  useEffect(() => {
    if ("DeviceOrientationEvent" in window) {
      setIsCompassSupported(true);
    }
  }, []);

  // Calculate Qibla direction
  const calculateQibla = (lat: number, lng: number): QiblaData => {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const toDegrees = (radians: number) => radians * (180 / Math.PI);

    const lat1 = toRadians(lat);
    const lng1 = toRadians(lng);
    const lat2 = toRadians(KAABA_LAT);
    const lng2 = toRadians(KAABA_LNG);

    const dLng = lng2 - lng1;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    let bearing = toDegrees(Math.atan2(y, x));
    bearing = (bearing + 360) % 360;

    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in kilometers
    const dLat = lat2 - lat1;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return {
      direction: bearing,
      distance: distance,
      bearing: bearing,
    };
  };

  // Get user location
  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

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

        setLocation({
          latitude,
          longitude,
          city: data.city || data.locality || "Lokasi tidak diketahui",
          country: data.countryName || "Negara tidak diketahui",
        });
      } catch {
        setLocation({
          latitude,
          longitude,
          city: "Lokasi tidak diketahui",
          country: "Negara tidak diketahui",
        });
      }

      // Calculate Qibla direction
      const qibla = calculateQibla(latitude, longitude);
      setQiblaData(qibla);

      setPermissionStatus("granted");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mendapatkan lokasi";
      setError(errorMessage);
      setPermissionStatus("denied");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle compass orientation
  useEffect(() => {
    if (!isCompassSupported) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setCompassHeading(event.alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () =>
      window.removeEventListener("deviceorientation", handleOrientation);
  }, [isCompassSupported]);

  // Update compass rotation
  useEffect(() => {
    if (compassRef.current && qiblaData && compassHeading !== null) {
      const rotation = compassHeading - qiblaData.direction;
      compassRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }, [compassHeading, qiblaData]);

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} meter`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const getDirectionText = (direction: number): string => {
    const directions = [
      "Utara",
      "Timur Laut",
      "Timur",
      "Tenggara",
      "Selatan",
      "Barat Daya",
      "Barat",
      "Barat Laut",
    ];
    const index = Math.round(direction / 45) % 8;
    return directions[index];
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
                Arah Kiblat
              </h1>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                onClick={getCurrentLocation}
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
                {location ? (
                  <div>
                    <p className="font-medium text-card-foreground font-comfortaa">
                      {location.city}, {location.country}
                    </p>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {location.latitude.toFixed(4)},{" "}
                      {location.longitude.toFixed(4)}
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
              {permissionStatus === "granted" && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {permissionStatus === "denied" && (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800 font-comfortaa">
                    Error
                  </p>
                  <p className="text-sm text-red-700 font-comfortaa">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Qibla Direction */}
        {qiblaData && (
          <Card className="border-awqaf-border-light">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-comfortaa flex items-center gap-2">
                <Compass className="w-5 h-5 text-awqaf-primary" />
                Arah Kiblat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Compass */}
              <div className="relative w-48 h-48 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-awqaf-border-light bg-white shadow-lg">
                  {/* Compass background */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-accent-50 to-accent-100">
                    {/* Direction markers */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(
                      (angle, index) => {
                        const directions = [
                          "N",
                          "NE",
                          "E",
                          "SE",
                          "S",
                          "SW",
                          "W",
                          "NW",
                        ];
                        const x =
                          50 + 40 * Math.cos(((angle - 90) * Math.PI) / 180);
                        const y =
                          50 + 40 * Math.sin(((angle - 90) * Math.PI) / 180);
                        return (
                          <div
                            key={angle}
                            className="absolute text-xs font-bold text-awqaf-foreground-secondary"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            {directions[index]}
                          </div>
                        );
                      }
                    )}

                    {/* Qibla direction indicator */}
                    <div
                      ref={compassRef}
                      className="absolute top-1/2 left-1/2 w-1 h-16 bg-awqaf-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 origin-bottom transition-transform duration-300"
                    >
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-awqaf-primary"></div>
                    </div>

                    {/* Center dot */}
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-awqaf-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>

              {/* Qibla Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    Arah
                  </p>
                  <p className="text-lg font-bold text-awqaf-primary font-comfortaa">
                    {qiblaData.direction.toFixed(1)}°
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {getDirectionText(qiblaData.direction)}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    Jarak ke Kaaba
                  </p>
                  <p className="text-lg font-bold text-awqaf-primary font-comfortaa">
                    {formatDistance(qiblaData.distance)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compass Support Info */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-awqaf-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-card-foreground font-comfortaa">
                  Kompas Digital
                </p>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {isCompassSupported
                    ? "Kompas digital tersedia untuk arah yang lebih akurat"
                    : "Kompas digital tidak tersedia di perangkat ini"}
                </p>
              </div>
              {isCompassSupported ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-awqaf-border-light">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-comfortaa">
              Cara Menggunakan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-awqaf-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                Tekan tombol refresh untuk mendapatkan lokasi Anda
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-awqaf-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                Arahkan perangkat ke arah yang ditunjukkan oleh panah merah
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-awqaf-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                Untuk akurasi maksimal, gunakan kompas digital jika tersedia
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
