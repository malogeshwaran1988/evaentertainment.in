import Reveal from "@@/components/equipment/Reveal";
import { inline } from "@@/components/services/RichText";
import s from "./FormatCards.module.scss";

type Kind =
  | "dub"
  | "vo"
  | "srt"
  | "docs"
  | "surround"
  | "stems"
  | "me"
  | "voice"
  | "wav"
  | "loud"
  | "file";

/** Picks a preview from the words in each list item, so any "formats" list can reuse it. */
function kindOf(text: string): Kind {
  const t = text.toLowerCase();
  if (t.includes("dubbing script")) return "dub";
  if (t.includes("voice-over script")) return "vo";
  if (t.includes("subtitle") || t.includes("srt")) return "srt";
  if (t.includes("word") || t.includes("excel")) return "docs";
  if (t.includes("5.1") || t.includes("surround")) return "surround";
  if (t.includes("m&e")) return "me";
  if (t.includes("stems")) return "stems";
  if (t.includes("voice track")) return "voice";
  if (t.includes("wav")) return "wav";
  if (t.includes("loudness")) return "loud";
  return "file";
}

const TITLES: Record<Kind, string> = {
  dub: "Dubbing script",
  vo: "Voice-over script",
  srt: "Subtitle files",
  docs: "Documents",
  surround: "Surround and stereo",
  stems: "Stems",
  me: "M&E track",
  voice: "Voice tracks",
  wav: "WAV masters",
  loud: "Loudness ready",
  file: "Delivery file",
};

function Preview({ kind }: { kind: Kind }) {
  switch (kind) {
    case "dub":
      return (
        <div className={`${s.paper} ${s.script}`}>
          {[
            ["00:12:04", "RAVI", 70],
            ["00:12:07", "MEERA", 90],
            ["00:12:11", "RAVI", 55],
          ].map(([tc, who, w]) => (
            <div key={tc as string} className={s.row}>
              <span className={s.tc}>{tc}</span>
              <span className={s.who}>{who}</span>
              <span className={s.line} style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      );
    case "vo":
      return (
        <div className={`${s.paper} ${s.scenes}`}>
          {["Scene 1", "Scene 2"].map((n, i) => (
            <div key={n} className={s.scene}>
              <span className={s.tag}>{n}</span>
              <span className={s.line} style={{ width: i ? "75%" : "92%" }} />
              <span className={s.line} style={{ width: i ? "60%" : "68%" }} />
            </div>
          ))}
        </div>
      );
    case "srt":
      return (
        <div className={s.code}>
          <pre>
            {
              "1\n00:01:02,400 --> 00:01:04,900\nचलो, घर चलते हैं।\n\n2\n00:01:05,200 --> 00:01:07,000"
            }
          </pre>
          <div className={s.chips}>
            <span>SRT</span>
            <span>VTT</span>
            <span>STL</span>
          </div>
        </div>
      );
    case "docs":
      return (
        <div className={s.files}>
          <span className={`${s.file} ${s.word}`}>DOCX</span>
          <span className={`${s.file} ${s.excel}`}>XLSX</span>
          <span className={`${s.file} ${s.any}`}>+ yours</span>
        </div>
      );
    case "surround":
      return (
        <div className={s.channels}>
          {["L", "C", "R", "LS", "RS", "LFE"].map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      );
    case "stems":
    case "me":
      return (
        <div className={s.tracks}>
          {(kind === "me"
            ? ["Music", "Effects"]
            : ["Dialogue", "Music", "Effects"]
          ).map((t) => (
            <div key={t} className={s.track}>
              <span>{t}</span>
              <i />
            </div>
          ))}
        </div>
      );
    case "voice":
    case "loud":
      return (
        <div className={s.meter}>
          {Array.from({ length: 14 }, (_, i) => (
            <i key={i} style={{ height: `${30 + ((i * 37) % 60)}%` }} />
          ))}
          {kind === "loud" ? <b>-24 LUFS</b> : null}
        </div>
      );
    default:
      return (
        <div className={s.files}>
          <span className={`${s.file} ${s.any}`}>
            {kind === "wav" ? "WAV 48k / 24-bit" : "FILE"}
          </span>
        </div>
      );
  }
}

/** Card grid for "formats we deliver" style lists: mini previews of each file you receive. */
export default function FormatCards({ items }: { items: string[] }) {
  return (
    <Reveal className={s.wrap}>
      <ul className={`${s.grid} ${items.length > 4 ? s.three : ""}`}>
        {items.map((item) => {
          const kind = kindOf(item);
          return (
            <li key={item.slice(0, 40)} className={s.card}>
              <div className={s.preview} aria-hidden="true">
                <Preview kind={kind} />
              </div>
              <h3 className={s.title}>{TITLES[kind]}</h3>
              <p className={s.text}>{inline(item)}</p>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
