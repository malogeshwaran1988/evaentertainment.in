import type { ProjectInput } from "@@/data/projects";

/** Written to projects.json the first time the store is read. */
export const PROJECTS_SEED: ProjectInput[] = [
  {
    title: "Sardar 2",
    from: "Tamil",
    to: ["Telugu", "Malayalam", "Kannada", "Hindi"],
    category: "Movie Dubbing",
  },
  {
    title: "Dose",
    from: "Malayalam",
    to: ["Tamil", "Telugu"],
    category: "Movie Dubbing",
  },
  {
    title: "The Odyssey",
    from: "English",
    to: ["Tamil", "Telugu"],
    category: "Movie Dubbing",
  },
  {
    title: "Lenin",
    from: "Telugu",
    to: ["Tamil"],
    category: "Movie Dubbing",
  },
  {
    title: "Vaazha II",
    from: "Malayalam",
    to: ["Tamil", "Telugu", "Kannada", "Hindi"],
    category: "Movie Dubbing",
  },
  {
    title: "Kara",
    from: "Tamil",
    to: ["Malayalam", "Kannada"],
    category: "Movie Dubbing",
  },
  {
    title: "Mr X",
    from: "Tamil",
    to: ["Telugu", "Malayalam", "Kannada", "Hindi"],
    category: "Movie Dubbing",
  },
  {
    title: "Dacoit",
    from: "Telugu",
    to: ["Tamil", "Kannada"],
    category: "Movie Dubbing",
  },
  {
    title: "Biker",
    from: "Telugu",
    to: ["Tamil"],
    category: "Movie Dubbing",
  },
  {
    title: "Dhurandhar The Revenge",
    from: "Hindi",
    to: ["Tamil", "Kannada"],
    category: "Dubbing",
  },
  {
    title: "Euphoria",
    from: "Telugu",
    to: ["Tamil", "Hindi"],
    category: "Movie Dubbing",
  },
  {
    title: "Dhurandhar",
    from: "Hindi",
    to: ["Tamil"],
    category: "Movie Dubbing",
  },
];
