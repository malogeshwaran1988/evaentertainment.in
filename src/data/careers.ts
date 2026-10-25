import { APP_BASE_URL } from "@@/constants/constants";

export const CAREERS_PAGE_URL = `${APP_BASE_URL}/careers`;
export const CAREERS_OG_IMAGE = "/images/og/contact.jpg";
export const CAREERS_OG_IMAGE_ALT = "Microphone preamps in EVA Entertainment's studio rack";

export const CAREERS_SEO = {
  title: "Careers | Voice Artist and Dubbing Jobs at EVA Entertainment Mumbai",
  description:
    "Join EVA Entertainment in Mumbai. Apply for voice artist, dubbing artist, dubbing director and mixing engineer roles for Indian and Hollywood films.",
};

export const CAREERS_INTRO =
  "Bring your voice or your ears to Indian and Hollywood films. Send your resume and voice samples to apply.";

export const CAREERS_ROLES = [
  {
    title: "Voice artists",
    text: "English and Indian language voices for films, series, animation and ads. Every age and every range is welcome.",
  },
  {
    title: "Dubbing artists and directors",
    text: "Lip sync performers, dubbing directors and dialogue writers who keep the emotion of every scene.",
  },
  {
    title: "Mixing and sound engineers",
    text: "Engineers for dialogue editing, Foley, 5.1 mixing and final mastering in our Andheri West studios.",
  },
] as const;

/** Resume: PDF / DOC / DOCX. */
export const RESUME_ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
/** Voice samples: MP3 / WAV / M4A. */
export const VOICE_ACCEPT = ".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a";

/**
 * Vercel Hobby caps a function request body at about 4.5 MB. Files travel base64 inside JSON
 * (+33%), so all files together stay at or under 3 MB of raw data.
 */
export const RESUME_MAX_BYTES = 1024 * 1024;
export const VOICE_MAX_FILES = 3;
export const FILES_TOTAL_MAX_BYTES = 3 * 1024 * 1024;
export const CAREERS_MAX_BODY_BYTES = Math.ceil(FILES_TOTAL_MAX_BYTES * 1.37) + 64 * 1024;

export type Country = { code: string; name: string; dial: string };

/** India first (default); the rest in alphabetical order. */
export const COUNTRIES: Country[] = [
  { code: "IN", name: "India", dial: "+91" },
  ...([
    ["AE", "United Arab Emirates", "+971"], ["AF", "Afghanistan", "+93"], ["AR", "Argentina", "+54"],
    ["AU", "Australia", "+61"], ["AT", "Austria", "+43"], ["BD", "Bangladesh", "+880"],
    ["BE", "Belgium", "+32"], ["BH", "Bahrain", "+973"], ["BR", "Brazil", "+55"],
    ["BT", "Bhutan", "+975"], ["CA", "Canada", "+1"], ["CH", "Switzerland", "+41"],
    ["CN", "China", "+86"], ["DE", "Germany", "+49"], ["DK", "Denmark", "+45"],
    ["EG", "Egypt", "+20"], ["ES", "Spain", "+34"], ["FI", "Finland", "+358"],
    ["FJ", "Fiji", "+679"], ["FR", "France", "+33"], ["GB", "United Kingdom", "+44"],
    ["GR", "Greece", "+30"], ["HK", "Hong Kong", "+852"], ["ID", "Indonesia", "+62"],
    ["IE", "Ireland", "+353"], ["IL", "Israel", "+972"], ["IT", "Italy", "+39"],
    ["JP", "Japan", "+81"], ["KE", "Kenya", "+254"], ["KR", "South Korea", "+82"],
    ["KW", "Kuwait", "+965"], ["LK", "Sri Lanka", "+94"], ["MU", "Mauritius", "+230"],
    ["MV", "Maldives", "+960"], ["MX", "Mexico", "+52"], ["MY", "Malaysia", "+60"],
    ["NG", "Nigeria", "+234"], ["NL", "Netherlands", "+31"], ["NO", "Norway", "+47"],
    ["NP", "Nepal", "+977"], ["NZ", "New Zealand", "+64"], ["OM", "Oman", "+968"],
    ["PH", "Philippines", "+63"], ["PK", "Pakistan", "+92"], ["PL", "Poland", "+48"],
    ["PT", "Portugal", "+351"], ["QA", "Qatar", "+974"], ["RU", "Russia", "+7"],
    ["SA", "Saudi Arabia", "+966"], ["SE", "Sweden", "+46"], ["SG", "Singapore", "+65"],
    ["TH", "Thailand", "+66"], ["TR", "Turkey", "+90"], ["TT", "Trinidad and Tobago", "+1"],
    ["TZ", "Tanzania", "+255"], ["UG", "Uganda", "+256"], ["US", "United States", "+1"],
    ["VN", "Vietnam", "+84"], ["ZA", "South Africa", "+27"],
  ] as const)
    .map(([code, name, dial]) => ({ code, name, dial }))
    .sort((a, b) => a.name.localeCompare(b.name)),
];

export const DIAL_CODES = Array.from(new Set(COUNTRIES.map((c) => c.dial)));
export const countryByCode = (code: string) => COUNTRIES.find((c) => c.code === code);
