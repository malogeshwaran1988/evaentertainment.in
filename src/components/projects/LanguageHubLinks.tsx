import Link from "@@/components/common/NavLink";
import type { LanguagePair } from "@@/lib/project-links";
import { LANGUAGE_HUB_PREFIX } from "@@/lib/project-links";

type LanguageHubLinksProps = {
  pairs: Pick<LanguagePair, "slug" | "from" | "to" | "projects">[];
  heading: string;
  /** Wrap in a dark section block (service pages); off when already inside one. */
  section?: boolean;
  id?: string;
};

/** Crawlable links to every /dubbing/<pair> hub with its real project count. */
export default function LanguageHubLinks({ pairs, heading, section = false, id = "hub-links" }: LanguageHubLinksProps) {
  if (!pairs.length) return null;
  const body = (
    <nav aria-labelledby={id} className="eva-hub-links">
      <h2 id={id} className="h--md">
        {heading}
      </h2>
      <ul>
        {pairs.map((p) => (
          <li key={p.slug}>
            <Link className="link-on-dark" href={`${LANGUAGE_HUB_PREFIX}/${p.slug}`}>
              {p.from} to {p.to} dubbing
            </Link>{" "}
            ({p.projects.length} {p.projects.length === 1 ? "project" : "projects"})
          </li>
        ))}
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
