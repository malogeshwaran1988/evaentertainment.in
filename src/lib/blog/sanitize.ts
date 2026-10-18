import "server-only";
import sanitizeHtml from "sanitize-html";
import { BLOG_IMAGE_URL_PREFIX } from "@@/data/blog";

/**
 * Server-side allowlist for editor HTML. Runs on every save, so whatever reaches blog.json (and
 * the public page via dangerouslySetInnerHTML) is safe even if the browser-side editor is bypassed.
 *
 * - Headings start at h2 (the page title is the only h1).
 * - Links: http(s), mailto, tel, site-relative only; new-tab links get rel="noopener noreferrer".
 * - Images: uploaded ones (/images/blog/…) or https; never data: URLs (they bloat the post).
 * - Video: YouTube (rewritten to youtube-nocookie, which the CSP allows) and Vimeo iframes only.
 * - Inline style: only alignment / width values the editor writes.
 */
const VIDEO_HOSTS = ["www.youtube-nocookie.com", "www.youtube.com", "youtube.com", "player.vimeo.com"];

const allowedClass = /^hg-rte-[a-z-]+$/;

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s", "sub", "sup",
    "mark", "code", "pre", "blockquote", "hr", "a", "ul", "ol", "li", "span", "div", "figure",
    "figcaption", "table", "caption", "colgroup", "col", "thead", "tbody", "tfoot", "tr", "th", "td",
    "img", "iframe", "input",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading", "data-hg-size"],
    iframe: ["src", "title", "allow", "allowfullscreen", "loading"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    col: ["span"],
    ol: ["start", "reversed"],
    input: ["type", "checked", "disabled"],
    div: ["data-hg-mode", "data-hg-size"],
    "*": ["class", "style"],
  },
  allowedClasses: { "*": [allowedClass] },
  allowedStyles: {
    "*": {
      "text-align": [/^(left|right|center|justify)$/],
      width: [/^\d{1,4}(px|%)$/],
      "max-width": [/^\d{1,3}%$/],
      height: [/^auto$/],
      margin: [/^[\d.]+rem 0$/],
      "list-style-type": [/^(decimal|lower-roman|upper-alpha|disc|circle|square)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["https"], iframe: ["https"] },
  allowProtocolRelative: false,
  allowedIframeHostnames: VIDEO_HOSTS,
  disallowedTagsMode: "discard",
  // Drop <script>/<style> together with their text (sanitize-html keeps text of other tags).
  nonTextTags: ["script", "style", "textarea", "option", "noscript", "title"],
  transformTags: {
    h1: "h2",
    a: (tagName, attribs) => {
      const out = { ...attribs };
      if (out.target && out.target !== "_blank") delete out.target;
      if (out.target === "_blank") {
        const rel = new Set((out.rel ?? "").split(/\s+/).filter(Boolean));
        rel.add("noopener");
        rel.add("noreferrer");
        out.rel = [...rel].join(" ");
      }
      return { tagName, attribs: out };
    },
    img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
    // Checklists are display-only on the public page.
    input: (tagName, attribs) => ({ tagName, attribs: { ...attribs, disabled: "" } }),
    iframe: (tagName, attribs) => {
      const src = attribs.src ?? "";
      const youtube = src.match(/^https:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,20})/);
      return {
        tagName,
        attribs: {
          ...attribs,
          src: youtube ? `https://www.youtube-nocookie.com/embed/${youtube[1]}` : src,
          title: attribs.title && attribs.title !== "Video" ? attribs.title : "Embedded video",
          loading: "lazy",
        },
      };
    },
  },
  exclusiveFilter: (frame) => {
    if (frame.tag === "input") return frame.attribs.type !== "checkbox";
    if (frame.tag === "iframe") {
      // Drop the whole frame (not just its src) when it isn't an allowed video host.
      try {
        const url = new URL(frame.attribs.src ?? "");
        return url.protocol !== "https:" || !VIDEO_HOSTS.includes(url.hostname);
      } catch {
        return true;
      }
    }
    if (frame.tag === "img") {
      const src = frame.attribs.src ?? "";
      return !(src.startsWith(BLOG_IMAGE_URL_PREFIX) || src.startsWith("https://"));
    }
    return false;
  },
};

/** sanitize-html checks img schemes only for absolute URLs; relative ones must be ours. */
function keepOnlyOwnRelativeImages(html: string) {
  return html.replace(/<img\b[^>]*\bsrc="(?!https:\/\/|\/images\/blog\/)[^"]*"[^>]*>/gi, "");
}

export function sanitizeBlogHtml(html: string): string {
  const clean = sanitizeHtml(html, OPTIONS);
  return keepOnlyOwnRelativeImages(clean)
    .replace(/<p>(?:\s|&nbsp;|<br \/>)*<\/p>/g, "")
    .trim();
}
