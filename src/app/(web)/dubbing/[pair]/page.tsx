import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BrandMark from "@@/components/common/BrandMark";
import JsonLd from "@@/components/common/JsonLd";
import Link from "@@/components/common/NavLink";
import PageHero from "@@/components/common/PageHero";
import { SvgIcon } from "@@/components/common/Icons";
import PosterBatchGrid from "@@/components/projects/PosterBatchGrid";
import LanguageHubLinks from "@@/components/projects/LanguageHubLinks";
import { CONTACT, SITE_NAME } from "@@/constants/constants";
import { Routes, serviceHref } from "@@/constants/routes";
import {
  pairDescription,
  pairFacts,
  pairFaqs,
  pairHeading,
  pairImage,
  pairIntro,
  pairQuote,
  pairSections,
  pairSteps,
  pairStudio,
  pairTitle,
  pairWhy,
} from "@@/data/dubbing-pairs";
import { PROJECTS_OG_IMAGE, projectIsPublished } from "@@/data/projects";
import { getProjects } from "@@/lib/projects-store";
import { LANGUAGE_HUB_PREFIX, languagePairs } from "@@/lib/project-links";
import { projectHref, projectPosterAlt } from "@@/lib/project-seo";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";
import "@@/styles/routes/dubbing.scss";

export const revalidate = 3600;
export const dynamicParams = true;

async function getPairs() {
  return languagePairs((await getProjects()).filter(projectIsPublished));
}

