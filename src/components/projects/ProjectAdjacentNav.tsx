import Link from "@@/components/common/NavLink";
import { Routes } from "@@/constants/routes";

export type ProjectNavNeighbor = { slug: string; title: string };

type ProjectAdjacentNavProps = {
  prev: ProjectNavNeighbor | null;
  next: ProjectNavNeighbor | null;
  /** `side` = beside the project stage (desktop); `stack` = under CTAs (mobile). */
  variant: "side" | "stack";
};

function AdjacentLink({
  neighbor,
  direction,
}: {
  neighbor: ProjectNavNeighbor | null;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";
  const label = isPrev ? "Previous" : "Next";

  if (!neighbor) return null;

  return (
    <Link
      className={`eva-project-adj eva-project-adj--${direction}`}
      href={Routes.project(neighbor.slug)}
      aria-label={`${label} project: ${neighbor.title}`}
    >
      {isPrev ? <span aria-hidden="true">‹</span> : null}
      <span className="eva-project-adj-label">
        {label}
        <span className="eva-project-adj-title">{neighbor.title}</span>
      </span>
      {!isPrev ? <span aria-hidden="true">›</span> : null}
    </Link>
  );
}

export default function ProjectAdjacentNav({
  prev,
  next,
  variant,
}: ProjectAdjacentNavProps) {
  if (!prev && !next) return null;
  return (
    <nav
      className={`eva-project-adj-nav eva-project-adj-nav--${variant}`}
      aria-label="Adjacent projects"
    >
      <AdjacentLink neighbor={prev} direction="prev" />
      <AdjacentLink neighbor={next} direction="next" />
    </nav>
  );
}
