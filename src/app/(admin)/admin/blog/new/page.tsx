import type { Metadata } from "next";
import BlogForm from "@@/components/admin/blog/BlogForm";
import PageHeader from "@@/components/admin/ui/PageHeader";
import { todayInIndia } from "@@/data/blog";
import { requireAdmin } from "@@/lib/admin-auth";
import { getBlogPosts, takenBlogSlugs } from "@@/lib/blog/store";
import { createBlogPostAction } from "../actions";

export const metadata: Metadata = { title: "New post" };

export default async function NewBlogPostPage() {
  await requireAdmin();
  const taken = [...takenBlogSlugs(await getBlogPosts())];
  return (
    <div className="mx-auto w-full max-w-6xl">
      <PageHeader title="New post" />
      <BlogForm action={createBlogPostAction} submitLabel="Save post" today={todayInIndia()} takenSlugs={taken} />
    </div>
  );
}
