import Image from "next/image";
import Link from "@@/components/common/NavLink";
import type { LanguagePair } from "@@/lib/project-links";
import { LANGUAGE_HUB_PREFIX } from "@@/lib/project-links";

type LanguageHubLinksProps = {
  pairs: Pick<LanguagePair, "slug" | "from" | "to" | "projects">[];
  heading: string;
  /** Wrap in a dark section block (service pages); off when already inside one. */
  section?: boolean;
  id?: string;
  /** Card colours for dark blocks (default); false on light sections. */
  onDark?: boolean;
};

/**
 * Card grid of every /dubbing/<pair> hub: source and target chips, the real project count
 * and up to three real posters from that pair. The whole card is one crawlable link.
 */
export default function LanguageHubLinks({ pairs, heading, section = false, id = "hub-links", onDark = true }: LanguageHubLinksProps) {
  if (!pairs.length) return null;
  const body = (
    <nav aria-labelledby={id} className={`eva-pair-cards${onDark ? "" : " eva-pair-cards--light"}`}>
      <h2 id={id} className="h--md eva-pair-cards__title">
        {heading}
      </h2>
      <ul className="eva-pair-cards__grid">
        {pairs.map((p) => {
          const count = p.projects.length;
          const posters = p.projects.filter((x) => x.poster).slice(0, 3);
          return (
            <li key={p.slug}>
              <Link className="eva-pair-card" href={`${LANGUAGE_HUB_PREFIX}/${p.slug}`}>
                <span className="eva-pair-card__langs" aria-hidden="true">
                  <span className="eva-pair-card__chip">{p.from}</span>
                  <svg className="eva-pair-card__arrow" viewBox="0 0 24 24" width="18" height="18" focusable="false">
                    <path d="M4 12h14m-5-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="eva-pair-card__chip eva-pair-card__chip--to">{p.to}</span>
                </span>
                <span className="eva-pair-card__name">
                  {p.from} to {p.to} dubbing
                </span>
                <span className="eva-pair-card__foot">
                  <span className="eva-pair-card__badge">
                    {count} {count === 1 ? "project" : "projects"}
                  </span>
                  {posters.length > 0 && (
                    <span className="eva-pair-card__posters" aria-hidden="true">
                      {posters.map((x) => (
                        <span key={x.id} className="eva-pair-card__poster">
                          <Image src={x.poster as string} alt="" fill sizes="32px" loading="lazy" />
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
  return section ? (
    <section className="block block--darkbg">
      <div className="container">{body}</div>
    </section>
  ) : (
    body
  );
}
