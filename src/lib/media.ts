/**
 * Static site media (images, video) served from the public Cloudflare R2 bucket "eva-projects"
 * at NEXT_PUBLIC_MEDIA_BASE_URL (https://cdn.evaentertainment.in).
 *
 * media("/images/careers/careers-voice.avif") returns the R2 URL when that file's page group is in
 * MIGRATED_GROUPS, else the local /public path. Rollback for a group = remove it from the list
 * (only while its files are still in public/; a backup of every file is kept off-repo).
 *
 * R2 layout: eva/<page-slug>/..., eva/shared/<group>/... (files used on several pages).
 */
const FOLDERS: Record<string, { group: string; prefix: string }> = {
  "/images/careers/": { group: "careers", prefix: "eva/careers/" },
  "/images/partners/": { group: "careers", prefix: "eva/careers/" },
  "/images/about/": { group: "about-us", prefix: "eva/about-us/" },
  "/images/clients/": { group: "clients", prefix: "eva/shared/clients/" },
  "/images/equipment/": { group: "studio-equipment", prefix: "eva/studio-equipment/" },
  "/images/og/": { group: "og", prefix: "eva/shared/og/" },
  "/media/voices/": { group: "voice-over-studio", prefix: "eva/voice-over-studio/voices/" },
  "/media/onevoice/": { group: "dubbing", prefix: "eva/shared/onevoice/" },
};

