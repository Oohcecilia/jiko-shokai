"use client";

import { useState } from "react";
import Image from "next/image";

interface ThemedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

const FALLBACK_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230a0a0a' width='400' height='300'/%3E%3Crect x='100' y='100' width='200' height='100' rx='8' fill='%231a1a2e' stroke='%2300d4ff' stroke-width='2' stroke-dasharray='8,4'/%3E%3Ctext x='200' y='160' text-anchor='middle' font-family='system-ui,sans-serif' font-size='14' fill='%2300d4ff' font-weight='600'%3EIMAGE%3C/text%3E%3Ctext x='200' y='180' text-anchor='middle' font-family='system-ui,sans-serif' font-size='10' fill='%236b7280'%3ENOT FOUND%3C/text%3E%3C/svg%3E`;

const LOADING_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230a0a0a' width='400' height='300'/%3E%3Ccircle cx='200' cy='150' r='20' stroke='%2300d4ff' stroke-width='3' fill='none' stroke-dasharray='125.6' stroke-dashoffset='0'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 200 150' to='360 200 150' dur='1s' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-dashoffset' from='0' to='125.6' dur='1s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/svg%3E`;

export function ThemedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
  sizes = "100vw",
}: ThemedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      <div
        className={`relative overflow-hidden bg-matte border border-glass-border ${className}`}
        style={fill ? { width: "100%", height: "100%" } : { width, height }}
        aria-label={alt}
      >
        <Image
          src={FALLBACK_SVG}
          alt=""
          width={width}
          height={height}
          fill={fill}
          sizes={sizes}
          className="opacity-60"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-matte border border-glass-border ${className}`}
      style={fill ? { width: "100%", height: "100%" } : { width, height }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={LOADING_SVG}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
      />
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-matte"
          aria-hidden="true"
        >
          <Image
            src={LOADING_SVG}
            alt=""
            width={48}
            height={48}
            unoptimized
            className="opacity-50"
          />
        </div>
      )}
    </div>
  );
}

export function ProfileImage({
  src = "/profile.png",
  alt = "Profile portrait",
  className = "",
  absolute = false,
  ...props
}: {
  src?: string;
  alt?: string;
  className?: string;
  absolute?: boolean;
} & Omit<ThemedImageProps, "src" | "alt" | "className">) {
  if (absolute) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <ThemedImage
          src={src}
          alt={alt}
          fill
          className={`rounded-[2rem] object-contain ${className}`}
          priority
          {...props}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-matte/80 via-matte/5 to-matte/80 opacity-60 pointer-events-none rounded-[2rem]" />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: "100%", height: "100%" }}>
      <ThemedImage
        src={src}
        alt={alt}
        width={320}
        height={400}
        className={`rounded-[2rem] opacity-95 ${className}`}
        priority
        {...props}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-matte/80 via-matte/5 to-matte/80 opacity-60 pointer-events-none rounded-[2rem]" />
      <div className="absolute inset-0 bg-gradient-to-b from-matte/40 via-matte/5 to-matte/40 opacity-30 pointer-events-none rounded-[2rem]" />
    </div>
  );
}

export function ProjectImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <ThemedImage
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={`rounded-xl ${className}`}
    />
  );
}

export function ThumbnailImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <ThemedImage
      src={src}
      alt={alt}
      width={400}
      height={225}
      className={`rounded-lg ${className}`}
    />
  );
}