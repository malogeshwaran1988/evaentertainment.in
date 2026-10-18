import type { ReactNode } from "react";
import Link from "@@/components/common/NavLink";
import PageHero from "@@/components/common/PageHero";
import { Routes } from "@@/constants/routes";

type Cta = { label: string; href: string };

type Props = {
  /** Recording icon-font class, e.g. `icon-people`. */
  icon: string;
  title: string;
  subtitle?: string;
  /** Breadcrumb target for this page. */
  href: string;
  /** Optional real intro section above the card (e.g. /clients, which is indexable). */
  introHeading?: string;
  intro?: ReactNode;
  /** e.g. "Our blog on dubbing, voice-over and sound is coming soon." */
  message: string;
  detail?: string;
  ctas?: Cta[];
};

const DEFAULT_CTAS: Cta[] = [
  { label: "Our projects", href: Routes.PROJECTS },
  { label: "Contact us", href: Routes.CONTACT },
];

/**
 * Shared "Coming soon" page (blog, clients …): site hero + breadcrumb, an optional centred intro,
 * and a branded card (gold/green accent, waveform badge) with the site's buttons.
 * Pages showing only the card must be `noindex, follow` and kept out of the sitemap.
 */
export default function ComingSoon({
  icon,
  title,
  subtitle,
  href,
  introHeading,
  intro,
  message,
  detail,
  ctas = DEFAULT_CTAS,
}: Props) {
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <PageHero
        icon={icon}
        className="eva-coming-soon-hero"
        title={title}
        subtitle={subtitle}
        trail={[{ label: title, href }]}
        schema={false}
      />
      <section className="block eva-coming-soon-block" aria-labelledby="coming-soon-heading">
        <div className="container">
          {intro ? (
            <div className="eva-coming-soon-intro">
              {introHeading ? <h2 className="h--md">{introHeading}</h2> : null}
              {intro}
            </div>
          ) : null}
          <div className="eva-coming-soon">
            <span className="eva-coming-soon-badge" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <p className="eva-coming-soon-eyebrow">Coming soon</p>
            <h2 id="coming-soon-heading" className="eva-coming-soon-title">
              {message}
            </h2>
            {detail ? <p className="eva-coming-soon-detail">{detail}</p> : null}
            <div className="eva-coming-soon-cta">
              {ctas.map((cta, i) => (
                <Link key={cta.href} className={i === 0 ? "btn" : "btn btn--border"} href={cta.href}>
                  <span>{cta.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
