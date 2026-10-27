import Link from "@@/components/common/NavLink";
import { DUBBING_HUB, pairLinkLabel } from "@@/data/dubbing-pairs";
import { projectIsPublished } from "@@/data/projects";
import { getProjects } from "@@/lib/projects-store";
import {
  LANGUAGE_HUB_PREFIX,
  languagePairs,
  pairsWithProjects,
} from "@@/lib/project-links";

/** Footer column: top language pairs by project count, synced with admin saves through the projects cache. */
export default async function FooterDubbing() {
  let pairs: ReturnType<typeof languagePairs> = [];
  try {
    pairs = pairsWithProjects(
      languagePairs((await getProjects()).filter(projectIsPublished)),
    );
  } catch (err) {
    console.error("[footer] projects unavailable", err);
  }
  if (!pairs.length) return null;
  return (
    <div>
      <p className="eva-footer-title">{DUBBING_HUB.footerHeading}</p>
      <ul className="eva-footer-links">
        {pairs.slice(0, DUBBING_HUB.footerLimit).map((p) => (
          <li key={p.slug}>
            <Link href={`${LANGUAGE_HUB_PREFIX}/${p.slug}`}>
              {pairLinkLabel(p)}
            </Link>
          </li>
        ))}
        <li>
          <Link href={LANGUAGE_HUB_PREFIX}>{DUBBING_HUB.viewAll}</Link>
        </li>
      </ul>
    </div>
  );
}
