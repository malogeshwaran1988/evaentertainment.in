import Link from "@@/components/common/NavLink";
import PageHero from "@@/components/common/PageHero";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT } from "@@/constants/constants";
import { Routes, WHAT_WE_DO_HREF } from "@@/constants/routes";
import { buildPageMetadata, absoluteUrl } from "@@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Thank You | EVA Entertainment",
  description: "Your message was sent successfully to EVA Entertainment.",
  url: absoluteUrl(Routes.THANK_YOU),
  ogImage: DEFAULT_OG_IMAGE,
  ogImageAlt: DEFAULT_OG_IMAGE_ALT,
  noindex: true,
});

export default function ThankYouPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <PageHero
        icon="icon-like"
        title="Thank You"
        trail={[{ label: "Thank You", href: Routes.THANK_YOU }]}
        schema={false}
      />
      <section className="block">
        <div className="container text-center">
          <p className="p--lg">Your message was sent successfully. We will get back to you soon.</p>
          <div className="eva-service-actions eva-thank-you-actions">
            <Link href={Routes.HOME} className="btn btn--border">
              <span>Back to Home</span>
            </Link>
            <Link href={WHAT_WE_DO_HREF} className="btn">
              <span>Explore our services</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
