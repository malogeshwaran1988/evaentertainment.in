import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import JsonLd from "@@/components/common/JsonLd";
import Link from "@@/components/common/NavLink";
import PageHero from "@@/components/common/PageHero";
import { SvgIcon } from "@@/components/common/Icons";
import { PosterPlaceholder } from "@@/components/projects/ProjectPoster";
import { SITE_NAME } from "@@/constants/constants";
import { Routes, serviceHref } from "@@/constants/routes";
import { PROJECTS_OG_IMAGE, projectIsPublished } from "@@/data/projects";
import { getProjects } from "@@/lib/projects-store";
import { LANGUAGE_HUB_MIN_PROJECTS, LANGUAGE_HUB_PREFIX, languagePairs } from "@@/lib/project-links";
import { projectHref, projectPosterAlt } from "@@/lib/project-seo";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

/** Short, language-specific intro so each hub says something different. */
const INTRO: Record<string, string> = {
  Telugu:
    "Telugu cinema travels well beyond Andhra Pradesh and Telangana, and a natural Hindi version opens it to audiences across North India and on national OTT platforms. Our team adapts the dialogue for lip sync, keeps the punch of mass dialogues and comedy timing, and casts Hindi voices that match each character's age and energy.",
  Tamil:
    "Tamil films are known for sharp writing and strong performances. When we dub Tamil titles into Hindi we rewrite lines so they sit naturally on the actors' lips, keep cultural references understandable for Hindi viewers, and record songs and crowd scenes so the dubbed version feels as alive as the original.",
  Malayalam:
    "Malayalam cinema is often quieter and more realistic, so the dub has to be subtle. We focus on restrained, natural Hindi performances, careful script adaptation and clean mixes that preserve the original sound design for streaming and broadcast releases.",
  Kannada:
    "Kannada films are reaching national audiences faster than ever. We handle script translation, lip-sync adaptation, Hindi voice casting, recording and the final mix, delivering broadcast and OTT ready masters.",
  English:
    "Hollywood and international English content needs Hindi dubbing that sounds local, not translated. We adapt idioms and jokes for Hindi audiences, match the timing of fast dialogue, and deliver mixes to platform specifications.",
  Hindi:
    "Hindi films and series dubbed into South Indian languages reach audiences in their mother tongue. Our native-speaker writers and voice artists adapt each line for lip sync and cultural fit.",
};

async function getPair(slug: string) {
  const projects = (await getProjects()).filter(projectIsPublished);
  return languagePairs(projects).find((p) => p.slug === slug) ?? null;
}

export async function generateStaticParams() {
  const projects = (await getProjects()).filter(projectIsPublished);
  return languagePairs(projects).map((p) => ({ pair: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const pair = await getPair((await params).pair);
  if (!pair) return {};
  return buildPageMetadata({
    title: `${pair.from} to ${pair.to} Dubbing Projects | ${SITE_NAME}`,
    description: `${pair.projects.length} ${pair.from} to ${pair.to} dubbing projects by ${SITE_NAME}, a lip-sync dubbing studio in Andheri, Mumbai. See the films and start your project.`,
    url: absoluteUrl(`${LANGUAGE_HUB_PREFIX}/${pair.slug}`),
    ogImage: PROJECTS_OG_IMAGE,
    ogImageAlt: `${pair.from} to ${pair.to} dubbing projects`,
    noindex: pair.projects.length < LANGUAGE_HUB_MIN_PROJECTS,
  });
}

export default async function LanguageHubPage({ params }: { params: Promise<{ pair: string }> }) {
  const slug = (await params).pair;
  const pair = await getPair(slug);
  if (!pair) notFound();
  const href = `${LANGUAGE_HUB_PREFIX}/${pair.slug}`;
  const heading = `${pair.from} to ${pair.to} Dubbing`;

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: heading,
    url: absoluteUrl(href),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: pair.projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(projectHref(p.slug)),
        name: p.title,
      })),
    },
  };

  return (
    <main className="page-main">
      <JsonLd id="hub-jsonld" data={listSchema} />
      <PageHero
        svg={<SvgIcon name="film" />}
        title={heading}
        trail={[
          { label: "Our Projects", href: Routes.PROJECTS },
          { label: heading, href },
        ]}
      />
      <section className="block block--darkbg">
        <div className="container">
          <p className="p--lg">{INTRO[pair.from] ?? INTRO.English}</p>
          <p>
            {SITE_NAME} has dubbed {pair.projects.length} {pair.from} title
            {pair.projects.length === 1 ? "" : "s"} into {pair.to}. Learn more about our{" "}
            <Link href={serviceHref("dubbing-studio-mumbai")}>lip-sync dubbing studio in Mumbai</Link>,{" "}
            <Link href={serviceHref("translation-services-mumbai")}>script translation</Link> and{" "}
            <Link href={serviceHref("5-1-mixing-studio-mumbai")}>5.1 mixing</Link>, or{" "}
            <Link href={Routes.CONTACT}>contact us</Link> for a quote.
          </p>
          <ul className="eva-projects-grid">
            {pair.projects.map((p) => (
              <li className="eva-project-card" key={p.id}>
                <div className="eva-project-poster">
                  {p.poster ? (
                    <Image
                      src={p.poster}
                      alt={projectPosterAlt(p)}
                      fill
                      sizes="(min-width: 1200px) 16vw, (min-width: 992px) 23vw, (min-width: 768px) 30vw, 46vw"
                    />
                  ) : (
                    <PosterPlaceholder title={p.title} />
                  )}
                </div>
                <h2 className="eva-project-title">
                  <Link className="eva-project-open" href={projectHref(p.slug)}>
                    {p.title}
                  </Link>
                </h2>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
