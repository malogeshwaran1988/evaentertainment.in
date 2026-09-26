import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Required with multiple root layouts ((web) and (admin)).
    globalNotFound: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.evaentertainment.in" }],
        destination: "https://evaentertainment.in/:path*",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-conditions",
        permanent: true,
      },
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
      ...["/login", "/admin", "/admin/:path*"].map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
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
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "geolocation=(), microphone=(), camera=(), payment=(), fullscreen=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
