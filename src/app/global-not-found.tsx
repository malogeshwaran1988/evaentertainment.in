import type { Metadata } from "next";
import { STATUS_PAGE_ROBOTS } from "@@/lib/seo";
import "@@/styles/tailwind-web.css";
import "@@/styles/globals.scss";
import "@@/styles/legacy/index.css";
import Header from "@@/components/common/Header";
import Footer from "@@/components/common/Footer";
import BodyClass from "@@/components/common/BodyClass";
import NotFoundContent from "@@/components/common/NotFoundContent";
import { GtmHead, GtmNoscript } from "@@/components/common/GoogleTagManager";
import { APP_BASE_URL } from "@@/constants/constants";
import { SERVICE_NAMES } from "@@/data/services";

export const metadata: Metadata = {
  metadataBase: new URL(APP_BASE_URL),
  title: { absolute: "Page Not Found" },
  description: "The page you are looking for does not exist.",
  icons: { icon: "/favicon.ico" },
  robots: STATUS_PAGE_ROBOTS,
};

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GtmHead />
      </head>
      <body className="is-loaded">
        <GtmNoscript />
        <div className="flex min-h-screen flex-col">
          <BodyClass />
          <Header serviceNames={SERVICE_NAMES} />
          <div className="flex-1">
            <NotFoundContent />
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
