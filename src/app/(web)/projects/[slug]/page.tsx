import type { Metadata } from "next";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "@@/components/common/JsonLd";
import PageHero from "@@/components/common/PageHero";
import Link from "@@/components/common/NavLink";
import { SvgIcon } from "@@/components/common/Icons";
import { PosterPlaceholder } from "@@/components/projects/ProjectPoster";
import ProjectAdjacentNav from "@@/components/projects/ProjectAdjacentNav";
import ProjectExplore from "@@/components/projects/ProjectExplore";
import { languageHubHref } from "@@/lib/project-links";
import ProjectTrailer from "@@/components/projects/ProjectTrailer";
import ProjectClientBadge from "@@/components/clients/ProjectClientBadge";
import { toProjectClient } from "@@/data/clients";
import { getClients } from "@@/lib/clients-store";
import { youtubeId } from "@@/lib/project-content";
import { APP_BASE_URL, SITE_NAME } from "@@/constants/constants";
import { Routes, serviceHref } from "@@/constants/routes";
import { SERVICES } from "@@/data/services";
import {
  PROJECT_YEAR_ONGOING,
  PROJECTS_OG_IMAGE,
  PROJECTS_PAGE_URL,
  projectIsPublished,
  type Project,
} from "@@/data/projects";
import { getProjectByPreviousSlug, getProjectBySlug, getProjects } from "@@/lib/projects-store";
import {
  EVA_ORG_ID,
  evaOrganizationLd,
  projectAbsolutePosterUrl,
  projectHref,
  projectLanguageChip,
  projectPosterAlt,
  projectSeoDescription,
  projectSeoTitle,
  projectYearChip,
} from "@@/lib/project-seo";
import { formatAudioHours } from "@@/lib/project-stats";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";

/** Allow admin-created slugs after deploy; generateStaticParams still prebuilds known ones. */
export const dynamicParams = true;
/** ISR: cached at the edge, refreshed hourly and on every admin save (revalidatePath). */
export const revalidate = 3600;

/**
 * Stable share-card URL: the version follows the poster file itself (its upload ?v= or a hash of
 * its path), not updatedAt, so text edits and rebuilds never mint new /og URLs for crawlers.
 */
const ogImageFor = (p: Project) => `/og/projects/${p.slug}?v=${posterVersion(p.poster ?? "")}`;

