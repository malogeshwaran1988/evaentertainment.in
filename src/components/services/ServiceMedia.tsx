import Image from "next/image";
import ImageEffects from "@@/components/common/ImageEffects";
import LivePhoto from "@@/components/equipment/LivePhoto";
import { EQUIPMENT_ITEMS } from "@@/data/equipment";
import { SERVICE_MEDIA } from "@@/data/service-media";

/** One photo per topic, with its decorative overlay kept inside the same zoom stage. */
export default function ServiceMedia({ media, alt }: { media: string; alt: boolean }) {
  if (media.startsWith("live:")) {
    const item = EQUIPMENT_ITEMS.find((e) => e.id === media.slice(5));
    if (!item) return null;
    return (
      <figure className="eva-equipment-figure eva-svc-figure">
        <LivePhoto item={item} eager={false} alt={alt} />
        <figcaption>
          {item.caption}. Photo:{" "}
          <a href={item.credit.source} target="_blank" rel="noopener noreferrer">
            {item.credit.author}, {item.credit.license}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </figcaption>
      </figure>
    );
  }
  const m = SERVICE_MEDIA[media];
  if (!m) return null;
  return (
    <figure className={`eva-svc-figure${m.credit ? " eva-equipment-figure" : ""}`}>
      <div
        className={`eva-svc-photo eva-fx-host${alt ? " eva-svc-photo--alt" : ""}`}
        style={{ aspectRatio: `${m.fx.width} / ${m.fx.height}` }}
      >
        <div className="eva-svc-photo-stage">
          <Image src={m.src} alt={m.alt} fill sizes="(min-width: 992px) 55vw, 100vw" loading="lazy" />
          <ImageEffects fx={m.fx} />
        </div>
      </div>
      {m.credit && (
        <figcaption>
          Photo:{" "}
          <a href={m.credit.source} target="_blank" rel="noopener noreferrer">
            {m.credit.author}, {m.credit.license}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </figcaption>
      )}
    </figure>
  );
}
