import type { Project, ProjectFaq, ProjectVoiceRole } from "@@/data/projects";

/**
 * Minimum words of unique, per-film text before a project page is indexed.
 * Override with NEXT_PUBLIC_PROJECT_INDEX_MIN_WORDS (public so the admin badge agrees).
 */
export const PROJECT_INDEX_MIN_WORDS = (() => {
  const n = Number(process.env.NEXT_PUBLIC_PROJECT_INDEX_MIN_WORDS);
  return Number.isFinite(n) && n >= 0 ? n : 150;
})();

type ContentSource = Pick<
  Project,
  | "description"
  | "synopsis"
  | "director"
  | "cast"
  | "originalRelease"
  | "productionHouse"
  | "evaWork"
  | "voiceCast"
  | "whereToWatch"
  | "faqs"
>;

const words = (s: string | undefined) =>
  s ? s.trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length : 0;

/** Counts only text typed for this film (not the template, title or language chips). */
export function projectUniqueWordCount(p: ContentSource): number {
  let n = words(p.description) + words(p.synopsis) + words(p.director) + words(p.productionHouse);
  n += words(p.whereToWatch) + words(p.originalRelease);
  for (const c of p.cast ?? []) n += words(c);
  for (const v of p.voiceCast ?? []) n += words(v.role) + words(v.artist);
  for (const f of p.faqs ?? []) n += words(f.q) + words(f.a);
  if (p.evaWork) n += words(p.evaWork.notes) + words(p.evaWork.dubbingDirector) + words(p.evaWork.mix);
  return n;
}

export function projectIsIndexable(p: ContentSource, min = PROJECT_INDEX_MIN_WORDS) {
  return projectUniqueWordCount(p) >= min;
}

/** Extracts the 11-char YouTube video id from watch/share/embed/shorts URLs. */
export function youtubeId(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\.|^m\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else {
        const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
        id = m ? m[1] : null;
      }
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to", "vs"]);

/** Title Case for ALT text; keeps words that are already mixed/upper case (e.g. "OTT", "McDonald"). */
export function titleCase(text: string): string {
  return text
    .split(/(\s+)/)
    .map((w, i) => {
      if (/^\s+$/.test(w) || w === "") return w;
      if (/[A-Z]/.test(w.slice(1)) || /^[A-Z0-9]+$/.test(w)) return w;
      const lower = w.toLowerCase();
      if (i > 0 && SMALL_WORDS.has(lower)) return lower;
      return lower.replace(/^(\P{L}*)(\p{L})/u, (_m, pre: string, c: string) => pre + c.toUpperCase());
    })
    .join("");
}

// ----- Form helpers: lists edited as plain text, one item per line -----

const clean = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

export function parseLines(raw: string, maxItems = 30, maxLen = 120): string[] {
  return raw
    .split(/\r?\n/)
    .map((l) => clean(l).slice(0, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

/** "Role — Artist" / "Role - Artist" / "Role: Artist" per line. */
export function parseVoiceCast(raw: string): ProjectVoiceRole[] {
  return parseLines(raw, 40, 160)
    .map((l) => {
      const m = l.match(/^(.+?)\s*(?:—|–|-|:)\s*(.+)$/);
      return m ? { role: m[1].trim(), artist: m[2].trim() } : { role: l, artist: "" };
    })
    .filter((v) => v.role && v.artist);
}

export function formatVoiceCast(list: ProjectVoiceRole[] | undefined) {
  return (list ?? []).map((v) => `${v.role} — ${v.artist}`).join("\n");
}

/** Blocks of "Q: …" then "A: …" (answer may span lines), separated by blank lines or the next Q:. */
export function parseFaqs(raw: string): ProjectFaq[] {
  const out: ProjectFaq[] = [];
  let cur: ProjectFaq | null = null;
  for (const line of raw.split(/\r?\n/)) {
    const l = clean(line);
    const q = l.match(/^Q[:.)]\s*(.+)$/i);
    const a = l.match(/^A[:.)]\s*(.+)$/i);
    if (q) {
      if (cur?.q && cur.a) out.push(cur);
      cur = { q: q[1].slice(0, 200), a: "" };
    } else if (a && cur) {
      cur.a = a[1];
    } else if (l && cur?.a) {
      cur.a = `${cur.a} ${l}`;
    }
  }
  if (cur?.q && cur.a) out.push(cur);
  return out.slice(0, 10).map((f) => ({ q: f.q, a: f.a.slice(0, 1000) }));
}

export function formatFaqs(list: ProjectFaq[] | undefined) {
  return (list ?? []).map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");
}
