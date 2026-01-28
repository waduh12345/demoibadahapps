"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface AppLoaderProps {
  onLoadComplete?: () => void;
  minLoadTime?: number;
}

export default function AppLoader({
  onLoadComplete,
  minLoadTime = 2000,
}: AppLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Memuat aplikasi...");

  useEffect(() => {
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        if (progress < 30) return "Memuat aplikasi...";
        if (progress < 60) return "Menyiapkan fitur...";
        if (progress < 90) return "Hampir selesai...";
        return "Siap digunakan!";
      });
    }, 500);

    const minTimePromise = new Promise((resolve) =>
      setTimeout(resolve, minLoadTime),
    );

    Promise.all([
      new Promise((resolve) => {
        const checkProgress = () => {
          if (progress >= 100) resolve(true);
          else setTimeout(checkProgress, 100);
        };
        checkProgress();
      }),
      minTimePromise,
    ]).then(() => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      setTimeout(() => {
        setIsVisible(false);
        onLoadComplete?.();
      }, 500);
    });

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [onLoadComplete, minLoadTime, progress]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-accent-50 to-accent-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--accent)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 max-w-sm mx-auto animate-fade-in-up">
        {/* WRAPPER 1: Animasi Masuk (Scale In) */}
        <div className="relative mb-6 animate-scale-in">
          {/* WRAPPER 2: Animasi Naik Turun (Float) - Dipisah agar tidak konflik */}
          <div className="relative animate-float">
            {/* Logo Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-200 to-accent-300 rounded-full blur-xl opacity-30 scale-110 animate-pulse-glow"></div>

            {/* Logo Container */}
            <div className="relative w-24 h-24 bg-white rounded-full shadow-lg border-4 border-accent-100 flex items-center justify-center z-10">
              <Image
                src="/ibadahapp-logo.png"
                alt="IbadahApp Logo"
                width={64}
                height={64}
                className="w-16 h-16 object-contain"
                priority
              />
            </div>

            {/* Rotating Ring (Menempel di Wrapper 2, jadi ikut naik turun & berputar sendiri) */}
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-accent-500 rounded-full animate-rotate-slow z-20"></div>
          </div>
        </div>

        {/* App Name */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-awqaf-primary font-comfortaa mb-2">
            IbadahApp
          </h1>
          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
            Aplikasi Ibadah Muslim
          </p>
        </div>

        {/* Loading Progress */}
        <div className="w-full max-w-xs mb-6">
          <div className="relative w-full h-2 bg-accent-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-500 to-accent-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
              {loadingText}
            </span>
            <span className="text-xs font-semibold text-awqaf-primary font-comfortaa">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex space-x-2 mb-6">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-accent-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: "1s",
              }}
            ></div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-awqaf-foreground-tertiary font-comfortaa">
            Versi 1.0.0
          </p>
          <p className="text-xs text-awqaf-foreground-tertiary font-comfortaa mt-1">
            Dibuat dengan ❤️ untuk umat Muslim
          </p>
        </div>
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-br from-accent-50 to-accent-100 transition-opacity duration-500 ${!isVisible ? "opacity-0" : "opacity-100"}`}
      ></div>
    </div>
  );
}