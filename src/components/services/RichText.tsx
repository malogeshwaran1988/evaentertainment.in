import type { ReactNode } from "react";
import Link from "@@/components/common/NavLink";
import { getYearsOfExperienceLabel } from "@@/constants/experience";

const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

/** Turns **bold**, [label](href) and {years} into elements. */
export function inline(text: string): ReactNode[] {
  const withYears = text.replaceAll("{years}", getYearsOfExperienceLabel());
  return withYears.split(TOKEN).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**")) return <strong key={i}>{inline(part.slice(2, -2))}</strong>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      return href.startsWith("/") ? (
        <Link key={i} href={href}>
          {label}
        </Link>
      ) : (
        <a key={i} href={href}>
          {label}
        </a>
      );
    }
    return part;
  });
}

/** Plain text for JSON-LD and meta tags. */
export function plain(text: string): string {
  return text
    .replaceAll("{years}", getYearsOfExperienceLabel())
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

/** Splits "**Label.** rest" into a card title and body. */
export function splitLabel(item: string): { title: string; body: string } | null {
  const m = /^\*\*([^*]+?)[.:]?\*\*\s*(.*)$/.exec(item);
  return m ? { title: m[1], body: m[2] } : null;
}
