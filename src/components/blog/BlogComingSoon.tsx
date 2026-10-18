import Link from "@@/components/common/NavLink";
import PageHero from "@@/components/common/PageHero";
import { Routes } from "@@/constants/routes";

/** Public /blog while BLOG_ENABLED is off. */
export default function BlogComingSoon() {
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <PageHero
        icon="icon-folded-newspaper"
        className="eva-blog-hero"
        title="Blog"
        subtitle="Dubbing, voice-over and sound notes from our Mumbai studio"
        trail={[{ label: "Blog", href: Routes.BLOG }]}
        schema={false}
      />
      <section className="block block--darkbg eva-blog" aria-labelledby="blog-soon-heading">
        <div className="container">
          <div className="eva-blog-soon">
            <h2 id="blog-soon-heading" className="h--md">
              Coming soon
            </h2>
            <p className="p--lg">Our blog on dubbing, voice-over and sound is coming soon.</p>
            <p>Until then, see the films we have worked on or tell us about your project.</p>
            <div className="eva-project-detail-cta eva-blog-soon-cta">
              <Link className="btn" href={Routes.CONTACT}>
                Contact us
              </Link>
              <Link className="btn btn--border" href={Routes.PROJECTS}>
                Our projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
