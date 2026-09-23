import type { LegalBlock, LegalSection } from "@@/data/legal";

type LegalDocProps = {
  effectiveDate: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
  disclaimer: string;
};

function LegalBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return <p key={`p-${index}`}>{block.text}</p>;
        }
        if (block.type === "h3") {
          return <h3 key={`h3-${index}`}>{block.text}</h3>;
        }
        return (
          <ul key={`ul-${index}`}>
            {block.items.map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>
        );
      })}
    </>
  );
}

export default function LegalDoc({
  effectiveDate,
  lastUpdated,
  intro,
  sections,
  disclaimer,
}: LegalDocProps) {
  return (
    <article className="eva-legal-doc">
      <p className="eva-legal-meta">
        Effective date: {effectiveDate}
        <br />
        Last updated: {lastUpdated}
      </p>
      <p>{intro}</p>
      {sections.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
          <h2 id={`${section.id}-heading`}>{section.title}</h2>
          <LegalBlocks blocks={section.blocks} />
        </section>
      ))}
      <p className="eva-legal-disclaimer">{disclaimer}</p>
    </article>
  );
}
