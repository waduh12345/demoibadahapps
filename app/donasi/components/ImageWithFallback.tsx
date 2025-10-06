"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc || "/placeholder-donation.jpg");
    }
  };

  if (hasError && !fallbackSrc) {
    // If error and no specific fallbackSrc provided, show a mobile-friendly placeholder
    return (
      <div
        className={cn(
          "h-full w-full flex items-center justify-center bg-gradient-to-br from-awqaf-primary/10 to-awqaf-primary/20 text-awqaf-primary",
          className
        )}
      >
        <ImageOff className="w-8 h-8" />
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={cn(className)}
      {...props}
    />
  );
}
