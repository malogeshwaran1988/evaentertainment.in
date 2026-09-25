import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumbs from "@@/components/common/Breadcrumbs";
import {
  ABOUT_CONTENT,
  ABOUT_OG_IMAGE,
  ABOUT_PAGE_URL,
  ABOUT_SEO,
} from "@@/data/about";
import { DEFAULT_OG_IMAGE_ALT, SITE_NAME } from "@@/constants/constants";

export const metadata: Metadata = {
  title: { absolute: ABOUT_SEO.title },
  description: ABOUT_SEO.description,
  alternates: { canonical: ABOUT_PAGE_URL },
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
    title: ABOUT_SEO.title,
    description: ABOUT_SEO.description,
    url: ABOUT_PAGE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: ABOUT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: ABOUT_SEO.title,
    description: ABOUT_SEO.description,
    images: [ABOUT_OG_IMAGE],
  },
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: ABOUT_SEO.title,
    description: ABOUT_SEO.description,
    url: ABOUT_PAGE_URL,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://evaentertainment.in/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: ABOUT_PAGE_URL,
        },
      ],
    },
  };

  return (
    <main className="page-main">
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="block block--title block--darkbg">
        <div className="container">
          <div className="text-center">
            <h1>
              <i className="icon icon-folded-newspaper" aria-hidden="true" />
              {ABOUT_CONTENT.pageTitle}
            </h1>
            <Breadcrumbs current="About" />
          </div>
        </div>
      </div>

      <section className="block">
        <div className="container">
          <div className="title-wrap text-center">
            <h2 className="h--lg">
              <i className="icon icon-promotion-1" aria-hidden="true" />
              {ABOUT_CONTENT.sectionTitle}
            </h2>
            <p>{ABOUT_CONTENT.sectionIntro}</p>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <h2 className="text-center">{ABOUT_CONTENT.missionTitle}</h2>
          <div className="row">
            <div className="col-md-5 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ABOUT_CONTENT.missionImage}
                className="img-responsive"
                alt={ABOUT_CONTENT.missionImageAlt}
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <div className="divider visible-xs visible-sm" />
            <div className="col-md-7">
              {ABOUT_CONTENT.missionParagraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="divider" />
          <h3>{ABOUT_CONTENT.facilitiesTitle}</h3>
          {ABOUT_CONTENT.facilitiesParagraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </section>
    </main>
  );
}
