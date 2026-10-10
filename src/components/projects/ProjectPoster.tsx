import { SvgIcon } from "@@/components/common/Icons";
import { PROJECT_YEAR_ONGOING, projectYearLabel } from "@@/data/projects";

export function YearBadge({ year }: { year?: string }) {
  if (!year) return null;
  return (
    <span
      className={
        year === PROJECT_YEAR_ONGOING
          ? "eva-project-badge eva-project-badge--ongoing"
          : "eva-project-badge"
      }
    >
      {projectYearLabel(year)}
    </span>
  );
}

export function PosterPlaceholder({ title }: { title: string }) {
  return (
    <div className="eva-project-poster-placeholder" aria-hidden="true">
      <SvgIcon name="film" />
      <span>{title}</span>
    </div>
  );
}
