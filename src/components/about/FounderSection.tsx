import { FOUNDER } from "@@/data/founder";
import styles from "./FounderSection.module.scss";

export default function FounderSection() {
  return (
    <section className={styles.founder} aria-labelledby="founder-heading">
      <div className={styles.inner}>
        <h2 id="founder-heading" className={styles.heading}>
          {FOUNDER.sectionTitle}
        </h2>
        <div className={styles.card}>
          <div className={styles.media}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FOUNDER.photo}
              alt={FOUNDER.photoAlt}
              className={styles.photo}
              width={280}
              height={280}
              loading="lazy"
              decoding="async"
            />
            {FOUNDER.linkedinUrl ? (
              <a
                href={FOUNDER.linkedinUrl}
                className={styles.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${FOUNDER.name} on LinkedIn (opens in a new tab)`}
              >
                <i className="icon icon-linkedin-logo" aria-hidden="true" />
                View LinkedIn profile
              </a>
            ) : null}
          </div>
          <div>
            <h3 className={styles.name}>{FOUNDER.name}</h3>
            <p className={styles.role}>{FOUNDER.title}</p>
            {FOUNDER.bio.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            <ul className={styles.highlights}>
              {FOUNDER.highlights.map((h) => (
                <li key={h.label}>
                  <strong>{h.value}</strong>
                  <span>{h.label}</span>
                </li>
              ))}
            </ul>
            {FOUNDER.notableWork.length > 0 ? (
              <p className={styles.work}>
                <strong>Recent Hindi dubbing work: </strong>
                {FOUNDER.notableWork.join(", ")}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
