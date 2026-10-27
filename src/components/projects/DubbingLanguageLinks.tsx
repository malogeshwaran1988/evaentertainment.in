import Link from "@@/components/common/NavLink";

export type DubbingLanguageLink = {
  label: string;
  href: string;
  keyword?: string;
};

type Props = {
  languages: readonly DubbingLanguageLink[];
  heading?: string;
  /** Extra lead line under the heading. */
  intro?: string;
  section?: boolean;
  id?: string;
};

/**
 * Crawlable list of live /dubbing-studio/<lang> pages.
 * Empty when no language has published target credits (never emits 404 links).
 */
export default function DubbingLanguageLinks({
  languages,
  heading = "Languages we dub for",
  intro,
  section = true,
  id = "dubbing-languages",
}: Props) {
  if (!languages.length) return null;
  const body = (
    <nav aria-labelledby={id}>
      <h2 id={id} className="eva-svc-title">
        <i className="icon icon-translate2" aria-hidden="true" />
        {heading}
      </h2>
      {intro ? <p>{intro}</p> : null}
      <ul className="eva-svc-list">
        {languages.map((lang) => (
          <li key={lang.href}>
            <Link href={lang.href}>{lang.keyword ?? `${lang.label} dubbing and voice-over`}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
  if (!section) return body;
  return (
    <section className="block eva-svc-section" aria-labelledby={id}>
      <div className="container">{body}</div>
    </section>
  );
}
