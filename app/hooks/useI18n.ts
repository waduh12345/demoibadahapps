"use client";

import { useState, useEffect } from "react";
import {
  getCurrentLocale,
  setLocale,
  t as translate,
  type LocaleCode,
} from "@/lib/i18n";

export function useI18n() {
  // 1. Set default awal ke 'id' atau string kosong untuk mencegah Hydration Mismatch
  const [locale, setLocaleState] = useState<LocaleCode>("id");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // 2. Ambil locale dari storage setelah komponen di-mount di browser
    setLocaleState(getCurrentLocale());

    // Listen event perubahan bahasa
    const handleLocaleChange = (event: CustomEvent) => {
      setLocaleState(event.detail as LocaleCode);
    };

    window.addEventListener(
      "localeChanged",
      handleLocaleChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "localeChanged",
        handleLocaleChange as EventListener,
      );
    };
  }, []);

  const changeLocale = (newLocale: LocaleCode) => {
    // Simpan ke storage/cookie (fungsi bawaan lib Anda)
    setLocale(newLocale);

    // Update state lokal di komponen ini
    setLocaleState(newLocale);

    // 3. PENTING: Pancarkan event agar komponen LAIN (seperti FeatureList) tahu bahasa berubah
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("localeChanged", { detail: newLocale }),
      );
    }
  };

  // 4. Fungsi 't' yang support Fallback (Default Value)
  const t = (key: string, defaultValue?: string) => {
    // Hindari flicker saat hydration
    if (!isMounted && defaultValue) return defaultValue;

    const result = translate(key, locale);

    // Jika hasil translate sama dengan key (tidak ketemu), gunakan defaultValue
    if (result === key && defaultValue) {
      return defaultValue;
    }

    return result;
  };

  return {
    locale,
    t,
    changeLocale,
  };
}