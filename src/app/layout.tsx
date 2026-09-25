import type { Metadata } from "next";
import "@@/styles/globals.scss";
import {
  APP_BASE_URL,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_NAME,
} from "@@/constants/constants";
import { HOME_OG_IMAGE, HOME_PAGE_URL, HOME_SEO } from "@@/data/home";

export const metadata: Metadata = {
  metadataBase: new URL(APP_BASE_URL),
  title: {
    absolute: HOME_SEO.title,
  },
  description: HOME_SEO.description,
  alternates: {
    canonical: HOME_PAGE_URL,
  },
  icons: { icon: "/favicon.ico" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    url: HOME_PAGE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: HOME_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    images: [HOME_OG_IMAGE],
  },
};

/** Stylesheets for Glory chrome — vendors actually used by App Router pages. */
const STYLESHEETS = [
  "/css/vendor/bootstrap.min.css",
  "/css/vendor/animate.min.css",
  "/css/vendor/slick.css",
  "/fonts/recording/style.css",
  "https://use.fontawesome.com/releases/v5.4.1/css/all.css",
  "https://fonts.googleapis.com/css?family=Raleway:300,400,500,600,700,800,900&display=swap",
  "/css/custom.css",
  "/css/style.css",
] as const;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {STYLESHEETS.map((href) =>
          href.includes("fontawesome") ? (
            <link
              key={href}
              rel="stylesheet"
              href={href}
              integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz"
              crossOrigin="anonymous"
            />
          ) : (
            <link key={href} rel="stylesheet" href={href} />
          ),
        )}
      </head>
      <body className="is-loaded">{children}</body>
    </html>
  );
}
