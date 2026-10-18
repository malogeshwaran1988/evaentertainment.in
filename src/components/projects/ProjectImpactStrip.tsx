import { SITE_NAME } from "@@/constants/constants";
import { PROJECT_LANGUAGES } from "@@/data/projects";
import {
  formatAudioHours,
  type ProjectImpactStats,
} from "@@/lib/project-stats";

type ProjectImpactStripProps = {
  stats: ProjectImpactStats;
  className?: string;
};

export default function ProjectImpactStrip({
  stats,
  className,
}: ProjectImpactStripProps) {
  const total = formatAudioHours(stats.totalAudioHours);
  const moreLanguageCount = Math.max(
    0,
    stats.languageCount - stats.hoursByLanguage.length,
  );
  const languageRows =
    stats.hoursByLanguage.length > 0
      ? stats.hoursByLanguage
      : PROJECT_LANGUAGES.map((language) => ({ language, hours: 0 }));
  const languageLine = languageRows
    .map((row) => `${row.language} ${formatAudioHours(row.hours)} hrs`)
    .join(" · ");

  return (
    <section
      className={`eva-impact${className ? ` ${className}` : ""}`}
      aria-labelledby="eva-impact-title"
    >
      <div className="container">
        <h2 id="eva-impact-title" className="eva-impact-title">
          Stories brought home in every language
        </h2>
        <p className="eva-impact-stat">
          <span className="eva-impact-stat-num">{total}</span> hours of dubbed audio
        </p>
        <p className="eva-impact-copy">
          That’s the care of{" "}
          <strong>{stats.careDays.toLocaleString("en-IN")} days</strong> without pause —
          performances shaped at {SITE_NAME} so each film lands in your language and feels like it
          was made for you.
        </p>
        <p className="eva-impact-langs">
          {languageLine}
          {stats.hoursByLanguage.length > 0 && moreLanguageCount > 0
            ? ` · and ${moreLanguageCount} more`
            : null}
        </p>
      </div>
    </section>
  );
}
