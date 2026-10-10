import Link from "@@/components/common/NavLink";
import { Routes } from "@@/constants/routes";

export type Crumb = { label: string; href?: string };

/** Home is always first; the last crumb is the current page (no link). */
export default function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ul className="breadcrumbs">
        <li>
          <Link href={Routes.HOME}>Home</Link>
        </li>
        {trail.map((crumb, i) =>
          i === trail.length - 1 || !crumb.href ? (
            <li key={crumb.label} aria-current={i === trail.length - 1 ? "page" : undefined}>
              {crumb.label}
            </li>
          ) : (
            <li key={crumb.label}>
              <Link href={crumb.href}>{crumb.label}</Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
