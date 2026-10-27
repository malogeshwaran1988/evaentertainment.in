import type { Metadata } from "next";
import "@@/styles/tailwind-web.css";
import "@@/styles/globals.scss";
import "@@/styles/legacy/index.css";
import Header from "@@/components/common/Header";
import Footer from "@@/components/common/Footer";
import ContactCtaServer from "@@/components/common/ContactCtaServer";
import GoToTopButton from "@@/components/common/GoToTopButton";
import BodyClass from "@@/components/common/BodyClass";
import CookieConsent from "@@/components/common/CookieConsent";
import { GtmHead, GtmNoscript } from "@@/components/common/GoogleTagManager";
import {
  APP_BASE_URL,
  SITE_NAME,
} from "@@/constants/constants";
import { SERVICE_NAMES } from "@@/data/services";
import { liveSegmentLinks } from "@@/data/dubbing-segments";
import { projectIsPublished } from "@@/data/projects";
import { getProjects } from "@@/lib/projects-store";
import { HOME_OG_IMAGE, HOME_OG_IMAGE_ALT, HOME_PAGE_URL, HOME_SEO } from "@@/data/home";

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
        alt: HOME_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    images: [{ url: HOME_OG_IMAGE, alt: HOME_OG_IMAGE_ALT }],
  },
};

/** Root layout for all public `(web)` routes — Glory chrome and a single Header mount. */
export default async function WebLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let segmentLinks: { label: string; href: string }[] = [];
  try {
    const published = (await getProjects()).filter(projectIsPublished);
    segmentLinks = liveSegmentLinks(published).map(({ label, href }) => ({ label, href }));
  } catch {
    segmentLinks = [];
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GtmHead />
      </head>
      <body className="is-loaded">
        <GtmNoscript />
        <div className="flex min-h-screen flex-col">
          <BodyClass />
          <a className="eva-skip-link" href="#main-content">
            Skip to main content
          </a>
          <Header serviceNames={SERVICE_NAMES} segmentLinks={segmentLinks} />
          <div className="flex-1">{children}</div>
          <ContactCtaServer />
          <GoToTopButton />
          <Footer />
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}
