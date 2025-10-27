import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //cloudinary setup
  // domains is deprecated(image and then domains), use remotePatterns instead
  // domains: ["images.unsplash.com", "cdn.pixabay.com", "example.com"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      { protocol: "https", hostname: "*.unsplash.com" },
    ],
  },
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
