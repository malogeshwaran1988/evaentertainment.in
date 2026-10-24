import { PHOTO_FX, SERVICE_FX, type ImageFx } from "@@/data/image-fx";

/** `audio` labels a clip that carries its own soundtrack; it plays muted until the visitor turns sound on. */
export type ServiceVideo = {
  webm: string;
  mp4: string;
  audio?: string;
  /** Try to play with sound when in view; if the browser blocks it, play muted with a pulsing "Tap for sound" button. */
  autoSound?: boolean;
};
/** Optional sound effect looped in sync with a ServiceVideo; muted until the visitor turns it on. */
export type ServiceSfx = { webm: string; m4a: string; label: string };
export type ServicePhoto = { src: string; alt: string; fx: ImageFx; video?: ServiceVideo; sfx?: ServiceSfx; showcase?: "voices" };

const photo = (id: string, alt: string): ServicePhoto => ({
  src: `/images/services/svc-${id}.avif`,
  alt,
  fx: PHOTO_FX[id],
});

/** Photos with measured overlays (see image-fx.ts). Studio photos are our own generated images. */
export const SERVICE_MEDIA: Record<string, ServicePhoto> = {
  singer: photo("singer", "Indian male singer with headphones singing Hindi lyrics into a Rode condenser microphone"),
  console: photo("console", "Yamaha mixing console with lit level meters beside a Ganesha figurine and a cup of chai"),
  workstation: { src: "/images/services/equipment-03.avif", alt: "Editing workstation with audio and video timelines on screen", fx: SERVICE_FX.workstation },
  preamps: { src: "/images/services/equipment-02.avif", alt: "Rack of microphone preamps with level meters beside a Rode microphone", fx: SERVICE_FX.preamps },
  "dub-studio": photo("dub-studio", "Indian voice artist with headphones at a condenser microphone reading a script to a film on the booth monitor"),
  "dub-why": {
    src: "/media/dubbing/lipsync-poster.avif",
    alt: "Voice actor with headphones at a studio microphone, matching an emotional actor's lip movements on a projected screen",
    fx: { width: 960, height: 720, items: [] },
    video: { webm: "/media/dubbing/lipsync.webm", mp4: "/media/dubbing/lipsync.mp4", audio: "voice actor dubbing the scene" },
  },
  "foley-lead": {
    src: "/media/foley/foley-lead-poster.avif",
    alt: "Indian Foley artist in sandals stepping on gravel and wooden boards under a microphone, as the camera slowly reveals Foley props on the studio shelves",
    fx: { width: 4, height: 3, items: [] },
    // Footstep sounds placed on the measured foot impact frames.
    video: { webm: "/media/foley/foley-lead.webm", mp4: "/media/foley/foley-lead.mp4", audio: "footstep sounds", autoSound: true },
  },
  "foley-what": {
    src: "/media/foley/ball-poster.avif",
    alt: "Foley artist in a studio dropping a red ball that bounces on a wooden Foley table in front of a microphone",
    fx: { width: 16, height: 9, items: [] },
    // Sound generated together with the picture, so each bounce lands on its impact frame.
    video: { webm: "/media/foley/ball.webm", mp4: "/media/foley/ball.mp4", audio: "ball bounce sound" },
  },
  "foley-studio": {
    src: "/media/foley/glass-poster.avif",
    alt: "Foley artist dropping a glass that shatters on a concrete surface beside a condenser microphone",
    fx: { width: 16, height: 9, items: [] },
    // Sound generated together with the picture, so the shatter lands on the impact frame.
    video: { webm: "/media/foley/glass.webm", mp4: "/media/foley/glass.mp4", audio: "glass breaking sound" },
  },
  "mix-problems": photo("mix-problems", "Indian sound engineer at a compact mixing console with a Pro Tools session on screen"),
  "mix51-lead": photo("mix51-lead", "Compact 5.1 mixing room in Mumbai with a console and surround speakers around the mix seat"),
  "song-lead": photo("song-lead", "Indian singer with headphones recording a song at a large-diaphragm microphone in a vocal booth"),
  "song-session": photo("song-session", "Sitar player recording a take while an Indian engineer follows the session on the studio screens"),
  "song-studio": photo("song-studio", "Music studio in Mumbai with a mixing console, studio monitors and a keyboard"),
  "stock-curated": photo("stock-curated", "Indian music curator browsing a music library on a computer in a small studio"),
  "stock-lead": photo("stock-lead", "Music production room in Mumbai with a DAW session on screen and an on-air light"),
  "stock-voice": photo("stock-voice", "Two Indian voice artists recording a conversation at microphones in a small studio"),
  "sub-south": photo("sub-south", "Small preview theatre showing a South Indian film with subtitles on the screen"),
  "sub-together": photo("sub-together", "Indian editors checking subtitles against the film on an editing workstation"),
  "tr-languages": photo("tr-languages", "Indian translator writing a script by hand in several Indian languages"),
  "tr-transcreation": photo("tr-transcreation", "Indian writers reworking dialogue together around a table with notes and a laptop"),
  "translation-lead": photo("translation-lead", "Indian translator adapting a film script on a laptop beside a picture monitor"),
  "vo-studio": photo("vo-studio", "Indian voice-over artist reading a script at a microphone in a soundproof booth"),
  "vo-voices": {
    src: "/media/voices/male-poster.avif",
    alt: "Indian voice artists, a man, a woman and a child, speaking at a studio microphone",
    fx: { width: 4, height: 3, items: [] },
    showcase: "voices",
  },
};
