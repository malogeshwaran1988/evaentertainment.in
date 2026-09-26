import { Film } from "lucide-react";
import { projectLanguageLine, projectPosterAlt, type ProjectLanguage } from "@@/data/projects";
import { cn } from "@@/lib/utils";

type ProjectCardPreviewProps = {
  title: string;
  from: ProjectLanguage | "";
  to: ProjectLanguage[];
  category: string;
  poster?: string;
  posterAlt?: string;
  className?: string;
};

const RALEWAY = "font-['Raleway',sans-serif]";

/**
 * Tailwind copy of the public `.eva-project-card` (src/styles/globals.scss), because admin
 * pages can't load the website CSS. Keep the two in sync.
 */
export default function ProjectCardPreview({
  title,
  from,
  to,
  category,
  poster,
  posterAlt,
  className,
}: ProjectCardPreviewProps) {
  const name = title.trim();
  const languages = from && to.length ? projectLanguageLine({ from, to }) : "";

  return (
    <div className={cn("flex justify-center rounded-lg bg-[#181818] p-6", RALEWAY, className)}>
      <div className="w-[200px] text-left">
        <div className="relative mb-4 aspect-[2/3] overflow-hidden bg-[#13161d]">
          {poster ? (
            // Blob URLs and fresh uploads can't go through next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={projectPosterAlt({ title: name || "Project", posterAlt: posterAlt?.trim() })}
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 border border-white/[0.08] bg-[linear-gradient(160deg,#26282f_0%,#13161d_100%)] p-4 text-center text-white/85"
              aria-hidden="true"
            >
              <Film className="size-8 text-[#70b615]" />
              <span className="text-[15px] font-semibold uppercase leading-[1.3] tracking-[0.04em]">
                {name || "Project name"}
              </span>
            </div>
          )}
        </div>
        <p
          className={cn(
            "mb-1 text-sm font-bold uppercase leading-[1.4]",
            name ? "text-white" : "text-white/40",
          )}
        >
          {name || "Project name"}
        </p>
        <p className={cn("text-sm leading-normal", languages ? "text-white/[0.72]" : "text-white/40")}>
          {languages || "Source to target languages"}
        </p>
        <p className="text-sm leading-normal text-white/[0.72]">{category}</p>
      </div>
    </div>
  );
}
