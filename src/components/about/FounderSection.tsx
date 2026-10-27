import Image from "next/image";
import Link from "@@/components/common/NavLink";
import { PosterPlaceholder } from "@@/components/projects/ProjectPoster";
import { Routes } from "@@/constants/routes";
import { FOUNDER } from "@@/data/founder";
import { getFounderWork } from "@@/lib/founder-work";
import { getFounder } from "@@/lib/founder-store";
import { projectPosterAlt } from "@@/lib/project-seo";
import styles from "./FounderSection.module.scss";

export default async function FounderSection() {
  const founder = await getFounder();
  const work = await getFounderWork(founder.featuredProjectIds);
  return (
    <section className={`block ${styles.founder}`} aria-labelledby="founder-heading">
      <div className="container">
        <h2 id="founder-heading" className={`text-center ${styles.heading}`}>
          <i className="icon icon-user" aria-hidden="true" />{FOUNDER.sectionTitle}
        </h2>
        <div className={styles.card}>
          <div className={styles.media}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={founder.photo}
              alt={founder.photoAlt}
              className={styles.photo}
              width={280}
              height={280}
              loading="lazy"
              decoding="async"
            />
            {founder.linkedinUrl ? (
              <a
                href={founder.linkedinUrl}
                className={`btn ${styles.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${founder.name} on LinkedIn (opens in a new tab)`}
              >
                <span>
                  <i className="icon icon-linkedin-logo" aria-hidden="true" />View LinkedIn profile
                </span>
              </a>
            ) : null}
          </div>
          <div>
            <h3 className={styles.name}>{founder.name}</h3>
            <p className={`p--lg theme-color ${styles.role}`}>{founder.title}</p>
            {founder.bio.filter(Boolean).map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            <ul className={styles.highlights}>
              {founder.highlights.map((h) => (
                <li key={h.label}>
                  <strong className="heading-as-h4">{h.value}</strong>{" "}
                  <span>{h.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {work.length > 0 ? (
          <div className={styles.recent}>
            <h3 id="founder-work-heading" className={styles.recentHeading}>
              <i className="icon icon-promotion-1" aria-hidden="true" />Recent work
            </h3>
            <ul className={styles.recentList} aria-labelledby="founder-work-heading">
              {work.map((p) => (
                <li key={p.id}>
                  <Link href={Routes.project(p.slug)} className={styles.recentItem}>
                    <span className={styles.recentPoster}>
                      {p.poster ? (
                        <Image
                          src={p.poster}
                          alt={projectPosterAlt(p)}
                          fill
                          sizes="(min-width: 992px) 200px, 40vw"
                          loading="lazy"
                          fetchPriority="low"
                        />
                      ) : (
                        <PosterPlaceholder title={p.title} />
                      )}
                    </span>
                    <span className={styles.recentTitle}>{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