/** Single files: local path -> [page group, R2 key]. */
const FILES: Record<string, [string, string]> = {
  "/images/common/eva-logo.avif": ["brand", "eva/shared/brand/eva-logo.avif"],
  "/images/common/footer-bg.avif": ["brand", "eva/shared/brand/footer-bg.avif"],
  "/images/common/header-bg.avif": ["brand", "eva/shared/brand/header-bg.avif"],
  "/images/home/block-bg-1.avif": ["home", "eva/home/block-bg-1.avif"],
  "/images/home/hero-foley.avif": ["home", "eva/home/hero-foley.avif"],
  "/images/home/hero-mix51.avif": ["home", "eva/home/hero-mix51.avif"],
  "/images/home/hero-voiceover.avif": ["home", "eva/home/hero-voiceover.avif"],
  "/images/home/projects-bg.avif": ["home", "eva/home/projects-bg.avif"],
  "/images/home/services-grid-1.avif": ["home", "eva/home/services-grid-1.avif"],
  "/images/home/services-grid-2.avif": ["home", "eva/home/services-grid-2.avif"],
  "/images/home/services-grid-3.avif": ["home", "eva/home/services-grid-3.avif"],
  "/images/home/services-grid-4.avif": ["home", "eva/home/services-grid-4.avif"],
  "/images/home/services-grid-5.avif": ["home", "eva/home/services-grid-5.avif"],
  "/images/home/services-grid-6.avif": ["home", "eva/home/services-grid-6.avif"],
  "/images/home/slide-1-iconic.avif": ["home", "eva/home/slide-1-iconic.avif"],
  "/images/home/slide-1.avif": ["home", "eva/home/slide-1.avif"],
  "/images/services/equipment-01.avif": ["dubbing-studio", "eva/dubbing-studio/equipment-01.avif"],
  "/images/services/equipment-02.avif": ["voice-over-studio", "eva/voice-over-studio/equipment-02.avif"],
  "/images/services/equipment-03.avif": ["shared-services", "eva/shared/services/equipment-03.avif"],
  "/images/services/equipment-05.avif": ["subtitling-services", "eva/subtitling-services/equipment-05.avif"],
  "/images/services/lp-en-hi.avif": ["dubbing", "eva/shared/language-pairs/lp-en-hi.avif"],
  "/images/services/lp-kn-hi.avif": ["dubbing", "eva/shared/language-pairs/lp-kn-hi.avif"],
  "/images/services/lp-ml-hi.avif": ["dubbing", "eva/shared/language-pairs/lp-ml-hi.avif"],
  "/images/services/lp-ta-hi.avif": ["dubbing", "eva/shared/language-pairs/lp-ta-hi.avif"],
  "/images/services/lp-te-hi.avif": ["dubbing", "eva/shared/language-pairs/lp-te-hi.avif"],
  "/images/services/lp-te-ta.avif": ["dubbing", "eva/shared/language-pairs/lp-te-ta.avif"],
  "/images/services/mixing-room-51-eva.avif": ["5-1-mixing-studio", "eva/5-1-mixing-studio/mixing-room-51-eva.avif"],
  "/images/services/svc-console.avif": ["home", "eva/home/svc-console.avif"],
  "/images/services/svc-dub-studio.avif": ["shared-services", "eva/shared/services/svc-dub-studio.avif"],
  "/images/services/svc-hollywood-lead.avif": ["shared-services", "eva/shared/services/svc-hollywood-lead.avif"],
  "/images/services/svc-hollywood-onevoice.avif": ["dubbing-studio", "eva/dubbing-studio/svc-hollywood-onevoice.avif"],
  "/images/services/svc-home-hollywood.avif": ["home", "eva/home/svc-home-hollywood.avif"],
  "/images/services/svc-home-panindia.avif": ["home", "eva/home/svc-home-panindia.avif"],
  "/images/services/svc-home-regional.avif": ["home", "eva/home/svc-home-regional.avif"],
  "/images/services/svc-home-three-cinemas.avif": ["home", "eva/home/svc-home-three-cinemas.avif"],
  "/images/services/svc-languages-artists.avif": ["dubbing", "eva/dubbing/svc-languages-artists.avif"],
  "/images/services/svc-languages-lead.avif": ["dubbing-studio", "eva/dubbing-studio/svc-languages-lead.avif"],
  "/images/services/svc-mix-problems.avif": ["5-1-mixing-studio", "eva/5-1-mixing-studio/svc-mix-problems.avif"],
  "/images/services/svc-mix51-lead.avif": ["5-1-mixing-studio", "eva/5-1-mixing-studio/svc-mix51-lead.avif"],
  "/images/services/svc-panindia-lead.avif": ["shared-services", "eva/shared/services/svc-panindia-lead.avif"],
  "/images/services/svc-panindia-mix.avif": ["shared-services", "eva/shared/services/svc-panindia-mix.avif"],
  "/images/services/svc-regional-adapt.avif": ["shared-services", "eva/shared/services/svc-regional-adapt.avif"],
  "/images/services/svc-regional-lead.avif": ["shared-services", "eva/shared/services/svc-regional-lead.avif"],
  "/images/services/svc-singer.avif": ["shared-services", "eva/shared/services/svc-singer.avif"],
  "/images/services/svc-song-lead.avif": ["shared-services", "eva/shared/services/svc-song-lead.avif"],
  "/images/services/svc-song-session.avif": ["shared-services", "eva/shared/services/svc-song-session.avif"],
  "/images/services/svc-song-studio.avif": ["song-recording-studio", "eva/song-recording-studio/svc-song-studio.avif"],
  "/images/services/svc-stock-curated.avif": ["stock-music-library", "eva/stock-music-library/svc-stock-curated.avif"],
  "/images/services/svc-stock-lead.avif": ["stock-music-library", "eva/stock-music-library/svc-stock-lead.avif"],
  "/images/services/svc-stock-voice.avif": ["stock-music-library", "eva/stock-music-library/svc-stock-voice.avif"],
  "/images/services/svc-sub-formats.avif": ["subtitling-services", "eva/subtitling-services/svc-sub-formats.avif"],
  "/images/services/svc-sub-south.avif": ["subtitling-services", "eva/subtitling-services/svc-sub-south.avif"],
  "/images/services/svc-sub-together.avif": ["subtitling-services", "eva/subtitling-services/svc-sub-together.avif"],
  "/images/services/svc-sub-workflow.avif": ["subtitling-services", "eva/subtitling-services/svc-sub-workflow.avif"],
  "/images/services/svc-tr-transcreation.avif": ["translation-services", "eva/translation-services/svc-tr-transcreation.avif"],
  "/images/services/svc-translation-delivery.avif": ["translation-services", "eva/translation-services/svc-translation-delivery.avif"],
  "/images/services/svc-translation-lead.avif": ["shared-services", "eva/shared/services/svc-translation-lead.avif"],
  "/images/services/svc-translation-screen-tv.avif": ["translation-services", "eva/translation-services/svc-translation-screen-tv.avif"],
  "/images/services/svc-translation-screen-web.avif": ["translation-services", "eva/translation-services/svc-translation-screen-web.avif"],
  "/images/services/svc-vo-studio.avif": ["voice-over-studio", "eva/voice-over-studio/svc-vo-studio.avif"],
  "/images/services/svc-vo-voices.avif": ["shared-services", "eva/shared/services/svc-vo-voices.avif"],
  "/media/dubbing/lipsync-poster.avif": ["dubbing-studio", "eva/dubbing-studio/lipsync-poster.avif"],
  "/media/dubbing/lipsync.mp4": ["dubbing-studio", "eva/dubbing-studio/lipsync.mp4"],
  "/media/dubbing/lipsync.webm": ["dubbing-studio", "eva/dubbing-studio/lipsync.webm"],
  "/media/foley/ball-poster.avif": ["foley-recording", "eva/foley-recording/ball-poster.avif"],
  "/media/foley/ball.mp4": ["foley-recording", "eva/foley-recording/ball.mp4"],
  "/media/foley/ball.webm": ["foley-recording", "eva/foley-recording/ball.webm"],
  "/media/foley/foley-lead-poster.avif": ["foley-recording", "eva/foley-recording/foley-lead-poster.avif"],
  "/media/foley/foley-lead.mp4": ["foley-recording", "eva/foley-recording/foley-lead.mp4"],
  "/media/foley/foley-lead.webm": ["foley-recording", "eva/foley-recording/foley-lead.webm"],
  "/media/foley/glass-poster.avif": ["foley-recording", "eva/foley-recording/glass-poster.avif"],
  "/media/foley/glass.mp4": ["foley-recording", "eva/foley-recording/glass.mp4"],
  "/media/foley/glass.webm": ["foley-recording", "eva/foley-recording/glass.webm"],
  "/media/song/sitar-ba-poster.avif": ["song-recording-studio", "eva/song-recording-studio/sitar-ba-poster.avif"],
  "/media/song/sitar-ba.mp4": ["song-recording-studio", "eva/song-recording-studio/sitar-ba.mp4"],
  "/media/song/sitar-ba.webm": ["song-recording-studio", "eva/song-recording-studio/sitar-ba.webm"],
  "/media/song/song-ba-poster.avif": ["song-recording-studio", "eva/song-recording-studio/song-ba-poster.avif"],
  "/media/song/song-ba.mp4": ["song-recording-studio", "eva/song-recording-studio/song-ba.mp4"],
  "/media/song/song-ba.webm": ["song-recording-studio", "eva/song-recording-studio/song-ba.webm"],
  "/media/surround/jet-sfx.mp3": ["5-1-mixing-studio", "eva/5-1-mixing-studio/jet-sfx.mp3"],
  "/media/surround/jet-sfx.webm": ["5-1-mixing-studio", "eva/5-1-mixing-studio/jet-sfx.webm"],
  "/media/surround/studio-51.mp4": ["5-1-mixing-studio", "eva/5-1-mixing-studio/studio-51.mp4"],
  "/media/surround/studio-51.webm": ["5-1-mixing-studio", "eva/5-1-mixing-studio/studio-51.webm"],
};

