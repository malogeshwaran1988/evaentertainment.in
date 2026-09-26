import type { Metadata } from "next";
import "@@/styles/globals.scss";
import Header from "@@/components/common/Header";
import Footer from "@@/components/common/Footer";
import BodyClass from "@@/components/common/BodyClass";
import NotFoundContent from "@@/components/common/NotFoundContent";
import WebHead from "@@/components/common/WebHead";
import { APP_BASE_URL } from "@@/constants/constants";

export const metadata: Metadata = {
  metadataBase: new URL(APP_BASE_URL),
  title: { absolute: "Page Not Found" },
  description: "The page you are looking for does not exist.",
  icons: { icon: "/favicon.ico" },
  robots: {
    index: false,
    follow: false,
  },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <WebHead />
      </head>
      <body className="is-loaded">
        <div className="flex min-h-screen flex-col">
          <BodyClass />
          <Header />
          <div className="flex-1">
            <NotFoundContent />
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
