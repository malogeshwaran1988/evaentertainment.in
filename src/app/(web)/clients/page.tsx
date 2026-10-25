import type { Metadata } from "next";
import PageHero from "@@/components/common/PageHero";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT } from "@@/constants/constants";
import { Routes } from "@@/constants/routes";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";
import { getClients } from "@@/lib/clients-store";
import "@@/styles/routes/clients.scss";

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

/** Clients come from the admin store (Clients in /admin); falls back to the original list when the store is empty or unreachable. */
export default async function ClientsPage() {
  const clients = await getClients();
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <PageHero
        icon="icon-people"
        className="eva-coming-soon-hero"
        title="Our Clients"
        subtitle="The studios, platforms and producers we work with"
        trail={[{ label: "Our Clients", href: Routes.CLIENTS }]}
        schema={false}
      />
      <section className="block eva-clients-block" aria-labelledby="clients-heading">
        <div className="container">
          <div className="eva-coming-soon-intro">
            <h2 id="clients-heading">
              <i className="icon icon-like" aria-hidden="true" />
              Trusted by <span>studios, platforms and producers</span>
            </h2>
            <p>
              From our studio in Andheri West, Mumbai, EVA Entertainment dubs records and mixes films, web
              series, animation and advertising for production houses, OTT platforms, broadcasters and
              independent creators. Our clients come to us for natural-sounding Hindi and regional dubbing,
              experienced voice artists, careful lip-sync and a dependable delivery schedule and many have
              worked with us across several seasons and releases.
            </p>
          </div>
          <ul className="eva-clients-grid" aria-label="Our clients">
            {clients.map((client, i) => (
              <li key={client.id} className={`eva-clients-item${client.shape ? ` eva-clients-item--${client.shape}` : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised AVIF, served as-is */}
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  width={client.width}
                  height={client.height}
                  loading={i < 4 ? "eager" : "lazy"}
                  decoding="async"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
