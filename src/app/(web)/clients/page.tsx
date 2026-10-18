import type { Metadata } from "next";
import ComingSoon from "@@/components/common/ComingSoon";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT } from "@@/constants/constants";
import { Routes } from "@@/constants/routes";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";

const DESCRIPTION =
  "Studios, OTT platforms and producers who trust EVA Entertainment, a dubbing and recording studio in Andheri West, Mumbai.";

// Indexable (index, follow) and listed in sitemap.xml.
export const metadata: Metadata = buildPageMetadata({
  title: "Our Clients | EVA Entertainment",
  description: DESCRIPTION,
  url: absoluteUrl(Routes.CLIENTS),
  ogImage: DEFAULT_OG_IMAGE,
  ogImageAlt: DEFAULT_OG_IMAGE_ALT,
});

export default function ClientsPage() {
  return (
    <ComingSoon
      icon="icon-people"
      title="Our Clients"
      subtitle="The studios, platforms and producers we work with"
      href={Routes.CLIENTS}
      introHeading="Trusted by studios, platforms and producers"
      intro={
        <p>
          From our studio in Andheri West, Mumbai, EVA Entertainment dubs, records and mixes films, web
          series, animation and advertising for production houses, OTT platforms, broadcasters and
          independent creators. Our clients come to us for natural-sounding Hindi and regional dubbing,
          experienced voice artists, careful lip-sync and a dependable delivery schedule, and many have
          worked with us across several seasons and releases.
        </p>
      }
      message="Our client showcase is on its way"
      detail="Meanwhile, browse the films and series we have dubbed, or talk to us about your next project."
    />
  );
}
