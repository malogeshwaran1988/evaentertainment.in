import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import BlogTable, { type BlogRow } from "@@/components/admin/blog/BlogTable";
import PageHeader from "@@/components/admin/ui/PageHeader";
import { Button } from "@@/components/ui/button";
import { blogPublicState } from "@@/data/blog";
import { requireAdmin } from "@@/lib/admin-auth";
import { AdminRoutes } from "@@/lib/admin-session";
import { getBlogPosts } from "@@/lib/blog/store";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  await requireAdmin();
  const posts = await getBlogPosts();
  const rows: BlogRow[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    publishDate: p.publishDate,
    author: p.author,
    updatedAt: p.updatedAt,
    previousSlugs: p.previousSlugs,
    state: blogPublicState(p),
  }));

  return (
    <div className="mx-auto w-full max-w-6xl">
      <PageHeader
        title="Blog"
        description="Posts on the public blog at /blog. Drafts stay private."
        actions={
          <Button asChild>
            <Link href={AdminRoutes.BLOG_NEW}>
              <Plus />
              New post
            </Link>
          </Button>
        }
      />
      <BlogTable posts={rows} />
    </div>
  );
}
