import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogForm from "@@/components/admin/blog/BlogForm";
import PageHeader from "@@/components/admin/ui/PageHeader";
import { todayInIndia } from "@@/data/blog";
import { requireAdmin } from "@@/lib/admin-auth";
import { getBlogPosts, takenBlogSlugs } from "@@/lib/blog/store";
import { updateBlogPostAction } from "../../actions";

export const metadata: Metadata = { title: "Edit post" };

/** Addressed by id, not slug, so renaming a post never breaks the edit page (an AVR bug). */
export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.id === id);
  if (!post) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl">
      <PageHeader title="Edit post" description={post.title} />
      <BlogForm
        action={updateBlogPostAction.bind(null, post.id)}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          cover: post.cover,
          coverAlt: post.coverAlt,
          author: post.author,
          publishDate: post.publishDate,
          category: post.category,
          tags: post.tags,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          status: post.status,
          firstPublishedAt: post.firstPublishedAt,
          previousSlugs: post.previousSlugs,
        }}
        submitLabel="Save changes"
        today={todayInIndia()}
        takenSlugs={[...takenBlogSlugs(posts, post.id)]}
      />
    </div>
  );
}
