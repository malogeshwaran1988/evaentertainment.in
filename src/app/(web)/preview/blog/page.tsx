import type { Metadata } from "next";
import BlogPreviewClient from "@@/components/blog/BlogPreviewClient";
import { requireAdmin } from "@@/lib/admin-auth";

/** Admin-only preview of an unsaved post, rendered with the public /blog/[slug] markup. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Preview - not published" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function BlogPreviewPage() {
  await requireAdmin();
  return <BlogPreviewClient />;
}
