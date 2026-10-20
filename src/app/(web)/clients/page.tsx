import type { Metadata } from "next";
import Link from "@@/components/common/NavLink";
import PageHero from "@@/components/common/PageHero";
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

type Client = { name: string; src: string; width: number; height: number };

/** Logos live in /public/images/clients (AVIF, ≤600px wide, transparent where the source allows). */
const CLIENTS: Client[] = [
  { name: "JioCinema", src: "/images/clients/jiocinema.avif", width: 300, height: 300 },
  { name: "Angel TV", src: "/images/clients/angel.avif", width: 344, height: 300 },
  { name: "ETV Bal Bharat", src: "/images/clients/etv-bal-bharat.avif", width: 454, height: 300 },
  { name: "Sony Pictures Networks", src: "/images/clients/sony-pictures-networks.avif", width: 261, height: 300 },
  { name: "Viacom18", src: "/images/clients/viacom18.avif", width: 600, height: 115 },
  { name: "MX Player MX Gold", src: "/images/clients/mx-gold.avif", width: 600, height: 153 },
  { name: "Storytel", src: "/images/clients/storytel.avif", width: 492, height: 300 },
  { name: "Jumbaya", src: "/images/clients/jumbaya.avif", width: 600, height: 216 },
];

export default function ClientsPage() {
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
            <h2 id="clients-heading" className="h--md">
              Trusted by studios, platforms and producers
            </h2>
            <p>
              From our studio in Andheri West, Mumbai, EVA Entertainment dubs, records and mixes films, web
              series, animation and advertising for production houses, OTT platforms, broadcasters and
              independent creators. Our clients come to us for natural-sounding Hindi and regional dubbing,
              experienced voice artists, careful lip-sync and a dependable delivery schedule, and many have
              worked with us across several seasons and releases.
            </p>
          </div>
          <ul className="eva-clients-grid" aria-label="Our clients">
            {CLIENTS.map((client, i) => (
              <li key={client.src} className="eva-clients-item">
                {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised AVIF, served as-is */}
                <img
                  src={client.src}
                  alt={`${client.name} logo`}
                  width={client.width}
                  height={client.height}
                  loading={i < 4 ? "eager" : "lazy"}
                  decoding="async"
                />
              </li>
            ))}
          </ul>
          <div className="eva-clients-cta">
            <Link className="btn" href={Routes.PROJECTS}>
              <span>Our projects</span>
            </Link>
            <Link className="btn btn--border" href={Routes.CONTACT}>
              <span>Contact us</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
