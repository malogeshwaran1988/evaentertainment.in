import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "@@/components/common/JsonLd";
import Link from "@@/components/common/NavLink";
import BlogArticleView from "@@/components/blog/BlogArticleView";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@@/constants/constants";
import { Routes } from "@@/constants/routes";
import type { BlogPost } from "@@/data/blog";
import {
  blogAbsoluteUrl,
  blogCoverAlt,
  blogSeoDescription,
  blogSeoTitle,
  blogWordCount,
  formatBlogDate,
} from "@@/lib/blog/seo";
import { blogHref } from "@@/lib/blog/slug";
import { findPublicBlogPost, getPublicBlogPosts } from "@@/lib/blog/store";
import { EVA_ORG_ID, evaOrganizationLd } from "@@/lib/project-seo";
import { absoluteUrl, buildPageMetadata, STATUS_PAGE_ROBOTS } from "@@/lib/seo";

/** New slugs work right after a save; known ones are prebuilt. Refreshed hourly and on save. */
export const dynamicParams = true;
export const revalidate = 3600;

const ogImageFor = (p: BlogPost) =>
  p.cover ? `/og/blog/${p.slug}?v=${new Date(p.updatedAt).getTime().toString(36)}` : DEFAULT_OG_IMAGE;

export async function generateStaticParams() {
  return (await getPublicBlogPosts()).map((p) => ({ slug: p.slug }));
}

/** Drafts, scheduled and unknown slugs all 404; old slugs redirect (see also src/proxy.ts). */
async function load(slug: string): Promise<BlogPost> {
  const found = await findPublicBlogPost(slug);
  if (found?.redirectTo) permanentRedirect(blogHref(found.redirectTo));
  if (!found?.post) notFound();
  return found.post;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const found = await findPublicBlogPost((await params).slug);
  // Never index anything that isn't a live post (drafts, scheduled, missing).
  if (!found?.post) return { robots: STATUS_PAGE_ROBOTS };
  const post = found.post;
  const meta = buildPageMetadata({
    title: blogSeoTitle(post),
    description: blogSeoDescription(post),
    url: absoluteUrl(blogHref(post.slug)),
    ogImage: ogImageFor(post),
    ogImageAlt: blogCoverAlt(post),
  });
  return {
    ...meta,
    ...(post.tags.length ? { keywords: post.tags } : {}),
    authors: [{ name: post.author }],
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: post.publishDate,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await load((await params).slug);
  const url = absoluteUrl(blogHref(post.slug));
  const words = blogWordCount(post.content);
  const image = post.cover ? blogAbsoluteUrl(ogImageFor(post)) : blogAbsoluteUrl(DEFAULT_OG_IMAGE);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: post.title,
    description: blogSeoDescription(post),
    image,
    datePublished: `${post.publishDate}T00:00:00+05:30`,
    dateModified: post.updatedAt,
    author:
      post.author === SITE_NAME
        ? { "@id": EVA_ORG_ID }
        : { "@type": "Person", name: post.author },
    publisher: evaOrganizationLd(),
    articleSection: post.category,
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
    wordCount: words,
    inLanguage: "en-IN",
    isPartOf: { "@type": "Blog", "@id": `${absoluteUrl(Routes.BLOG)}#blog`, url: absoluteUrl(Routes.BLOG) },
  };

  const others = (await getPublicBlogPosts()).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <JsonLd id="blog-post-jsonld" data={articleSchema} />
      <BlogArticleView post={post}>

          {others.length ? (
            <nav className="eva-blog-more" aria-labelledby="blog-more-heading">
              <h2 id="blog-more-heading" className="h--md">
                More from the blog
              </h2>
              <ul>
                {others.map((p) => (
                  <li key={p.id}>
                    <Link href={blogHref(p.slug)}>{p.title}</Link>{" "}
                    <time dateTime={p.publishDate}>{formatBlogDate(p.publishDate)}</time>
                  </li>
                ))}
              </ul>
              <p>
                <Link href={Routes.BLOG}>All posts</Link>
              </p>
            </nav>
          ) : null}
      </BlogArticleView>
    </main>
  );
}
