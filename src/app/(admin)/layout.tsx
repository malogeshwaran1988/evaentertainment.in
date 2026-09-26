import type { Metadata } from "next";
import { Toaster } from "sonner";
import "@@/styles/admin.css";
import { THEME_STORAGE_KEY } from "@@/components/admin/theme/theme";

export const metadata: Metadata = {
  title: { default: "EVA Admin", template: "%s | EVA Admin" },
  icons: { icon: "/favicon.ico" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const themeScript = `(function(){try{var p=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})||"system";var d=p==="dark"||(p==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

/** Root layout for /login and /admin — shadcn styles only, no public site CSS. */
export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the stored theme before first paint so dark mode does not flash light. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Raleway is the website font, used by the project card preview. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- this is the admin root layout, so it loads on every admin page. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Raleway:400,600,700&display=swap"
        />
      </head>
      <body>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
