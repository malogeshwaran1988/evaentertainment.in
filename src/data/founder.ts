/**
 * Founder section on /about-us. Edit everything here.
 *
 * Sources (checked 20 Oct 2026):
 * - Name, Mumbai and "Proprietor @ EVA Entertainment since Jun 2018", skills in sound engineering:
 *   https://www.linkedin.com/in/felix-anthony-5b1114173/
 * - Name as the studio contact: https://evaentertainment.in/ (footer)
 * - Notable work: titles on https://evaentertainment.in/our-projects
 *
 * Placeholders: the photo is an initials avatar (replace public/images/about/founder.avif
 * with an approved photo). The bio is written only from the facts above; replace it with
 * Felix's own words when available. Set linkedinUrl to "" to hide the button.
 */
export const FOUNDER = {
  sectionTitle: "Meet the Founder",
  name: "Felix Anthony",
  title: "Founder & Proprietor, EVA Entertainment",
  photo: "/images/about/founder.avif",
  photoAlt: "Felix Anthony, founder of EVA Entertainment",
  photoIsPlaceholder: true,
  linkedinUrl: "https://www.linkedin.com/in/felix-anthony-5b1114173/",
  bio: [
    "Felix Anthony has led EVA Entertainment from its studio in Andheri West, Mumbai, since 2018.",
    "With a background in sound engineering, he oversees the studio's lip-sync dubbing, voice-over and post-production work for film and streaming clients.",
  ],
  highlights: [
    { value: "Since 2018", label: "Leading EVA Entertainment" },
    { value: "Sound engineering", label: "Core expertise" },
    { value: "Mumbai", label: "Andheri West studio" },
  ],
  notableWork: ["Mass Jathara", "Thammudu", "Annapoorni", "Tenant"],
} as const;
