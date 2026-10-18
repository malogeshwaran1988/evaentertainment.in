import PageHero from "@@/components/common/PageHero";
import ThankYouContent from "@@/components/common/ThankYouContent";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT } from "@@/constants/constants";
import { Routes } from "@@/constants/routes";
import { buildPageMetadata, absoluteUrl } from "@@/lib/seo";
import { parseThankYouType } from "@@/lib/thank-you";

// Status page: noindex, follow; listed in NOINDEX_ROUTES so it never enters sitemap.xml.
// Canonical is the bare /thank-you, so ?type= variants never compete.
export const metadata = buildPageMetadata({
  title: "Thank You | EVA Entertainment",
  description: "Thank you for contacting EVA Entertainment.",
  url: absoluteUrl(Routes.THANK_YOU),
  ogImage: DEFAULT_OG_IMAGE,
  ogImageAlt: DEFAULT_OG_IMAGE_ALT,
  noindex: true,
});

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const type = parseThankYouType((await searchParams).type);
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
          <ThankYouContent type={type} />
        </div>
      </section>
    </main>
  );
}
