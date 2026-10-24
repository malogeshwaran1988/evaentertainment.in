import Reveal from "@@/components/equipment/Reveal";
import type { LanguageCode, LanguageCardsData } from "@@/data/service-page-types";

const LANGS: Record<LanguageCode, { name: string; glyph: string; script: string }> = {
  te: { name: "Telugu", glyph: "అ", script: "Telugu script" },
  ta: { name: "Tamil", glyph: "த", script: "Tamil script" },
  ml: { name: "Malayalam", glyph: "മ", script: "Malayalam script" },
  kn: { name: "Kannada", glyph: "ಕ", script: "Kannada script" },
  hi: { name: "Hindi", glyph: "हि", script: "Devanagari script" },
  en: { name: "English", glyph: "A", script: "Latin script" },
};

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

/** Source → target language cards with native-script glyphs, in a framed panel.
 *  Shared by every service page that lists languages. */
export default function LanguageCards({ data }: { data: LanguageCardsData }) {
  const pair = data.groups.length === 2;
  const stat = pair
    ? `${plural(data.groups[0].codes.length, "source language")} · ${plural(data.groups[1].codes.length, "target language")}`
    : plural(data.groups[0]?.codes.length ?? 0, "language");
  let n = 0;
  const group = (g: LanguageCardsData["groups"][number], side: string) => (
    <div className={`eva-lang-group eva-lang-group--${side}`} role="group" aria-labelledby={`eva-lang-${side}`}>
      <h3 id={`eva-lang-${side}`} className="eva-lang-label">{g.label}</h3>
      <ul className={`eva-lang-list${g.main ? " eva-lang-list--main" : ""}`}>
        {g.codes.map((c) => {
          const l = LANGS[c];
          const main = g.main === c;
          return (
            <li key={c} className={`eva-lang-item${main ? " eva-lang-item--main" : ""}`} style={{ ["--i" as string]: n++ }}>
              <Reveal className="eva-lang-card">
                <span className="eva-lang-glyph" lang={c} role="img" aria-label={`${l.name} (${l.script})`}>
                  {l.glyph}
                </span>
                <span className="eva-lang-text">
                  <span className="eva-lang-name">{l.name}</span>
                  {main ? <span className="eva-lang-badge">Main language</span> : null}
                </span>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
  return (
    <Reveal className={`eva-lang${pair ? " eva-lang--pair" : ""}`}>
      <p className="eva-lang-stat">{stat}</p>
      <div className="eva-lang-groups">
        {group(data.groups[0], "a")}
        {pair ? (
          <>
            <div className="eva-lang-flow" aria-hidden="true">
              <span className="eva-lang-flow-label">Dubbed into</span>
              <span className="eva-lang-flow-track">
                <span className="eva-lang-flow-dot" />
                <span className="eva-lang-flow-dot" />
                <span className="eva-lang-flow-dot" />
              </span>
              <svg className="eva-lang-flow-arrow" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
            {group(data.groups[1], "b")}
          </>
        ) : null}
      </div>
      {data.caption ? (
        <p className="eva-lang-caption">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 5h18v12H8l-5 4z" />
            <path d="M8 10h8M8 13h5" />
          </svg>
          <span>{data.caption}</span>
        </p>
      ) : null}
    </Reveal>
  );
}