export async function generateStaticParams() {
  return (await getPairs()).map((p) => ({ pair: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const slug = (await params).pair;
  const pair = (await getPairs()).find((p) => p.slug === slug);
  if (!pair) return {};
  return buildPageMetadata({
    title: pairTitle(pair),
    description: pairDescription(pair),
    url: absoluteUrl(`${LANGUAGE_HUB_PREFIX}/${pair.slug}`),
    ogImage: PROJECTS_OG_IMAGE,
    ogImageAlt: `${pair.from} to ${pair.to} dubbing projects by ${SITE_NAME}`,
  });
}

export default async function LanguageHubPage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const slug = (await params).pair;
  const pairs = await getPairs();
  const pair = pairs.find((p) => p.slug === slug);
  if (!pair) notFound();

  const href = `${LANGUAGE_HUB_PREFIX}/${pair.slug}`;
  const heading = pairHeading(pair);
  const h = pairSections(pair);
  const image = pairImage(pair);
  const faqs = pairFaqs(pair);
  const hours = pair.projects.reduce((sum, p) => sum + (p.audioHours ?? 0), 0);
  const languages = new Set(pairs.flatMap((p) => [p.from, p.to])).size;
  const related = pairs.filter(
    (p) => p.slug !== pair.slug && (p.from === pair.from || p.to === pair.to),
  );
  const others = related.length
    ? related
    : pairs.filter((p) => p.slug !== pair.slug);

  const stats = [
    {
      value: String(pair.projects.length),
      label:
        pair.projects.length === 1
          ? `${pair.from} to ${pair.to} title`
          : `${pair.from} to ${pair.to} titles`,
    },
    ...(hours > 0
      ? [{ value: String(Math.round(hours)), label: "Hours of audio dubbed" }]
      : []),
    { value: String(pairs.length), label: "Language pairs dubbed" },
    { value: String(languages), label: "Languages in our projects" },
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: heading,
      serviceType: `${pair.from} to ${pair.to} dubbing`,
      url: absoluteUrl(href),
      description: pairDescription(pair),
      areaServed: "IN",
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteUrl(Routes.HOME),
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: h.projects,
        itemListElement: pair.projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(projectHref(p.slug)),
          name: p.title,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="page-main eva-svc-page eva-pair-page"
    >
      <JsonLd id="pair-jsonld" data={schema} />
      <PageHero
        svg={<SvgIcon name="film" />}
        title={heading}
        subtitle={`${pair.from} films and series dubbed into natural, lip-synced ${pair.to}.`}
        trail={[
          { label: "Dubbing by Language", href: LANGUAGE_HUB_PREFIX },
          { label: heading, href },
        ]}
      />

      <section
        className="block eva-svc-section eva-pair-intro"
        aria-label="Introduction"
      >
        <div className="container">
          <div className="eva-svc-split">
            <div className="eva-svc-copy">
              <p className="eva-pair-lead">{pairIntro(pair)}</p>
              <p>{pairFacts(pair)}</p>
              <p>
                Learn more about our{" "}
                <Link href={serviceHref("dubbing-studio")}>
                  lip-sync dubbing studio in Mumbai
                </Link>
                ,{" "}
                <Link href={serviceHref("translation-services")}>
                  script translation
                </Link>{" "}
                and{" "}
                <Link href={serviceHref("5-1-mixing-studio")}>5.1 mixing</Link>.
              </p>
            </div>
            <figure className="eva-svc-figure eva-svc-split-media">
              <div className="eva-svc-photo" style={{ aspectRatio: "4 / 3" }}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 992px) 45vw, 100vw"
                  priority
                />
                <BrandMark />
              </div>
            </figure>
          </div>
        </div>
        <div className="container">
          <ul
            className="eva-pair-stats"
            aria-label={`${pair.from} to ${pair.to} dubbing in numbers`}
          >
            {stats.map((s) => (
              <li key={s.label}>
                <span className="eva-pair-stat-value">{s.value}</span>
                <span className="eva-pair-stat-label">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="block block--darkbg eva-svc-section"
        aria-labelledby="pair-projects"
      >
        <div className="container">
          <h2 id="pair-projects" className="h--md">
            {h.projects}
          </h2>
          <PosterBatchGrid
            titleAs="h3"
            items={pair.projects.map((p) => ({
              id: p.id,
              href: projectHref(p.slug),
              title: p.title,
              ...(p.poster ? { poster: p.poster } : {}),
              alt: projectPosterAlt(p),
            }))}
          />
        </div>
      </section>

      <section className="block eva-svc-section" aria-labelledby="pair-process">
        <div className="container">
          <h2 id="pair-process" className="h--md">
            {h.process}
          </h2>
          <ol className="eva-pair-steps">
            {pairSteps(pair).map((s, i) => (
              <li key={s.title}>
                <span className="eva-svc-step" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="block block--darkbg eva-svc-section"
        aria-labelledby="pair-studio"
      >
        <div className="container">
          <div className="eva-pair-two">
            <div>
              <h2 id="pair-studio" className="h--md">
                {h.studio}
              </h2>
              {pairStudio(pair).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div>
              <h2 id="pair-why" className="h--md">
                {h.why}
              </h2>
              <ul className="eva-pair-why">
                {pairWhy(pair).map((w) => (
                  <li key={w.title}>
                    <h3>{w.title}</h3>
                    <p>{w.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {others.length ? (
        <section className="block eva-svc-section eva-pair-related">
          <div className="container">
            <LanguageHubLinks
              pairs={others}
              heading={h.related}
              id="pair-related"
              onDark={false}
            />
          </div>
        </section>
      ) : null}

      <section className="block eva-service-faq" aria-labelledby="pair-faq">
        <div className="container">
          <h2 id="pair-faq" className="text-center">
            {h.faq}
          </h2>
          <div className="eva-faq-list">
            {faqs.map((f, i) => (
              <details key={f.q} className="eva-faq-item" open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        className="block block--darkbg eva-svc-section"
        aria-labelledby="pair-quote"
      >
        <div className="container">
          <div className="eva-svc-cta-box">
            <h2 id="pair-quote" className="eva-svc-title">
              {h.quote}
            </h2>
            <p>{pairQuote(pair)}</p>
            <div className="eva-service-actions">
              <Link className="btn" href={Routes.CONTACT}>
                <span>Request a quote</span>
              </Link>
              <a
                className="btn btn--border"
                href={`mailto:${CONTACT.bookingEmail}`}
              >
                <span>Email us</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
