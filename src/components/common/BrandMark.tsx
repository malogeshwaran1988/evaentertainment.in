/**
 * EVA media brand standard (applies to every content image and video, current and future):
 * - a small EVA logo in the top-left corner (about 9% of the media width, soft shadow), and
 * - a very faint centred watermark (about 5% opacity).
 *
 * Drop <BrandMark /> as the last child of a positioned media frame (or wrap a bare <img> in
 * <span className="eva-brand-host">). It is decorative only: aria-hidden, pointer-events none,
 * absolutely positioned (no CLS) and loads the tiny logo lazily at low priority (never the LCP).
 * ServiceVideo adds it by default; set `burnedInBrand: true` on a clip whose footage already
 * carries the logo. Do not use it on logos, client logos, icons, avatars, film posters,
 * admin UI or OG/share images (those already carry the logo).
 */
const LOGO = "/images/common/eva-logo.avif";

export default function BrandMark() {
  return (
    <span className="eva-brandmark" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny pre-optimised AVIF, decorative */}
      <img className="eva-brandmark__corner" src={LOGO} alt="" width={480} height={240} loading="lazy" decoding="async" fetchPriority="low" />
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny pre-optimised AVIF, decorative */}
      <img className="eva-brandmark__wm" src={LOGO} alt="" width={480} height={240} loading="lazy" decoding="async" fetchPriority="low" />
    </span>
  );
}
