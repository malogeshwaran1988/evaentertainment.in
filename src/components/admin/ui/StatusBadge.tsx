import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  CalendarClock,
  CheckCircle2,
  FilePen,
  Clapperboard,
  Captions,
  EyeOff,
  Globe,
  Mic,
  Languages,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@@/lib/utils";

/**
 * Admin status pills. Every tone pairs a tinted background with a dark (light theme) or
 * light (dark theme) text colour that is ≥ 4.5:1 on that background (WCAG 1.4.3), a ≥ 3:1
 * border (1.4.11) and an icon + text label so meaning never depends on colour alone (1.4.1).
 *
 * Measured contrast (text on its own background, WCAG relative luminance):
 *   light: green-800/green-50 6.8, amber-900/amber-50 8.8, zinc-700/zinc-100 9.5,
 *          violet-800/violet-50 8.2, sky-900/sky-50 8.9, rose-800/rose-50 7.3, teal-900/teal-50 9.1
 *   dark:  *-200 text on *-950 background: 10.5–14 for every tone.
 */
export type StatusTone = "success" | "warning" | "neutral" | "violet" | "sky" | "rose" | "teal";

const TONES: Record<StatusTone, string> = {
  success:
    "border-green-700/60 bg-green-50 text-green-800 dark:border-green-500/60 dark:bg-green-950 dark:text-green-200",
  warning:
    "border-amber-700/60 bg-amber-50 text-amber-900 dark:border-amber-500/60 dark:bg-amber-950 dark:text-amber-200",
  neutral:
    "border-zinc-500/70 bg-zinc-100 text-zinc-700 dark:border-zinc-500 dark:bg-zinc-900 dark:text-zinc-200",
  violet:
    "border-violet-700/60 bg-violet-50 text-violet-800 dark:border-violet-400/60 dark:bg-violet-950 dark:text-violet-200",
  sky: "border-sky-700/60 bg-sky-50 text-sky-900 dark:border-sky-400/60 dark:bg-sky-950 dark:text-sky-200",
  rose: "border-rose-700/60 bg-rose-50 text-rose-800 dark:border-rose-400/60 dark:bg-rose-950 dark:text-rose-200",
  teal: "border-teal-700/60 bg-teal-50 text-teal-900 dark:border-teal-400/60 dark:bg-teal-950 dark:text-teal-200",
};

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export function StatusBadge({
  tone,
  icon: IconCmp,
  children,
  title,
  className,
}: {
  tone: StatusTone;
  icon?: Icon;
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-semibold",
        TONES[tone],
        className,
      )}
    >
      {IconCmp ? <IconCmp className="size-3.5 shrink-0" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function VisibilityBadge({ published }: { published: boolean }) {
  return published ? (
    <StatusBadge tone="success" icon={Globe} title="Shown on the public Our Projects page">
      Public
    </StatusBadge>
  ) : (
    <StatusBadge tone="neutral" icon={EyeOff} title="Hidden from the public site">
      Private
    </StatusBadge>
  );
}

const CATEGORY: Record<string, { tone: StatusTone; icon: Icon }> = {
  "Movie Dubbing": { tone: "violet", icon: Clapperboard },
  "TV Series": { tone: "sky", icon: Languages },
  Documentary: { tone: "teal", icon: Captions },
  "Song Recording": { tone: "rose", icon: Mic },
  // Legacy values (mapped at read time, kept so any stray value still renders).
  Dubbing: { tone: "violet", icon: Clapperboard },
  "Voice Over": { tone: "rose", icon: Mic },
  Subtitling: { tone: "teal", icon: Captions },
};

export function CategoryBadge({ category }: { category: string }) {
  const c = CATEGORY[category] ?? { tone: "neutral" as const, icon: undefined };
  return (
    <StatusBadge tone={c.tone} icon={c.icon}>
      {category}
    </StatusBadge>
  );
}

export function SeoBadge({ words, min }: { words: number; min: number }) {
  const ok = words >= min;
  return (
    <StatusBadge
      tone={ok ? "success" : "warning"}
      icon={ok ? CheckCircle2 : TriangleAlert}
      title={
        ok
          ? "Enough unique content: indexed by Google and listed in the sitemap."
          : `Thin: noindex and left out of the sitemap until it has ${min}+ words of unique content.`
      }
    >
      {ok ? "Indexable" : "Thin"} · {words} {words === 1 ? "word" : "words"}
    </StatusBadge>
  );
}

/** Blog post state: Draft (never public), Scheduled (published, date not reached), Published. */
export function BlogStatusBadge({ state }: { state: "draft" | "scheduled" | "published" }) {
  if (state === "published") {
    return (
      <StatusBadge tone="success" icon={Globe} title="Live on the public blog and in the sitemap">
        Published
      </StatusBadge>
    );
  }
  if (state === "scheduled") {
    return (
      <StatusBadge tone="sky" icon={CalendarClock} title="Goes live on its publish date">
        Scheduled
      </StatusBadge>
    );
  }
  return (
    <StatusBadge tone="warning" icon={FilePen} title="Not public: hidden from the blog, search engines and the sitemap">
      Draft
    </StatusBadge>
  );
}