/** Page groups whose media is served from R2. */
export const MIGRATED_GROUPS: readonly string[] = [
  "careers", "about-us", "clients", "studio-equipment", "og",
  "subtitling-services", "translation-services", "stock-music-library", "shared-services",
  "dubbing", "dubbing-studio", "foley-recording", "song-recording-studio", "5-1-mixing-studio", "voice-over-studio",
  "home", "brand",
];

const DEFAULT_BASE = "https://cdn.evaentertainment.in";

export const mediaBaseUrl = () => (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || DEFAULT_BASE).replace(/\/$/, "");

export function media(localPath: string): string {
  const file = FILES[localPath];
  if (file) return MIGRATED_GROUPS.includes(file[0]) ? `${mediaBaseUrl()}/${file[1]}` : localPath;
  for (const [folder, { group, prefix }] of Object.entries(FOLDERS)) {
    // A bare folder ("/media/onevoice") maps to the prefix without its trailing slash.
    const bare = localPath === folder.slice(0, -1);
    if (bare || localPath.startsWith(folder)) {
      if (!MIGRATED_GROUPS.includes(group)) return localPath;
      return bare ? `${mediaBaseUrl()}/${prefix.slice(0, -1)}` : `${mediaBaseUrl()}/${prefix}${localPath.slice(folder.length)}`;
    }
  }
  return localPath;
}

/** Absolute URL for structured data: the R2 URL when migrated, else `${siteBase}${localPath}`. */
export function mediaAbsolute(localPath: string, siteBase: string): string {
  const m = media(localPath);
  return /^https?:\/\//.test(m) ? m : `${siteBase}${m}`;
}
