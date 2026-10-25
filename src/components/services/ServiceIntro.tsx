import Image from "next/image";
import Link from "@@/components/common/NavLink";
import ImageEffects from "@@/components/common/ImageEffects";
import BrandMark from "@@/components/common/BrandMark";
import InViewFx from "@@/components/common/InViewFx";
import { Routes } from "@@/constants/routes";
import type { Service } from "@@/data/services";
import { imageLoading } from "@@/lib/image-loading";

/** Copy beside a half-width photo (the original Services page layout). */
export default function ServiceIntro({ service }: { service: Service }) {
  return (
    <section className="block bottom-null" aria-labelledby="service-intro-title">
      <div className="container">
        <div className="row row--half">
          <InViewFx className="half-bg-right eva-fx-host eva-fx-lazy">
            <Image
              src={service.image}
              alt={service.alt}
              fill
              {...imageLoading(0)}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="eva-half-bg-img"
            />
            <ImageEffects fx={service.fx} anchor="top-left" />
            <BrandMark />
          </InViewFx>
          <div className="col-sm-6">
            <h2 id="service-intro-title" className="text-uppercase heading-as-h5">
              <span className="theme-color">{service.introHeading}</span>
            </h2>
            <div className="marker-list">
              {service.intro.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
              {service.extra ? (
                <>
                  <h3 className="heading-as-h4">{service.extra.heading}</h3>
                  {service.extra.paragraphs.map((p) => (
                    <p key={p.slice(0, 48)}>{p}</p>
                  ))}
                </>
              ) : null}
            </div>
            <div className="eva-service-actions">
              <Link href={Routes.CONTACT} className="btn">
                <span>
                  <i className="icon icon-mail" aria-hidden="true" />
                  Get a quote
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
