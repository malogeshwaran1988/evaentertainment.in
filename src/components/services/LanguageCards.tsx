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

/** Source → target language cards with native-script glyphs. Shared by every service page. */
export default function LanguageCards({ data }: { data: LanguageCardsData }) {
  const pair = data.groups.length === 2;
  return (
    <div className="eva-lang">
      <div className={`eva-lang-groups${pair ? " eva-lang-groups--pair" : ""}`}>
        {data.groups.map((g, gi) => (
          <div key={g.label} className="eva-lang-group-wrap">
            {pair && gi === 1 ? (
              <span className="eva-lang-arrow" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            ) : null}
            <div className="eva-lang-group" role="group" aria-label={g.label}>
              <h3 className="eva-lang-label">{g.label}</h3>
              <ul className="eva-lang-list">
                {g.codes.map((c, i) => {
                  const l = LANGS[c];
                  return (
                    <li key={c} className="eva-lang-item" style={{ ["--i" as string]: i }}>
                      <Reveal className="eva-lang-card">
                        <span className="eva-lang-glyph" lang={c} role="img" aria-label={`${l.name} (${l.script})`}>
                          {l.glyph}
                        </span>
                        <span className="eva-lang-name">{l.name}</span>
                        {g.main === c ? <span className="eva-lang-badge">Main language</span> : null}
                      </Reveal>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>
      {data.caption ? <p className="eva-lang-caption">{data.caption}</p> : null}
    </div>
  );
}
