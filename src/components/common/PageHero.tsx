import type { ReactNode } from "react";
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
};

export default function PageHero({ icon, svg, title, subtitle, trail, schema = true, className }: Props) {
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

  return (
    <div className={`block block--title block--darkbg${className ? ` ${className}` : ""}`}>
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
