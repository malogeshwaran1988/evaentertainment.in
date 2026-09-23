import type { Metadata } from "next";
import Link from "next/link";
import { Routes } from "@@/constants/routes";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found | EVA Entertainment" },
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="page-main">
      <div className="block block--title block--darkbg">
        <div className="container">
          <div className="text-center">
            <h1>Page not found</h1>
            <p className="p--lg" style={{ marginTop: 24 }}>
              The page you are looking for does not exist.
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
