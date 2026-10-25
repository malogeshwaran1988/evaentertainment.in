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
export type ServicePhoto = {
  src: string;
  alt: string;
  fx: ImageFx;
  video?: ServiceVideo;
  sfx?: ServiceSfx;
  showcase?: "voices";
  /** Crisp HTML overlay drawn over the photo (see components/services). */
  overlay?: "translation-delivery";
};

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
  "stock-curated": photo("stock-curated", "Indian music curator in Mumbai playing a shortlist of tracks to a client from a laptop with the brief and a stopwatch on the table"),
  "stock-lead": photo("stock-lead", "Indian music editor in a Mumbai studio cutting a music track to an ad film edit on two monitors"),
  "stock-voice": photo("stock-voice", "Engineer raising the music fader on a mixing console while an Indian voice-over artist records in the booth behind the glass"),
  "sub-south": photo("sub-south", "Indian subtitler with a marked-up script watching a Telugu film in a preview theatre, a son touching his father's feet with a Hindi subtitle on the screen"),
  "sub-together": photo("sub-together", "Voice artist dubbing a Hindi family drama at a Neumann microphone while a subtitler times Hindi subtitles for the same scene in the control room"),
  "sub-workflow": photo("sub-workflow", "Indian subtitler timing an English subtitle to the dialogue waveform on a subtitle timeline, with cue blocks and timecodes under a web series scene"),
  "sub-formats": photo("sub-formats", "Laptop exporting SRT, VTT and STL subtitle files beside a hard drive, with an Indian TV series playing with Hindi subtitles on the wall TV"),
  "tr-transcreation": photo("tr-transcreation", "Indian writers reworking dialogue together around a table with notes and a laptop"),
  "translation-lead": {
    src: "/images/services/svc-translation-delivery.avif",
    alt: "Indian script writer in a Mumbai studio adapting a printed script into Hindi subtitles on a subtitle editor, with a film playing with Hindi subtitles on the wall TV and a streaming grid of movies and series beside it",
    fx: { width: 1440, height: 1080, items: [] },
    overlay: "translation-delivery",
  },
  "vo-studio": photo("vo-studio", "Indian voice-over artist reading a script at a microphone in a soundproof booth"),
  "vo-voices": {
    src: "/media/voices/male-poster.avif",
    alt: "Indian voice artists, a man, a woman and a child, speaking at a studio microphone",
    fx: { width: 4, height: 3, items: [] },
    showcase: "voices",
  },
};
