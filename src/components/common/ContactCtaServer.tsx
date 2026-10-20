import ContactCta from "./ContactCta";
import { projectIsPublished } from "@@/data/projects";
import { getProjects } from "@@/lib/projects-store";

/** Server wrapper: builds the CTA language list (Hindi first) from published projects, read-only. */
export default async function ContactCtaServer() {
  let languages: string[] = ["Hindi"];
  try {
    const projects = (await getProjects()).filter(projectIsPublished);
    const seen = new Set<string>(["Hindi"]);
    for (const p of projects) {
      for (const l of [...(p.to ?? []), p.from]) {
        if (l && !seen.has(l)) {
          seen.add(l);
          languages.push(l);
        }
      }
    }
  } catch {
    languages = ["Hindi"];
  }
  return <ContactCta languages={languages} />;
}
