import type { NextConfig } from "next";
import { LEGACY_REDIRECTS } from "./src/constants/routes";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy. 'unsafe-inline' for scripts is required because pages are statically
 * prerendered (no per-request nonce) and Next.js/GTM/JSON-LD use inline scripts; the host
 * allowlist, object-src/base-uri/form-action/frame-ancestors still block the common attacks.
 * 'wasm-unsafe-eval' is for the admin's in-browser AVIF encoder (@jsquash).
 */
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://*.google-analytics.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: data:",
  "connect-src 'self' blob: data: https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://challenges.cloudflare.com",
  "frame-src https://www.google.com https://www.googletagmanager.com https://challenges.cloudflare.com https://www.youtube-nocookie.com https://player.vimeo.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,

  experimental: {
    // Required with multiple root layouts ((web) and (admin)).
    globalNotFound: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    // Uploaded posters carry ?v=<version>; allow the optimizer to resize them for cards.
    localPatterns: [{ pathname: "/images/our-projects/**" }, { pathname: "/**", search: "" }],
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.evaentertainment.in" }],
        destination: "https://evaentertainment.in/:path*",
        permanent: true,
      },
      ...LEGACY_REDIRECTS.map(({ from, to }) => ({
        source: from,
        destination: to,
        permanent: true,
      })),
    ];
  },

  async headers() {
    return [
      ...(process.env.NODE_ENV === "development"
        ? []
        : [
            {
              source: "/_next/static/:path*",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ],
            },
          ]),
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "text/xml; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=300",
          },
        ],
      },
      ...["/login", "/admin", "/admin/:path*", "/thank-you"].map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow, noarchive" }],
      })),
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "Content-Security-Policy", value: CSP },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          // Overrides Vercel's default `*` so other sites can't read pages/API responses cross-origin.
          { key: "Access-Control-Allow-Origin", value: "https://evaentertainment.in" },
          {
            key: "Permissions-Policy",
            value:
              "geolocation=(), microphone=(), camera=(), payment=(), usb=(), browsing-topics=(), fullscreen=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
