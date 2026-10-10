import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import { SvgIcon } from "@@/components/common/Icons";
import RelatedServices from "@@/components/services/RelatedServices";
import ServiceFaq from "@@/components/services/ServiceFaq";
import ServiceHighlights from "@@/components/services/ServiceHighlights";
import ServiceIntro from "@@/components/services/ServiceIntro";
import { APP_BASE_URL, CONTACT, POSTAL_ADDRESS, SITE_NAME } from "@@/constants/constants";
import { Routes, serviceHref } from "@@/constants/routes";
import { SERVICES, getService, servicePageUrl } from "@@/data/services";
import { buildPageMetadata } from "@@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[service]">): Promise<Metadata> {
  const service = getService((await params).service);
  if (!service) return {};
  return buildPageMetadata({
    ...service.seo,
    url: servicePageUrl(service.slug),
    ogImage: service.ogImage,
    ogImageAlt: service.ogImageAlt,
  });
}

export default async function ServicePage({ params }: PageProps<"/[service]">) {
  const service = getService((await params).service);
  if (!service) notFound();

  const url = servicePageUrl(service.slug);
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.seo.description,
    url,
    image: `${APP_BASE_URL}${service.ogImage}`,
    areaServed: { "@type": "City", name: "Mumbai" },
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      url: `${APP_BASE_URL}/`,
      telephone: CONTACT.whatsappDisplay,
      address: POSTAL_ADDRESS,
    },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="page-main">
      <JsonLd id="service-jsonld" data={serviceSchema} />
      <JsonLd id="faq-jsonld" data={faqSchema} />
      <PageHero
        icon={service.icon}
        svg={service.svg ? <SvgIcon name={service.svg} /> : undefined}
        title={service.h1}
        subtitle={service.subtitle}
        trail={[
          { label: "Services", href: Routes.SERVICES },
          { label: service.name, href: serviceHref(service.slug) },
        ]}
      />
      <ServiceIntro service={service} />
      <ServiceHighlights service={service} />
      <ServiceFaq faqs={service.faqs} />
      <RelatedServices slugs={service.related} />
    </main>
  );
}
