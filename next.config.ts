import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  transpilePackages: ["three"],
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  // Ignore the background/ directory (separate Next.js project)
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/background/**", "**/node_modules/**"],
    };
    return config;
  },
};

export default nextConfig;
