import Link from "next/link";
import { Routes } from "@@/constants/routes";

export default function NotFoundContent() {
  return (
    <main className="page-main">
      <section
        className="block block--title block--darkbg eva-404"
        aria-labelledby="eva-404-title"
      >
        <div className="container">
          <div className="eva-404-inner text-center">
            <p className="eva-404-code" aria-hidden="true">
              <span>4</span>
              <i className="icon-lip-syncdubbing-01 eva-404-icon" />
              <span>4</span>
            </p>
            <p className="eva-404-kicker">Error 404</p>
            <h1 id="eva-404-title">Page not found</h1>
            <p className="p--lg eva-404-text">
              The page you&apos;re looking for has moved or doesn&apos;t exist.
            </p>
            <nav className="eva-404-actions" aria-label="Helpful links">
              <Link href={Routes.HOME} className="btn">
                <span>Back to Home</span>
              </Link>
              <Link href={Routes.SERVICES} className="btn btn--border">
                <span>Our Services</span>
              </Link>
              <Link href={Routes.CONTACT} className="btn btn--border">
                <span>Contact Us</span>
              </Link>
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}
