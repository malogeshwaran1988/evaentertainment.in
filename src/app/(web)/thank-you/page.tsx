import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@@/components/common/Breadcrumbs";
import { Routes } from "@@/constants/routes";

export const metadata: Metadata = {
  title: { absolute: "Thank You | EVA Entertainment" },
  description: "Your message was sent successfully to EVA Entertainment.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function ThankYouPage() {
  return (
    <main className="page-main">
      <div className="block block--title block--darkbg">
        <div className="container">
          <div className="text-center">
            <h1>Thank You</h1>
            <Breadcrumbs current="Thank You" />
            <p className="p--lg" style={{ marginTop: 24 }}>
              Your message was sent successfully. We will get back to you soon.
            </p>
            <p style={{ marginTop: 32 }}>
              <Link href={Routes.HOME} className="btn btn--border">
                <span>Back to Home</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
