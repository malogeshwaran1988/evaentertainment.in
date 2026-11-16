import { mediaAbsolute } from "@@/lib/media";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import RelatedServices from "@@/components/services/RelatedServices";
import ServiceFaq from "@@/components/services/ServiceFaq";
import ServiceLead, { ServicePageCta } from "@@/components/services/ServiceLead";
import ServiceSections from "@@/components/services/ServiceSections";
import { plain } from "@@/components/services/RichText";
import { APP_BASE_URL, CONTACT, POSTAL_ADDRESS, SITE_NAME } from "@@/constants/constants";
import { Routes, serviceHref } from "@@/constants/routes";
import type { Service } from "@@/data/services";
import {
  VOICE_OVER_CHILDREN,
  getVoiceOverChild,
  voiceOverChildHref,
} from "@@/data/voice-over-children";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return VOICE_OVER_CHILDREN.map((child) => ({ slug: child.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const child = getVoiceOverChild((await params).slug);
  if (!child) return {};
  return buildPageMetadata({
    title: child.page.seoTitle,
    description: child.page.description,
    url: absoluteUrl(voiceOverChildHref(child.slug)),
    ogImage: child.ogImage,
    ogImageAlt: child.ogImageAlt,
  });
}

export default async function VoiceOverChildPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const child = getVoiceOverChild((await params).slug);
  if (!child) notFound();
  const { page } = child;
  const href = voiceOverChildHref(child.slug);
  const url = absoluteUrl(href);
  const faqs = page.faqs.map((f) => ({ q: f.q, a: f.a }));
  const serviceLike = {
    slug: "voice-over-studio",
    name: child.name,
    image: child.image,
    alt: child.alt,
    fx: child.fx,
  } as unknown as Service;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.seoTitle,
        description: page.description,
        isPartOf: { "@id": `${APP_BASE_URL}/#website` },
        about: { "@id": `${url}#service` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: child.keyword,
        serviceType: page.serviceType,
        description: page.description,
        url,
        image: mediaAbsolute(child.ogImage, APP_BASE_URL),
        availableLanguage: page.languages,
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "City", name: "Mumbai" },
        ],
        provider: {
          "@type": "LocalBusiness",
          "@id": `${APP_BASE_URL}/#organization`,
          name: SITE_NAME,
          url: `${APP_BASE_URL}/`,
          telephone: CONTACT.whatsappDisplay,
          address: POSTAL_ADDRESS,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(Routes.HOME) },
          {
            "@type": "ListItem",
            position: 2,
            name: "Voice Over",
            item: absoluteUrl(serviceHref("voice-over-studio")),
          },
          { "@type": "ListItem", position: 3, name: child.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
        })),
      },
    ],
  };

  return (
    <main id="main-content" tabIndex={-1} className="page-main eva-svc-page">
      <JsonLd id="voice-over-child-jsonld" data={graph} />
      <PageHero
        icon={child.icon}
        title={page.h1}
        subtitle={child.subtitle}
        trail={[
          { label: "Voice Over", href: serviceHref("voice-over-studio") },
          { label: child.name, href },
        ]}
        schema={false}
      />
      <ServiceLead service={serviceLike} page={page} />
      <ServiceSections sections={page.sections} />
      <ServicePageCta page={page} />
      <ServiceFaq faqs={faqs} />
      <RelatedServices current="voice-over-studio" />
    </main>
  );
}
