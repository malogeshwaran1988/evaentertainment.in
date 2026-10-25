import Reveal from "@@/components/equipment/Reveal";
import LanguageCards from "@@/components/services/LanguageCards";
import ServiceMedia from "@@/components/services/ServiceMedia";
import FormatCards from "@@/components/services/FormatCards";
import dynamic from "next/dynamic";
import { inline, splitLabel } from "@@/components/services/RichText";
import type { RichBlock, ServicePageSection } from "@@/data/service-page-types";

// Only the 5.1 page uses it: split into its own chunk (still server-rendered) so other service pages skip its JS.
const SurroundExperience = dynamic(() => import("@@/components/services/SurroundExperience"));
// Only the translation page uses it.
const LanguagePairs = dynamic(() => import("@@/components/services/LanguagePairs"));

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Heading({ id, icon, text }: { id: string; icon: string; text: string }) {
  const words = text.split(" ");
  const cut = Math.max(1, words.length - 2);
  return (
    <h2 id={id} className="eva-svc-title">
      <i className={`icon ${icon}`} aria-hidden="true" /> {words.slice(0, cut).join(" ")}{" "}
      <span>{words.slice(cut).join(" ")}</span>
    </h2>
  );
}

function Blocks({ blocks }: { blocks: RichBlock[] }) {
  return blocks.map((b, i) => {
    if (b.t === "p") return <p key={i}>{inline(b.text)}</p>;
    if (b.t === "h3") return <h3 key={i}>{inline(b.text)}</h3>;
    const Tag = b.t === "ol" ? "ol" : "ul";
    return (
      <Tag key={i} className={b.t === "ul" ? "eva-svc-list" : "eva-svc-olist"}>
        {b.items.map((item) => (
          <li key={item.slice(0, 40)}>{inline(item)}</li>
        ))}
      </Tag>
    );
  });
}

type Card = { title: string; body: RichBlock[] };

/** h3 groups or a list whose items all start with a bold label, become cards. */
function toCards(blocks: RichBlock[]): { intro: RichBlock[]; cards: Card[]; outro: RichBlock[]; steps: boolean } | null {
  const firstH3 = blocks.findIndex((b) => b.t === "h3");
  if (firstH3 >= 0) {
    const cards: Card[] = [];
    for (const b of blocks.slice(firstH3)) {
      if (b.t === "h3") cards.push({ title: b.text, body: [] });
      else cards[cards.length - 1].body.push(b);
    }
    return { intro: blocks.slice(0, firstH3), cards, outro: [], steps: false };
  }
  const li = blocks.findIndex((b) => (b.t === "ul" || b.t === "ol") && b.items.length >= 3 && b.items.every((x) => splitLabel(x)));
  if (li < 0) return null;
  const list = blocks[li] as Extract<RichBlock, { items: string[] }>;
  return {
    intro: blocks.slice(0, li),
    cards: list.items.map((x) => {
      const s = splitLabel(x)!;
      return { title: s.title, body: s.body ? [{ t: "p", text: s.body }] : [] };
    }),
    outro: blocks.slice(li + 1),
    steps: list.t === "ol",
  };
}

export default function ServiceSections({ sections }: { sections: ServicePageSection[] }) {
  let mediaCount = 0;
  return sections.map((section) => {
    const id = `svc-${slugify(section.heading)}`;
    if (section.heading === "The mixing room" && section.media === "live:pro-tools") return <SurroundExperience key={id} headingId={id} />;
    if (section.media === "lang-pairs") {
      // First paragraph sits above the pairs; the rest follows them.
      const intro = section.blocks.slice(0, 1);
      const outro = section.blocks.slice(1);
      return (
        <section key={id} className="block eva-svc-section" aria-labelledby={id}>
          <div className="container">
            <Reveal className="eva-svc-copy eva-svc-copy--narrow">
              <Heading id={id} icon={section.icon} text={section.heading} />
              <Blocks blocks={intro} />
            </Reveal>
            <LanguagePairs />
            {outro.length ? (
              <div className="eva-svc-copy eva-svc-copy--narrow eva-lang-after">
                <Blocks blocks={outro} />
              </div>
            ) : null}
          </div>
        </section>
      );
    }
    // "Formats we deliver" style lists become visual file cards.
    const fmt = !section.media && /format|deliverable/i.test(section.heading) && section.blocks.length === 1 && section.blocks[0].t === "ul" ? section.blocks[0] : null;
    if (fmt && fmt.t === "ul") {
      return (
        <section key={id} className="block eva-svc-section" aria-labelledby={id}>
          <div className="container">
            <Reveal className="eva-svc-copy eva-svc-copy--narrow">
              <Heading id={id} icon={section.icon} text={section.heading} />
            </Reveal>
            <FormatCards items={fmt.items} />
          </div>
        </section>
      );
    }
    const cards = section.media ? null : toCards(section.blocks);
    if (cards) {
      const CardList = cards.steps ? "ol" : "ul";
      return (
        <section key={id} className="block block--darkbg eva-svc-section" aria-labelledby={id}>
          <div className="container">
            <Reveal className="eva-svc-head">
              <Heading id={id} icon={section.icon} text={section.heading} />
              {cards.intro.length ? <Blocks blocks={cards.intro} /> : null}
            </Reveal>
            <CardList className={`eva-service-points eva-svc-cards${cards.steps ? " eva-svc-cards--steps" : ""}`}>
              {cards.cards.map((c, i) => (
                <Reveal as="li" key={c.title} className="eva-service-point">
                  {cards.steps ? (
                    <span className="eva-svc-step" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  ) : null}
                  <h3>{inline(c.title)}</h3>
                  <Blocks blocks={c.body} />
                </Reveal>
              ))}
            </CardList>
            {cards.outro.length ? (
              <div className="eva-svc-outro">
                <Blocks blocks={cards.outro} />
              </div>
            ) : null}
          </div>
        </section>
      );
    }
    if (section.media) {
      const alt = mediaCount++ % 2 === 1;
      return (
        <section key={id} className="block eva-svc-section" aria-labelledby={id}>
          <div className="container">
            <div className={`eva-svc-split${alt ? " eva-svc-split--alt" : ""}`}>
              <Reveal className="eva-svc-split-media">
                <ServiceMedia media={section.media} alt={alt} />
              </Reveal>
              <Reveal className="eva-svc-copy">
                <Heading id={id} icon={section.icon} text={section.heading} />
                <Blocks blocks={section.blocks} />
              </Reveal>
            </div>
          </div>
        </section>
      );
    }
    return (
      <section key={id} className="block eva-svc-section" aria-labelledby={id}>
        <div className="container">
          <Reveal className="eva-svc-copy eva-svc-copy--narrow">
            <Heading id={id} icon={section.icon} text={section.heading} />
            {section.languages ? null : <Blocks blocks={section.blocks} />}
          </Reveal>
          {section.languages ? (
            <>
              <LanguageCards data={section.languages} />
              {section.blocks.length ? (
                <div className="eva-svc-copy eva-svc-copy--narrow eva-lang-after">
                  <Blocks blocks={section.blocks} />
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    );
  });
}
