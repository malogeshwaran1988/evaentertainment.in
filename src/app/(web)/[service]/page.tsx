import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import { SvgIcon } from "@@/components/common/Icons";
import RelatedServices from "@@/components/services/RelatedServices";
import ServiceFaq from "@@/components/services/ServiceFaq";
import ServiceLead, { ServicePageCta } from "@@/components/services/ServiceLead";
import ServiceSections from "@@/components/services/ServiceSections";
import ServicePosterStrip from "@@/components/services/ServicePosterStrip";
import LanguageHubLinks from "@@/components/projects/LanguageHubLinks";
import { projectIsPublished } from "@@/data/projects";
import { getProjects } from "@@/lib/projects-store";
import { languagePairs, pairsWithProjects } from "@@/lib/project-links";
import { plain } from "@@/components/services/RichText";
import { APP_BASE_URL, CONTACT, POSTAL_ADDRESS, SITE_NAME } from "@@/constants/constants";
import { serviceHref } from "@@/constants/routes";
import { SERVICE_PAGES } from "@@/data/service-pages";
import { SERVICES, getService, servicePageUrl } from "@@/data/services";
import { buildPageMetadata } from "@@/lib/seo";

export const dynamicParams = false;
/** Daily, so the {years} experience figure stays current. */
export const revalidate = 86400;

/** Dubbing pages that link every language hub (internal links to /dubbing/<pair>). */
const HUB_LINK_PAGES = new Set<string>([
  "dubbing-studio",
  "hollywood-dubbing-indian-languages",
  "pan-india-film-dubbing",
  "regional-film-dubbing",
]);

async function hubPairs() {
  try {
    return pairsWithProjects(
      languagePairs((await getProjects()).filter(projectIsPublished)),
    );
  } catch {
    return [];
  }
}

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[service]">): Promise<Metadata> {
  const service = getService((await params).service);
  if (!service) return {};
  const page = SERVICE_PAGES[service.slug];
  return buildPageMetadata({
    ...service.seo,
    ...(page ? { title: page.seoTitle, description: page.description } : {}),
    url: servicePageUrl(service.slug),
    ogImage: service.ogImage,
    ogImageAlt: service.ogImageAlt,
  });
}

export default async function ServicePage({ params }: PageProps<"/[service]">) {
  const service = getService((await params).service);
  if (!service) notFound();
  const page = SERVICE_PAGES[service.slug];
  if (!page) notFound();

  const pairs = HUB_LINK_PAGES.has(service.slug) ? await hubPairs() : [];
  const url = servicePageUrl(service.slug);
  const faqs = page.faqs.map((f) => ({ q: f.q, a: f.a }));
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.name,
    serviceType: page.serviceType,
    description: page.description,
    url,
    image: `${APP_BASE_URL}${service.ogImage}`,
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "City", name: "Mumbai" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "United Arab Emirates" },
    ],
    provider: {
      "@type": "LocalBusiness",
      "@id": `${APP_BASE_URL}/#organization`,
      name: SITE_NAME,
      url: `${APP_BASE_URL}/`,
      telephone: CONTACT.whatsappDisplay,
      address: POSTAL_ADDRESS,
    },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
    })),
  };

  return (
    <main id="main-content" tabIndex={-1} className="page-main eva-svc-page">
      <JsonLd id="service-jsonld" data={serviceSchema} />
      <JsonLd id="faq-jsonld" data={faqSchema} />
      <PageHero
        icon={service.icon}
        svg={service.svg ? <SvgIcon name={service.svg} /> : undefined}
        title={page.h1}
        subtitle={service.subtitle}
        trail={[{ label: service.name, href: serviceHref(service.slug) }]}
      />
      <ServiceLead service={service} page={page} />
      <ServiceSections sections={page.sections} />
      <ServicePosterStrip slugs={page.posterStrip} />
      <LanguageHubLinks pairs={pairs} heading="Our dubbing work by language pair" section />
      <ServicePageCta page={page} />
      <ServiceFaq faqs={faqs} />
      <RelatedServices current={service.slug} />
    </main>
  );
}
