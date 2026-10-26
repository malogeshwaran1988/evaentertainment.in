import type { Metadata } from "next";
import JsonLd from "@@/components/common/JsonLd";
import Link from "@@/components/common/NavLink";
import PageHero from "@@/components/common/PageHero";
import { Routes } from "@@/constants/routes";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";
import { projectIsPublished } from "@@/data/projects";
import { getClients } from "@@/lib/clients-store";
import { projectHref } from "@@/lib/project-seo";
import { getProjects } from "@@/lib/projects-store";
import "@@/styles/routes/clients.scss";

const DESCRIPTION =
  "Studios, OTT platforms and producers who trust EVA Entertainment, a dubbing and recording studio in Andheri West, Mumbai. We dub Indian and Hollywood films.";

// Indexable (index, follow) and listed in sitemap.xml.
export const metadata: Metadata = buildPageMetadata({
  title: "Our Clients - Studios and OTT Platforms We Dub For | EVA",
  description: DESCRIPTION,
  url: absoluteUrl(Routes.CLIENTS),
  ogImage: "/images/og/clients.jpg",
  ogImageAlt: "EVA Entertainment producer shaking hands with a film producer in the studio client lounge",
});

/** Clients come from the admin store (Clients in /admin); falls back to the original list when the store is empty or unreachable. */
export default async function ClientsPage() {
  const [clients, projects] = await Promise.all([getClients(), getProjects()]);
  const published = projects.filter(projectIsPublished);
  const projectsOf = (id: string) => published.filter((p) => p.clientId === id);
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "EVA Entertainment clients",
    url: absoluteUrl(Routes.CLIENTS),
    numberOfItems: clients.length,
    itemListElement: clients.map((client, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Organization",
        name: client.name,
        logo: absoluteUrl(client.logo),
        ...(projectsOf(client.id).length
          ? { subjectOf: projectsOf(client.id).map((p) => ({ "@type": "Movie", name: p.title, url: absoluteUrl(projectHref(p.slug)) })) }
          : {}),
      },
    })),
  };
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <JsonLd id="clients-jsonld" data={schema} />
      <PageHero
        icon="icon-people"
        className="eva-coming-soon-hero"
        title="Our Clients"
        subtitle="The studios, platforms and producers we work with"
        trail={[{ label: "Our Clients", href: Routes.CLIENTS }]}
      />
      <section className="block eva-clients-block" aria-labelledby="clients-heading">
        <div className="container">
          <div className="eva-coming-soon-intro">
            <h2 id="clients-heading">
              <i className="icon icon-like" aria-hidden="true" />
              Trusted by <span>studios, platforms and producers</span>
            </h2>
            <p>
              EVA Entertainment dubs, mixes and records films, web series, animation and audiobooks for OTT
              platforms, broadcasters, audio publishers and producers. Below are the clients whose logos we can
              show. Where a client has a published project, its name links to that project page.
            </p>
          </div>
          <ul className="eva-clients-grid" aria-label="Our clients">
            {clients.map((client, i) => (
              <li key={client.id} id={`client-${client.id}`} className={`eva-clients-item${client.shape ? ` eva-clients-item--${client.shape}` : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised AVIF, served as-is */}
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  width={client.width}
                  height={client.height}
                  loading={i < 4 ? "eager" : "lazy"}
                  decoding="async"
                />
                <ClientName name={client.name} projects={projectsOf(client.id)} />
              </li>
            ))}
          </ul>
          <p className="eva-clients-more">
            See every title on <Link href={Routes.PROJECTS}>our projects</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}

/** Visible client name; it links to the client's project when there is one, or lists them all. */
function ClientName({ name, projects }: { name: string; projects: { slug: string; title: string }[] }) {
  if (projects.length === 1) {
    return (
      <p className="eva-clients-name">
        <Link href={projectHref(projects[0].slug)}>{name}</Link>
      </p>
    );
  }
  return (
    <>
      <p className="eva-clients-name">{name}</p>
      {projects.length > 1 ? (
        <ul className="eva-clients-projects" aria-label={`Projects for ${name}`}>
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={projectHref(p.slug)}>{p.title}</Link>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