function posterVersion(poster: string) {
  const v = poster.split("?v=")[1];
  if (v && /^[a-z0-9]+$/i.test(v)) return v;
  let h = 0;
  for (let i = 0; i < poster.length; i++) h = (Math.imul(31, h) + poster.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** Tiny optimizer rendition for the blurred hero backdrop (the full poster is loaded once below). */
const heroBackdrop = (poster: string | undefined) =>
  poster ? `/_next/image?url=${encodeURIComponent(poster)}&w=128&q=75` : undefined;

export async function generateStaticParams() {
  const projects = (await getProjects()).filter(projectIsPublished);
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  if (!project || !projectIsPublished(project)) return {};
  const ogImage = project.poster ? ogImageFor(project) : PROJECTS_OG_IMAGE;
  return buildPageMetadata({
    title: projectSeoTitle(project),
    description: projectSeoDescription(project),
    url: absoluteUrl(projectHref(project.slug)),
    ogImage,
    ogImageAlt: projectPosterAlt(project),
  });
}

const REGIONAL_LANGUAGES = new Set<string>(["Telugu", "Tamil", "Malayalam", "Kannada"]);

function neighbors(projects: Project[], slug: string) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) return { prev: null, next: null, others: projects };
  return {
    // Loop around the ends; with a single project there is nowhere to go.
    prev: projects.length > 1 ? projects[(index - 1 + projects.length) % projects.length] : null,
    next: projects.length > 1 ? projects[(index + 1) % projects.length] : null,
    others: projects.filter((p) => p.slug !== slug),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const projects = (await getProjects()).filter(projectIsPublished);
  const project =
    projects.find((p) => p.slug === slug) ??
    (await getProjectBySlug(slug).then((p) => (p && projectIsPublished(p) ? p : null)));
  if (!project) {
    // A renamed project: its old URL moves permanently (308) to the current one.
    const moved = await getProjectByPreviousSlug(slug);
    if (moved && projectIsPublished(moved)) permanentRedirect(projectHref(moved.slug));
    notFound();
  }
  const clientsById = new Map((await getClients()).map((c) => [c.id, c]));
  const client = toProjectClient(project.clientId ? clientsById.get(project.clientId) : undefined);

  const { prev, next, others } = neighbors(projects, project.slug);
  const prevNav = prev ? { slug: prev.slug, title: prev.title } : null;
  const nextNav = next ? { slug: next.slug, title: next.title } : null;
  const url = absoluteUrl(projectHref(project.slug));
  const posterUrl = projectAbsolutePosterUrl(project.poster);
  const seoAlt = projectPosterAlt(project);
  const workType =
    project.category === "Movie Dubbing" ? "Movie" : project.category === "TV Series" ? "TVSeries" : project.category === "Song Recording" ? "MusicRecording" : "CreativeWork";
  // Service tags link to the matching service page when one exists (names match src/data/services.ts).
  const serviceTags = (project.services ?? []).map((name) => {
    const svc = SERVICES.find((s) => s.name === name);
    return { name, href: svc ? serviceHref(svc.slug) : undefined };
  });
  const yearChip = projectYearChip(project);
  const marketPage =
    project.from === "English"
      ? { slug: "hollywood-dubbing-indian-languages" as const, label: "Hollywood dubbing into Indian languages" }
      : REGIONAL_LANGUAGES.has(project.from)
        ? { slug: "regional-film-dubbing" as const, label: "Regional film dubbing" }
        : null;
  const trailerId = youtubeId(project.trailerUrl);
  // No target language: sections read "Voice cast" / "Trailer".
  const mainTarget = project.to[0] ?? "";
  const releaseYear = project.originalRelease?.slice(0, 4);
  const ew = project.evaWork;
  const evaDid = [
    ew?.lipSync ? "Full lip-sync dubbing" : null,
    ew?.songs ? "Songs dubbed" : null,
    ew?.mix ? `${ew.mix} mix` : null,
    ew?.voiceArtists ? `${ew.voiceArtists} voice artists` : null,
    ew?.dubbingDirector ? `Dubbing director: ${ew.dubbingDirector}` : null,
  ].filter(Boolean) as string[];

  const workSchema = {
    "@context": "https://schema.org",
    "@type": workType,
    name: project.title,
    url,
    ...(posterUrl ? { image: posterUrl } : {}),
    ...(project.description ? { description: project.description } : {}),
    ...(project.synopsis ? { abstract: project.synopsis } : {}),
    ...(project.originalRelease
      ? { datePublished: project.originalRelease }
      : project.year && project.year !== PROJECT_YEAR_ONGOING
        ? { datePublished: project.year }
        : {}),
    // Original language of the film; the dubbed versions are listed as translations.
    inLanguage: project.from,
    ...(project.director ? { director: { "@type": "Person", name: project.director } } : {}),
    ...(project.cast?.length
      ? { actor: project.cast.map((name) => ({ "@type": "Person", name })) }
      : {}),
    ...(project.productionHouse
      ? { productionCompany: { "@type": "Organization", name: project.productionHouse } }
      : {}),
    ...(project.to.length ? { workTranslation: project.to.map((lang) => ({
      "@type": workType,
      name: `${project.title} (${lang})`,
      inLanguage: lang,
      translator: { "@id": EVA_ORG_ID },
    })) } : {}),
    contributor: { "@id": EVA_ORG_ID },
    ...(trailerId
      ? {
          trailer: {
            "@type": "VideoObject",
            name: `${project.title} – ${mainTarget ? `${mainTarget} dubbed ` : ""}trailer`,
            description: mainTarget
              ? `${mainTarget} dubbed trailer of ${project.title}, dubbed by ${SITE_NAME}.`
              : `Trailer of ${project.title}, with audio work by ${SITE_NAME}.`,
            thumbnailUrl: `https://i.ytimg.com/vi/${trailerId}/hqdefault.jpg`,
            embedUrl: `https://www.youtube-nocookie.com/embed/${trailerId}`,
            contentUrl: `https://www.youtube.com/watch?v=${trailerId}`,
            uploadDate: project.updatedAt || project.createdAt,
          },
        }
      : {}),
  };

  const faqSchema = project.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: project.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${APP_BASE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Our Projects",
        item: PROJECTS_PAGE_URL,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: url,
      },
    ],
  };

  const orgSchema = {
    "@context": "https://schema.org",
    ...evaOrganizationLd(),
  };

  const exploreProjects = others.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    from: p.from,
    to: p.to,
    category: p.category,
    ...(p.poster ? { poster: p.poster } : {}),
    ...(p.posterAlt ? { posterAlt: p.posterAlt } : {}),
    ...(p.year ? { year: p.year } : {}),
    ...(p.clientId && clientsById.has(p.clientId) ? { client: toProjectClient(clientsById.get(p.clientId)) } : {}),
  }));

  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <JsonLd id="project-org-jsonld" data={orgSchema} />
      <JsonLd id="project-work-jsonld" data={workSchema} />
      <JsonLd id="project-breadcrumb-jsonld" data={breadcrumbSchema} />
      {faqSchema ? <JsonLd id="project-faq-jsonld" data={faqSchema} /> : null}
      <PageHero
        svg={<SvgIcon name="film" />}
        title={project.title}
        trail={[
          { label: "Our Projects", href: Routes.PROJECTS },
          { label: project.title, href: Routes.project(project.slug) },
        ]}
        className="eva-projects-hero eva-project-detail-hero"
        schema={false}
        backgroundSrc={heroBackdrop(project.poster)}
      />

      <section className="block block--darkbg eva-project-detail" aria-label={project.title}>
        <div className="container eva-project-detail-inner">
          <div className="eva-project-detail-stage">
            <ProjectAdjacentNav prev={prevNav} next={nextNav} variant="side" />
            <div className="row gutter-30 eva-project-detail-main">
              <div className="col-md-5">
                <div className="eva-project-detail-poster">
                  {project.poster ? (
                    <Image
                      src={project.poster}
                      alt={seoAlt}
                      width={600}
                      height={900}
                      className="eva-project-detail-img"
                      sizes="(min-width: 992px) 380px, (min-width: 768px) 40vw, 90vw"
                      loading="eager"
                      fetchPriority="high"
                    />
                  ) : (
                    <PosterPlaceholder title={project.title} />
                  )}
                </div>
              </div>
              <div className="col-md-7">
                <p className="h--lg eva-project-detail-heading">{project.title}</p>
                <ul className="eva-project-detail-chips" aria-label="Project details">
                  <li className="eva-project-detail-chip">{projectLanguageChip(project)}</li>
                  <li className="eva-project-detail-chip">{project.category}</li>
                  {yearChip ? <li className="eva-project-detail-chip">{yearChip}</li> : null}
                  {project.audioHours ? (
                    <li className="eva-project-detail-chip">
                      {formatAudioHours(project.audioHours)} hours dubbed
                    </li>
                  ) : null}
                </ul>
                {serviceTags.length ? (
                  <ul className="eva-project-detail-chips eva-project-services" aria-label="Services delivered">
                    {serviceTags.map((t) => (
                      <li key={t.name} className="eva-project-detail-chip">
                        {t.href ? <Link href={t.href}>{t.name}</Link> : t.name}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="eva-project-detail-brand">Dubbed by {SITE_NAME}</p>
                <ProjectClientBadge client={client} />
                {project.description ? (
                  <p className="eva-project-detail-desc">{project.description}</p>
                ) : null}
                <div className="eva-project-detail-cta">
                  <Link className="btn" href={Routes.CONTACT}>
                    Contact us
                  </Link>
                </div>
                <ProjectAdjacentNav prev={prevNav} next={nextNav} variant="stack" />
              </div>
            </div>
          </div>

          <div className="eva-project-content">
            {project.synopsis ? (
              <section aria-labelledby="pc-synopsis">
                <h2 id="pc-synopsis" className="h--md">About {project.title}</h2>
                {project.synopsis.split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </section>
            ) : null}

            {project.director || project.cast?.length || project.productionHouse || project.originalRelease ? (
              <section aria-labelledby="pc-film">
                <h2 id="pc-film" className="h--md">Original film</h2>
                <dl className="eva-project-facts">
                  <dt>Original language</dt>
                  <dd>{project.from}</dd>
                  {project.director ? (<><dt>Director</dt><dd>{project.director}</dd></>) : null}
                  {project.cast?.length ? (<><dt>Cast</dt><dd>{project.cast.join(", ")}</dd></>) : null}
                  {project.productionHouse ? (<><dt>Production</dt><dd>{project.productionHouse}</dd></>) : null}
                  {project.originalRelease ? (<><dt>Original release</dt><dd>{project.originalRelease}</dd></>) : null}
                </dl>
              </section>
            ) : null}

            {evaDid.length || ew?.notes ? (
              <section aria-labelledby="pc-eva">
                <h2 id="pc-eva" className="h--md">What {SITE_NAME} did</h2>
                {evaDid.length ? (
                  <ul className="eva-project-eva-list">
                    {evaDid.map((d) => (<li key={d}>{d}</li>))}
                  </ul>
                ) : null}
                {ew?.notes ? <p>{ew.notes}</p> : null}
              </section>
            ) : null}

            {project.voiceCast?.length ? (
              <section aria-labelledby="pc-voices">
                <h2 id="pc-voices" className="h--md">{mainTarget ? `${mainTarget} voice cast` : "Voice cast"}</h2>
                <dl className="eva-project-facts">
                  {project.voiceCast.map((v) => (
                    <div key={`${v.role}-${v.artist}`} className="eva-project-fact">
                      <dt>{v.role}</dt>
                      <dd>{v.artist}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {trailerId ? (
              <section aria-labelledby="pc-trailer">
                <h2 id="pc-trailer" className="h--md">{mainTarget ? `${mainTarget} dubbed trailer` : "Trailer"}</h2>
                <ProjectTrailer id={trailerId} title={`${project.title} – ${mainTarget ? `${mainTarget} dubbed trailer` : "trailer"}`} />
              </section>
            ) : null}

            {project.whereToWatch ? (
              <section aria-labelledby="pc-watch">
                <h2 id="pc-watch" className="h--md">Where to watch</h2>
                <p>
                  {project.to.length
                    ? `The ${project.to.join(" / ")} version${releaseYear ? ` of this ${releaseYear} film` : ""}`
                    : `This ${releaseYear ? `${releaseYear} ` : ""}film`}{" "}
                  is available on{" "}
                  {project.whereToWatch}.
                </p>
              </section>
            ) : null}

            {project.faqs?.length ? (
              <section aria-labelledby="pc-faq">
                <h2 id="pc-faq" className="h--md">FAQ</h2>
                {project.faqs.map((f) => (
                  <details key={f.q} className="eva-project-faq">
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </section>
            ) : null}
          </div>

          <nav className="eva-project-content eva-hub-links" aria-labelledby="pc-related">
            <h2 id="pc-related" className="h--md">Related dubbing work</h2>
            <ul>
              {project.to.map((lang) => (
                <li key={lang}>
                  <Link className="link-on-dark" href={languageHubHref(project.from, lang)}>
                    More {project.from} to {lang} dubbing projects
                  </Link>
                </li>
              ))}
              {marketPage ? (
                <li>
                  <Link className="link-on-dark" href={serviceHref(marketPage.slug)}>{marketPage.label}</Link>
                </li>
              ) : null}
              <li>
                <Link className="link-on-dark" href={serviceHref("dubbing-studio")}>Our lip-sync dubbing studio in Mumbai</Link>
              </li>
              <li>
                <Link className="link-on-dark" href={Routes.PROJECTS}>All our projects</Link>
              </li>
            </ul>
          </nav>

          <ProjectExplore projects={exploreProjects} />
        </div>
      </section>
    </main>
  );
}
