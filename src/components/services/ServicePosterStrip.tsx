import PosterCards, { type PosterCard } from "@@/components/services/PosterCards";
import { Routes } from "@@/constants/routes";
import { projectIsPublished, projectLanguageLine, projectYearLabel } from "@@/data/projects";
import { youtubeId } from "@@/lib/project-content";
import { projectPosterAlt } from "@@/lib/project-seo";
import { getProjects } from "@@/lib/projects-store";

/**
 * Poster cards of published portfolio films. The page's picks come first, then the newest
 * published projects fill the strip to six. A card opens a quick-view dialog; the dialog links
 * to the full project page. Hidden when nothing is published.
 */
export default async function ServicePosterStrip({ slugs }: { slugs?: string[] }) {
  if (!slugs?.length) return null;
  let cards: PosterCard[] = [];
  try {
    const published = (await getProjects()).filter(projectIsPublished);
    const bySlug = new Map(published.map((p) => [p.slug, p]));
    const picked = slugs.flatMap((s) => bySlug.get(s) ?? []);
    const rest = published.filter((p) => !picked.includes(p));
    cards = [...picked, ...rest].slice(0, 6).map((p) => ({
      id: p.id,
      title: p.title,
      href: Routes.project(p.slug),
      poster: p.poster,
      posterAlt: projectPosterAlt(p),
      languages: projectLanguageLine(p),
      category: p.category,
      year: p.year ? projectYearLabel(p.year) : undefined,
      description: p.description || p.synopsis,
      trailerId: youtubeId(p.trailerUrl) ?? undefined,
    }));
  } catch {
    return null;
  }
  if (cards.length === 0) return null;
  return (
    <section className="block eva-svc-section eva-svc-posters" aria-labelledby="svc-poster-strip">
      <div className="container">
        <h2 id="svc-poster-strip" className="eva-svc-title">
          <i className="icon icon-play-circle" aria-hidden="true" /> Films we have{" "}
          <span>dubbed into Hindi</span>
        </h2>
        <PosterCards cards={cards} />
      </div>
    </section>
  );
}
