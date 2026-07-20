import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { Preloader } from "@/components/providers/Preloader";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { BackgroundWrapper } from "@/components/layout/BackgroundWrapper";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SITE } from "@/lib/data";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.role}`,
  description:
    "A cinematic, award-inspired developer portfolio: full stack engineering, immersive 3D interfaces, and product craft.",
  keywords: [
    "full stack developer",
    "portfolio",
    "Next.js",
    "React Three Fiber",
    "web developer",
  ],
  openGraph: {
    title: `${SITE.name} — ${SITE.role}`,
    description:
      "Building digital experiences that feel alive — full stack development, 3D interfaces, and product design.",
    type: "website",
    images: [
      {
        url: "/profile.png",
        width: 512,
        height: 512,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.role}`,
    description:
      "Building digital experiences that feel alive — full stack development, 3D interfaces, and product design.",
    images: "/profile.png",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  metadataBase: new URL("https://example.com"),
};

export const viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="relative min-h-screen bg-matte font-body text-white antialiased">
        <BackgroundWrapper />
        <CustomCursor />
        <Preloader />
        <SmoothScrollProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
