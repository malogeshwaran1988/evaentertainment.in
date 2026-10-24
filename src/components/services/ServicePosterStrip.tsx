import Image from "next/image";
import Link from "@@/components/common/NavLink";
import { PosterPlaceholder } from "@@/components/projects/ProjectPoster";
import { Routes } from "@@/constants/routes";
import { getPublicProjects } from "@@/lib/projects-public";
import { projectPosterAlt } from "@@/lib/project-seo";

/** Poster strip of portfolio films (PDF image note: 4–6 films linking to project pages). Hidden when none are published. */
export default async function ServicePosterStrip({
  slugs,
}: {
  slugs?: string[];
}) {
  if (!slugs?.length) return null;
  let films: Awaited<ReturnType<typeof getPublicProjects>>["projects"] = [];
  try {
    const { projects } = await getPublicProjects();
    const bySlug = new Map(projects.map((p) => [p.slug, p]));
    films = slugs.flatMap((s) => bySlug.get(s) ?? []).slice(0, 6);
  } catch {
    return null;
  }
  if (films.length === 0) return null;
  return (
    <section
      className="block eva-svc-section eva-svc-posters"
      aria-labelledby="svc-poster-strip"
    >
      <div className="container">
        <h2 id="svc-poster-strip" className="eva-svc-title">
          <i className="icon icon-play-circle" aria-hidden="true" /> Films we
          have <span>dubbed into Hindi</span>
        </h2>
        <ul className="eva-svc-poster-list">
          {films.map((p) => (
            <li key={p.id}>
              <Link href={Routes.project(p.slug)} className="eva-svc-poster">
                <span className="eva-svc-poster-img">
                  {p.poster ? (
                    <Image
                      src={p.poster}
                      alt={projectPosterAlt(p)}
                      fill
                      sizes="(min-width: 992px) 220px, 45vw"
                      loading="lazy"
                    />
                  ) : (
                    <PosterPlaceholder title={p.title} />
                  )}
                </span>
                <span className="eva-svc-poster-title">{p.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
