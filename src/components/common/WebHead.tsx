/** Stylesheets for Glory chrome — vendors actually used by App Router pages. */
const STYLESHEETS = [
  "/css/vendor/bootstrap.min.css",
  "/css/vendor/animate.min.css",
  "/css/vendor/slick.css",
  "/fonts/recording/style.css",
  "https://use.fontawesome.com/releases/v5.4.1/css/all.css",
  "https://fonts.googleapis.com/css?family=Raleway:300,400,500,600,700,800,900&display=swap",
  "/css/custom.css",
  "/css/style.css",
] as const;

/** `<head>` links shared by the public root layout and the global 404 page. */
export default function WebHead() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      {STYLESHEETS.map((href) =>
        href.includes("fontawesome") ? (
          <link
            key={href}
            rel="stylesheet"
            href={href}
            integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz"
            crossOrigin="anonymous"
          />
        ) : (
          <link key={href} rel="stylesheet" href={href} />
        ),
      )}
    </>
  );
}
