import type { ReactNode } from "react";
import Link from "@@/components/common/NavLink";
import PageHero from "@@/components/common/PageHero";
import { SITE_NAME } from "@@/constants/constants";
import { Routes } from "@@/constants/routes";
import type { BlogPost } from "@@/data/blog";
import { blogCoverAlt, blogReadingMinutes, formatBlogDate } from "@@/lib/blog/seo";
import { blogHref } from "@@/lib/blog/slug";

export type BlogArticleData = Pick<
  BlogPost,
  "title" | "slug" | "excerpt" | "content" | "cover" | "coverAlt" | "author" | "publishDate" | "category" | "tags"
>;

/**
 * Hero + article body of /blog/[slug]. Shared with the admin preview (/preview/blog) so a
 * preview is rendered by exactly the same markup and styles as the live page.
 * `content` must already be sanitised (sanitizeBlogHtml).
 */
export default function BlogArticleView({
  post,
  schema = true,
  children,
}: {
  post: BlogArticleData;
  /** Breadcrumb JSON-LD; off for previews. */
  schema?: boolean;
  /** Rendered after the article, inside the same container (e.g. "More from the blog"). */
  children?: ReactNode;
}) {
  return (
    <>
      <PageHero
        schema={schema}
        icon="icon-folded-newspaper"
        className="eva-blog-hero"
        title={post.title}
        trail={[
          { label: "Blog", href: Routes.BLOG },
          { label: post.title, href: blogHref(post.slug) },
        ]}
      />
      <section className="block block--darkbg eva-blog" aria-label={post.title}>
        <div className="container">
          <article className="eva-blog-article">
            <p className="eva-blog-meta">
              <span>{post.category}</span>
              <span aria-hidden="true"> · </span>
              <time dateTime={post.publishDate}>{formatBlogDate(post.publishDate)}</time>
              <span aria-hidden="true"> · </span>
              <span>By {post.author}</span>
              <span aria-hidden="true"> · </span>
              <span>{blogReadingMinutes(post.content)} min read</span>
            </p>
            {post.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover}
                alt={blogCoverAlt(post)}
                width={1200}
                height={630}
                className="eva-blog-cover"
                loading="eager"
                fetchPriority="high"
              />
            ) : null}
            <p className="eva-blog-lede">{post.excerpt}</p>
            {/* Sanitised on save (src/lib/blog/sanitize.ts). */}
            <div className="eva-blog-body" dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.tags.length ? (
              <ul className="eva-blog-tags" aria-label="Tags">
                {post.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : null}
            <div className="eva-blog-cta">
              <p>Planning a dub, voice-over or mix? Talk to the {SITE_NAME} studio in Andheri West.</p>
              <div className="eva-project-detail-cta">
                <Link className="btn" href={Routes.CONTACT}>
                  Contact us
                </Link>
              </div>
            </div>
          </article>
          {children}
        </div>
      </section>
    </>
  );
}
