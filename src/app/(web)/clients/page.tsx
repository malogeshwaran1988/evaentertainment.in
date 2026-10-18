import type { Metadata } from "next";
import ComingSoon from "@@/components/common/ComingSoon";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT } from "@@/constants/constants";
import { Routes } from "@@/constants/routes";
import { CLIENTS_ENABLED } from "@@/lib/clients-enabled";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";

const DESCRIPTION =
  "Studios, OTT platforms and producers who trust EVA Entertainment, a dubbing and recording studio in Andheri West, Mumbai.";

export const metadata: Metadata = buildPageMetadata({
  title: "Our Clients | EVA Entertainment",
  description: DESCRIPTION,
  url: absoluteUrl(Routes.CLIENTS),
  ogImage: DEFAULT_OG_IMAGE,
  ogImageAlt: DEFAULT_OG_IMAGE_ALT,
  // Only indexable once the real showcase replaces "Coming soon".
  noindex: !CLIENTS_ENABLED,
});

export default function ClientsPage() {
  // The client showcase isn't built yet; CLIENTS_ENABLED only controls indexing/sitemap for now.
  return (
    <ComingSoon
      icon="icon-people"
      title="Our Clients"
      subtitle="The studios, platforms and producers we work with"
      href={Routes.CLIENTS}
      message="Our clients showcase is coming soon."
      detail="Meanwhile, browse the films and series we have dubbed, or talk to us about your project."
    />
  );
}
