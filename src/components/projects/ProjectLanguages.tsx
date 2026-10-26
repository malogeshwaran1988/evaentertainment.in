import type { Project } from "@@/data/projects";

/**
 * Card meta "Telugu → Hindi": an arrow instead of the words "to", so a grid of 20 cards
 * does not repeat the "Telugu to Hindi" keyword (that phrase belongs to /dubbing/telugu-to-hindi).
 * Screen readers hear "Telugu into Hindi".
 */
export default function ProjectLanguages({ project }: { project: Pick<Project, "from" | "to"> }) {
  const targets = project.to ?? [];
  if (!targets.length) return <>{project.from}</>;
  return (
    <>
      {project.from} <span aria-hidden="true">→</span>
      <span className="sr-only"> into</span> {targets.join(", ")}
    </>
  );
}
