import type { Metadata } from "next";
import PageHero from "@@/components/common/PageHero";
import { SvgIcon } from "@@/components/common/Icons";
import LanguageHubLinks from "@@/components/projects/LanguageHubLinks";
import { DUBBING_HUB } from "@@/data/dubbing-pairs";
import { PROJECTS_OG_IMAGE, projectIsPublished } from "@@/data/projects";
import { getProjects } from "@@/lib/projects-store";
import { LANGUAGE_HUB_PREFIX, languagePairs } from "@@/lib/project-links";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: DUBBING_HUB.title,
  description: DUBBING_HUB.description,
  url: absoluteUrl(LANGUAGE_HUB_PREFIX),
  ogImage: PROJECTS_OG_IMAGE,
  ogImageAlt: DUBBING_HUB.heading,
});

/** Every language pair with its real project count, most projects first. */
export default async function DubbingHubPage() {
  const pairs = languagePairs((await getProjects()).filter(projectIsPublished));
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <PageHero
        svg={<SvgIcon name="film" />}
        title={DUBBING_HUB.heading}
        subtitle={DUBBING_HUB.intro}
        trail={[{ label: DUBBING_HUB.heading, href: LANGUAGE_HUB_PREFIX }]}
      />
      <section className="block block--darkbg">
        <div className="container">
          <LanguageHubLinks pairs={pairs} heading={DUBBING_HUB.listHeading} id="dubbing-pairs" />
        </div>
      </section>
    </main>
  );
}
