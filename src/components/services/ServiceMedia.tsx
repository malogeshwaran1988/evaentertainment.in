import dynamic from "next/dynamic";
import Image from "next/image";
import ImageEffects from "@@/components/common/ImageEffects";
import BrandMark from "@@/components/common/BrandMark";
import ServiceVideo from "@@/components/services/ServiceVideo";
import LivePhoto from "@@/components/equipment/LivePhoto";
import SubtitleOverlay from "@@/components/services/SubtitleOverlay";
import { EQUIPMENT_ITEMS } from "@@/data/equipment";
import { SERVICE_MEDIA } from "@@/data/service-media";

// Only the voice-over page uses it: own chunk (still server-rendered) so other service pages skip its JS.
const VoiceShowcase = dynamic(() => import("@@/components/services/VoiceShowcase"));
// English language page (one-voice section) and any page that sets media hollywood-onevoice.
const OneVoiceShowcase = dynamic(() => import("@@/components/services/OneVoiceShowcase"));

/** One photo per topic, with its decorative overlay kept inside the same zoom stage. */
export default function ServiceMedia({ media, alt }: { media: string; alt: boolean }) {
  if (media.startsWith("live:")) {
    const item = EQUIPMENT_ITEMS.find((e) => e.id === media.slice(5));
    if (!item) return null;
    return (
      <figure className="eva-equipment-figure eva-svc-figure">
        <LivePhoto item={item} eager={false} alt={alt} />
      </figure>
    );
  }
  const m = SERVICE_MEDIA[media];
  if (!m) return null;
  return (
    <figure className="eva-svc-figure">
      <div
        className={`eva-svc-photo eva-fx-host${alt ? " eva-svc-photo--alt" : ""}`}
        style={{ aspectRatio: `${m.fx.width} / ${m.fx.height}` }}
      >
        <div className="eva-svc-photo-stage">
          {media === "hollywood-onevoice" ? (
            <OneVoiceShowcase />
          ) : m.showcase === "voices" ? (
            <VoiceShowcase />
          ) : m.video ? (
            <ServiceVideo video={m.video} poster={m.src} label={m.alt} sfx={m.sfx} />
          ) : (
            <>
              <Image src={m.src} alt={m.alt} fill sizes="(min-width: 992px) 55vw, 100vw" loading="lazy" fetchPriority="low" />
              <ImageEffects fx={m.fx} />
              <SubtitleOverlay id={media} />
              <BrandMark />
            </>
          )}
        </div>
      </div>
    </figure>
  );
}
