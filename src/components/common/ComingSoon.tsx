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
  /** e.g. "Our blog on dubbing, voice-over and sound is coming soon." */
  message: string;
  detail?: string;
  ctas?: Cta[];
};

const DEFAULT_CTAS: Cta[] = [
  { label: "Contact us", href: Routes.CONTACT },
  { label: "Our projects", href: Routes.PROJECTS },
];

/**
 * Shared "Coming soon" page (blog, clients …) in the site's hero + dark block style.
 * Pages using it must be `noindex, follow` and kept out of the sitemap while it shows.
 */
export default function ComingSoon({ icon, title, subtitle, href, message, detail, ctas = DEFAULT_CTAS }: Props) {
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
      <section className="block block--darkbg eva-coming-soon-block" aria-labelledby="coming-soon-heading">
        <div className="container">
          <div className="eva-coming-soon">
            <h2 id="coming-soon-heading" className="h--md">
              Coming soon
            </h2>
            <p className="p--lg">{message}</p>
            {detail ? <p>{detail}</p> : null}
            <div className="eva-project-detail-cta eva-coming-soon-cta">
              {ctas.map((cta, i) => (
                <Link key={cta.href} className={i === 0 ? "btn" : "btn btn--border"} href={cta.href}>
                  {cta.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
