import Link from "@@/components/common/NavLink";
import { SITE_NAME } from "@@/constants/constants";
import { Routes } from "@@/constants/routes";
import { PROJECT_LANGUAGES } from "@@/data/projects";
import {
  formatAudioHours,
  type ProjectImpactStats,
} from "@@/lib/project-stats";

type ProjectImpactStripProps = {
  stats: ProjectImpactStats;
  className?: string;
  /** When true, show a soft CTA to the portfolio (default on). */
  showCta?: boolean;
};

export default function ProjectImpactStrip({
  stats,
  className,
  showCta = true,
}: ProjectImpactStripProps) {
  const total = formatAudioHours(stats.totalAudioHours);
  const careDays = stats.careDays;
  const dayLabel = careDays === 1 ? "day" : "days";
  const languagesReached =
    stats.languageCount > 0 ? stats.languageCount : PROJECT_LANGUAGES.length;
  const languageRows =
    stats.hoursByLanguage.length > 0
      ? stats.hoursByLanguage
      : PROJECT_LANGUAGES.map((language) => ({ language, hours: 0 }));

  return (
    <section
      className={`eva-impact${className ? ` ${className}` : ""}`}
      aria-labelledby="eva-impact-title"
    >
      <div className="container">
        <h2 id="eva-impact-title" className="eva-impact-title">
          Stories brought home in every language
        </h2>
        <p className="eva-impact-lead">
          Performances shaped at {SITE_NAME} so each film lands in your language and feels like it
          was made for you.
        </p>

        <ul className="eva-impact-stats" aria-label="Dubbing impact">
          <li className="eva-impact-stat-card">
            <span className="eva-impact-stat-value">{total}</span>
            <span className="eva-impact-stat-label">Hours of dubbed audio</span>
          </li>
          <li className="eva-impact-stat-card">
            <span className="eva-impact-stat-value">{careDays.toLocaleString("en-IN")}</span>
            <span className="eva-impact-stat-label">
              {dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1)} of care without pause
            </span>
          </li>
          <li className="eva-impact-stat-card">
            <span className="eva-impact-stat-value">{languagesReached}</span>
            <span className="eva-impact-stat-label">Languages reached</span>
          </li>
        </ul>

        <ul className="eva-impact-chips" aria-label="Hours by language">
          {languageRows.map((row) => (
            <li key={row.language} className="eva-impact-chip">
              <span className="eva-impact-chip-lang">{row.language}</span>
              <span className="eva-impact-chip-hrs">
                {formatAudioHours(row.hours)} hrs
              </span>
            </li>
          ))}
        </ul>

        {showCta ? (
          <p className="eva-impact-cta">
            <Link className="btn" href={Routes.PROJECTS}>
              See our projects
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
