import type { Service } from "@@/data/services";

/** "Why EVA" points plus the "Ideal for" list, on the dark background. */
export default function ServiceHighlights({ service }: { service: Service }) {
  return (
    <section className="block block--darkbg eva-service-highlights" aria-labelledby="service-why-title">
      <div className="container">
        <h2 id="service-why-title" className="text-center">
          <i className="icon icon-like" aria-hidden="true" />Why EVA Entertainment
        </h2>
        <ul className="eva-service-points">
          {service.highlights.map((h) => (
            <li key={h.title} className="eva-service-point">
              <h3 className="eva-wwd-title">{h.title}</h3>
              <p className="eva-wwd-text">{h.text}</p>
            </li>
          ))}
        </ul>

        <h3 className="eva-service-ideal-title text-center">Ideal for</h3>
        <ul className="eva-service-tags">
          {service.idealFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
