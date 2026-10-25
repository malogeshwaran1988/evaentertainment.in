import type { ReactNode } from "react";
import { preload } from "react-dom";
import Breadcrumbs, { type Crumb } from "@@/components/common/Breadcrumbs";
import JsonLd from "@@/components/common/JsonLd";
import { Routes } from "@@/constants/routes";
import { absoluteUrl } from "@@/lib/seo";

type Props = {
  /** Recording icon-font class, e.g. `icon-audio`. */
  icon?: string;
  /** Or an inline SVG icon element. */
  svg?: ReactNode;
  title: string;
  subtitle?: ReactNode;
  /** Crumbs after Home; the last one is the current page and needs an href for JSON-LD. */
  trail: (Crumb & { href: string })[];
  /** Adds BreadcrumbList JSON-LD (skip on noindex pages). */
  schema?: boolean;
  className?: string;
  /**
   * Optional full-bleed decorative background (e.g. project poster).
   * Decorative only — not announced to assistive tech.
   */
  backgroundSrc?: string;
  /** When true, skip next/image optimization (uploaded posters). */
  backgroundUnoptimized?: boolean;
};

export default function PageHero({
  icon,
  svg,
  title,
  subtitle,
  trail,
  schema = true,
  className,
  backgroundSrc,
  backgroundUnoptimized,
}: Props) {
  // The hero block background (custom.css .block--title) is the LCP element; fetch it before CSS is parsed.
  preload("/images/common/header-bg.avif", { as: "image", type: "image/avif", fetchPriority: "high" });
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ label: "Home", href: Routes.HOME }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };

  const classes = [
    "block",
    "block--title",
    "block--darkbg",
    backgroundSrc ? "eva-page-hero--has-bg" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {backgroundSrc ? (
        // Decorative hero atmosphere only; the poster is also shown in content with real ALT.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="eva-page-hero__bg"
          src={backgroundSrc}
          alt=""
          aria-hidden="true"
          decoding="async"
          // Decorative: the page's real first image (e.g. the poster) gets fetchPriority=high.
          fetchPriority="low"
          data-unoptimized={backgroundUnoptimized ? "" : undefined}
        />
      ) : null}
      {schema ? <JsonLd id="breadcrumb-jsonld" data={breadcrumbSchema} /> : null}
      <div className="container">
        <div className="text-center">
          <h1>
            {svg ?? (icon ? <i className={`icon ${icon}`} aria-hidden="true" /> : null)}
            {title}
          </h1>
          {subtitle ? <p className="eva-page-hero__subtitle">{subtitle}</p> : null}
          <Breadcrumbs trail={trail} />
        </div>
      </div>
    </div>
  );
}
