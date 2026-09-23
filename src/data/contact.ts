import { APP_BASE_URL, DEFAULT_OG_IMAGE } from "@@/constants/constants";

export const CONTACT_PAGE_URL = `${APP_BASE_URL}/contact`;
export const CONTACT_OG_IMAGE = DEFAULT_OG_IMAGE;

export const CONTACT_SEO = {
  title: "Contact | Recording Studio Andheri Mumbai",
  description:
    "Contact EVA Entertainment in Andheri West, Mumbai for booking, dubbing, and localization inquiries. Call +91 8652063177 or email info@evaentertainment.in.",
};

export const CONTACT_INTRO =
  "Reach EVA Entertainment for studio booking, dubbing, and localization. Our Andheri West team is ready to help.";

export const MAP_EMBEDS = [
  {
    title: "Andheri West — Studio",
    heading: "Andheri West — Studio",
    address:
      "No.228, 2nd Floor, Mohid Heights, Near RTO Office, Opp Four Bungalows, Andheri(W) Mumbai-400053.",
    src: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3769.390711031632!2d72.8219338!3d19.1343673!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b78a886f9841%3A0x1986622af6ddf053!2sEVA%20ENTERTAINMENT!5e0!3m2!1sen!2sin!4v1663518158496!5m2!1sen!2sin",
  },
  {
    title: "Andheri West — Office",
    heading: "Andheri West — Office",
    address:
      "No.228, 2nd Floor, Mohid Heights, Near RTO Office, Opp Four Bungalows, Andheri(W) Mumbai-400053.",
    src: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3769.3191019881256!2d72.828406!3d19.1375043!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b7f62dae04c5%3A0xf65ba48a9ac5e5d0!2sEVA%20ENTERTAINMENT!5e0!3m2!1sen!2sin!4v1663518434632!5m2!1sen!2sin",
  },
] as const;
