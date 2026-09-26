import type { Metadata } from "next";
import Script from "next/script";
import { connection } from "next/server";
import Breadcrumbs from "@@/components/common/Breadcrumbs";
import ProjectsGallery from "@@/components/projects/ProjectsGallery";
import { getProjects } from "@@/lib/projects-store";
import {
  PROJECT_LANGUAGES,
  PROJECTS_OG_IMAGE,
  PROJECTS_PAGE_URL,
  PROJECTS_SEO,
} from "@@/data/projects";
import { SITE_NAME } from "@@/constants/constants";

export const metadata: Metadata = {
  title: { absolute: PROJECTS_SEO.title },
  description: PROJECTS_SEO.description,
  alternates: { canonical: PROJECTS_PAGE_URL },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: PROJECTS_SEO.title,
    description: PROJECTS_SEO.description,
    url: PROJECTS_PAGE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: PROJECTS_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: PROJECTS_SEO.title,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PROJECTS_SEO.title,
    description: PROJECTS_SEO.description,
    images: [PROJECTS_OG_IMAGE],
  },
};

export default async function ProjectsPage() {
  // Read at request time: projects.json lives on the server and changes from the admin panel.
  await connection();
  const projects = await getProjects();
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PROJECTS_SEO.title,
    description: PROJECTS_SEO.description,
    url: PROJECTS_PAGE_URL,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: { "@type": "Movie", name: project.title },
      })),
    },
  };

  return (
    <main className="page-main">
      <Script
        id="projects-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="block block--title block--darkbg eva-projects-hero">
        <div className="container">
          <div className="text-center">
            <h1>
              <i className="fas fa-film" aria-hidden="true" />
              Our Projects
            </h1>
            <Breadcrumbs current="Our Projects" />
          </div>
        </div>
      </div>

      <section
        className="block block--darkbg eva-projects"
        aria-label="Project portfolio"
      >
        <div className="container">
          <ProjectsGallery projects={projects} languages={PROJECT_LANGUAGES} />
        </div>
      </section>
    </main>
  );
}
