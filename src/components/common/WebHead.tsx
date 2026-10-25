/** `<head>` links shared by the public root layout and the global 404 page. Legacy CSS is bundled via `@@/styles/legacy/index.css`. */
export default function WebHead() {
  return (
    <link
      rel="preload"
      href="/fonts/raleway/raleway-latin.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />
  );
}
