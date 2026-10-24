import { HERO_FX, SERVICE_FX, type ImageFx } from "@@/data/image-fx";

/** Photos already in the repo with measured overlays (see image-fx.ts). */
export const SERVICE_MEDIA: Record<string, { src: string; alt: string; fx: ImageFx }> = {
  singer: {
    src: "/images/home/slide-1.avif",
    alt: "Singer performing at a studio microphone with headphones on",
    fx: HERO_FX.singer,
  },
  console: {
    src: "/images/home/slide-2.avif",
    alt: "Mixing console in a recording studio control room",
    fx: HERO_FX.console,
  },
  workstation: {
    src: "/images/services/equipment-03.avif",
    alt: "Editing workstation with audio and video timelines on screen",
    fx: SERVICE_FX.workstation,
  },
  preamps: {
    src: "/images/services/equipment-02.avif",
    alt: "Rack of microphone preamps used for voice recording",
    fx: SERVICE_FX.preamps,
  },
};
