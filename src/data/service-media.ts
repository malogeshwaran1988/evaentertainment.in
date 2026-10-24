import { HERO_FX, PHOTO_FX, SERVICE_FX, type ImageFx } from "@@/data/image-fx";

export type PhotoCredit = { author: string; license: string; source: string };
export type ServiceVideo = { webm: string; mp4: string };
/** Optional sound effect looped in sync with a ServiceVideo; muted until the visitor turns it on. */
export type ServiceSfx = { webm: string; m4a: string; label: string };
export type ServicePhoto = { src: string; alt: string; fx: ImageFx; credit?: PhotoCredit; video?: ServiceVideo; sfx?: ServiceSfx; showcase?: "voices" };

const C = "https://commons.wikimedia.org/";
const photo = (id: string, alt: string, author: string, license: string, source: string): ServicePhoto => ({
  src: `/images/services/svc-${id}.avif`,
  alt,
  fx: PHOTO_FX[id],
  credit: { author, license, source: source.startsWith("http") ? source : C + source },
});

/** Photos with measured overlays (see image-fx.ts). Licensed photos carry a visible credit. */
export const SERVICE_MEDIA: Record<string, ServicePhoto> = {
  singer: { src: "/images/home/slide-1.avif", alt: "Singer performing at a studio microphone with headphones on", fx: HERO_FX.singer },
  console: { src: "/images/home/slide-2.avif", alt: "Mixing console in a recording studio control room", fx: HERO_FX.console },
  workstation: { src: "/images/services/equipment-03.avif", alt: "Editing workstation with audio and video timelines on screen", fx: SERVICE_FX.workstation },
  preamps: { src: "/images/services/equipment-02.avif", alt: "Rack of microphone preamps used for voice recording", fx: SERVICE_FX.preamps },
  "dub-studio": photo("dub-studio", "Dubbing booth with a picture monitor, a condenser microphone and a script stand", "Andres Moreno", "CC BY 2.0", "wiki/File:Sala_de_doblaje.jpg"),
  "dub-why": {
    src: "/media/dubbing/lipsync-poster.avif",
    alt: "Voice actor with headphones at a studio microphone, matching an emotional actor's lip movements on a projected screen",
    fx: { width: 960, height: 720, items: [] },
    video: { webm: "/media/dubbing/lipsync.webm", mp4: "/media/dubbing/lipsync.mp4" },
  },
  "foley-lead": photo("foley-lead", "Foley artist in rubber boots performing footsteps on a Foley pit", "M.m.mayer", "CC BY-SA 3.0", "wiki/File:Ger%C3%A4uschemacher.jpg"),
  "foley-what": {
    src: "/media/foley/ball-poster.avif",
    alt: "Foley artist in a studio dropping a ball that bounces across the wooden floor in front of a microphone",
    fx: { width: 4, height: 3, items: [] },
    video: { webm: "/media/foley/ball.webm", mp4: "/media/foley/ball.mp4" },
    // Synthesised in-house with ffmpeg (no third-party audio), timed to the bounces in the clip.
    sfx: { webm: "/media/foley/ball-sfx.webm", m4a: "/media/foley/ball-sfx.m4a", label: "ball bounce sound" },
  },
  "foley-studio": {
    src: "/media/foley/glass-poster.avif",
    alt: "A glass dropped beside a condenser microphone shattering on the studio floor",
    fx: { width: 4, height: 3, items: [] },
    video: { webm: "/media/foley/glass.webm", mp4: "/media/foley/glass.mp4" },
    // Synthesised in-house with ffmpeg (no third-party audio), timed to the impact in the clip.
    sfx: { webm: "/media/foley/glass-sfx.webm", m4a: "/media/foley/glass-sfx.m4a", label: "glass breaking sound" },
  },
  "mix-problems": photo("mix-problems", "Engineer working at a large analogue mixing console in a control room", "Matt Girling", "CC BY-SA 3.0", "w/index.php?curid=24442256"),
  "mix51-lead": photo("mix51-lead", "Dolby Atmos mix room with a mixing console and surround and ceiling speakers", "TVN Group", "CC BY-SA 4.0", "wiki/File:2017_03_31_Dolby_Atmos_Studio_TVN_Group.jpg"),
  "song-lead": photo("song-lead", "Singer with headphones smiling at a large-diaphragm microphone in a vocal booth", "Gabriela Jelonek", "CC BY-SA 4.0", "w/index.php?curid=129542105"),
  "song-session": photo("song-session", "Musician recording a take while the engineer follows the session on a laptop", "Incase", "CC BY 2.0", "w/index.php?curid=27861554"),
  "song-studio": photo("song-studio", "Music studio with a mixing console, monitors, keyboards and a piano", "Ville Hyvönen", "CC BY-SA 2.0", "wiki/File:Greenhouse_Studios,_Reykjavik,_Iceland_(2017-05-08_16.21.10_by_Ville_Hyv%C3%B6nen).jpg"),
  "stock-curated": photo("stock-curated", "Shelves of a large record library", "Melikamp", "CC BY-SA 4.0", "w/index.php?curid=182010651"),
  "stock-lead": photo("stock-lead", "Music production room with a DAW session on screen and an on-air sign", "Xalo Mustafa", "CC BY-SA 4.0", "wiki/File:Diversity_Sounds_recording_studio_in_Ratingen,_Germany.jpg"),
  "stock-voice": photo("stock-voice", "Two people recording a conversation at microphones in a podcast studio", "JKizzieHumanities", "CC BY-SA 4.0", "w/index.php?curid=82198863"),
  "sub-south": photo("sub-south", "Cinema hall with rows of red seats facing the screen", "Fred Cherrygarden", "CC BY-SA 4.0", "w/index.php?curid=192989172"),
  "sub-together": photo("sub-together", "Editors reviewing a film with subtitles on the screen", "Fschoepf", "CC BY-SA 4.0", "wiki/File:Editing_of_You_Only_Die_Twice_%E2%80%93_Summer_2017.jpg"),
  "tr-languages": photo("tr-languages", "Museum board showing how the Tamil script developed over the centuries", "Yercaud-elango", "CC BY 4.0", "w/index.php?curid=170233248"),
  "tr-transcreation": photo("tr-transcreation", "Team arranging sticky notes on a table while reworking ideas", "Steveonmz", "CC BY-SA 4.0", "w/index.php?curid=61093066"),
  "translation-lead": photo("translation-lead", "Names handwritten in several Indian scripts", "Ramphrados", "CC BY-SA 3.0", "wiki/File:11_language_signature.JPG"),
  "vo-studio": photo("vo-studio", "Voice-over artist in a booth reading a script to picture", "Zingezang", "CC BY-SA 4.0", "wiki/File:Peter_de_Kroon_Voice-over.jpg"),
  "vo-voices": {
    src: "/media/voices/male-poster.avif",
    alt: "Indian voice artists, a man, a woman and a child, speaking at a studio microphone",
    fx: { width: 4, height: 3, items: [] },
    showcase: "voices",
  },
};
