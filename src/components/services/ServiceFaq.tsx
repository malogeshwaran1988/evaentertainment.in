import type { Service } from "@@/data/services";

export default function ServiceFaq({ faqs }: { faqs: Service["faqs"] }) {
  return (
    <section className="block eva-service-faq" aria-labelledby="service-faq-title">
      <div className="container">
        <h2 id="service-faq-title" className="text-center">
          <i className="icon icon-quotation" aria-hidden="true" />
          Frequently Asked Questions
        </h2>
        <div className="eva-faq-list">
          {faqs.map((faq, i) => (
            <details key={faq.q} className="eva-faq-item" open={i === 0}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
