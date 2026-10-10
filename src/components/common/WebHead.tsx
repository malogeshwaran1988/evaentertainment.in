/** Stylesheets for Glory chrome — vendors actually used by App Router pages. */
const STYLESHEETS = [
  "/css/vendor/bootstrap.min.css",
  "/css/vendor/slick.css",
  "/fonts/recording/style.css",
  "/css/custom.css",
  "/css/style.css",
] as const;

/** `<head>` links shared by the public root layout and the global 404 page. */
export default function WebHead() {
  return (
    <>
      <link
        rel="preload"
        href="/fonts/raleway/raleway-latin.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      {STYLESHEETS.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
    </>
  );
}
