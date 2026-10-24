import type { Metadata } from "next";
import JsonLd from "@@/components/common/JsonLd";
import Link from "@@/components/common/NavLink";
import PageHero from "@@/components/common/PageHero";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_NAME } from "@@/constants/constants";
import { Routes } from "@@/constants/routes";
import BlogComingSoon from "@@/components/blog/BlogComingSoon";
import { BLOG_SEO } from "@@/data/blog";
import { BLOG_ENABLED } from "@@/lib/blog/enabled";
import { imageLoading } from "@@/lib/image-loading";
import { blogAbsoluteUrl, blogCoverAlt, formatBlogDate } from "@@/lib/blog/seo";
import { blogHref } from "@@/lib/blog/slug";
import { getPublicBlogPosts } from "@@/lib/blog/store";
import { absoluteUrl, buildPageMetadata } from "@@/lib/seo";
import "@@/styles/routes/blog.scss";

/** ISR: refreshed hourly (scheduled posts appear within the hour) and on every admin save. */
export const revalidate = 3600;

const BLOG_URL = absoluteUrl(Routes.BLOG);

export async function generateMetadata(): Promise<Metadata> {
  if (!BLOG_ENABLED) {
    return buildPageMetadata({
      title: "Blog – Coming Soon | EVA Entertainment",
      description: BLOG_SEO.description,
      url: BLOG_URL,
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: DEFAULT_OG_IMAGE_ALT,
      noindex: true,
    });
  }
  const posts = await getPublicBlogPosts();
  return buildPageMetadata({
    ...BLOG_SEO,
    url: BLOG_URL,
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: DEFAULT_OG_IMAGE_ALT,
    // An empty blog is a thin page: keep it out of search until the first post is live.
    noindex: posts.length === 0,
  });
}

export default async function BlogPage() {
  if (!BLOG_ENABLED) return <BlogComingSoon />;
  const posts = await getPublicBlogPosts();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_NAME} Blog`,
    description: BLOG_SEO.description,
    url: BLOG_URL,
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(blogHref(p.slug)),
      datePublished: p.publishDate,
      ...(p.cover ? { image: blogAbsoluteUrl(p.cover) } : {}),
    })),
  };

  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      {posts.length ? <JsonLd id="blog-jsonld" data={schema} /> : null}
      <PageHero
        icon="icon-folded-newspaper"
        className="eva-blog-hero"
        title="Blog"
        subtitle="Dubbing, voice-over and sound notes from our Mumbai studio"
        trail={[{ label: "Blog", href: Routes.BLOG }]}
        schema={posts.length > 0}
      />
      <section className="block block--darkbg eva-blog" aria-labelledby="blog-list-heading">
        <div className="container">
          <h2 id="blog-list-heading" className="sr-only">
            Latest posts
          </h2>
          {posts.length ? (
            <ul className="eva-blog-grid">
              {posts.map((post, i) => {
                const img = imageLoading(i);
                return (
                  <li key={post.id}>
                    <article className="eva-blog-card">
                      {post.cover ? (
                        // Uploaded covers are served by a route handler; rendered unoptimised like posters.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.cover}
                          alt={blogCoverAlt(post)}
                          width={1200}
                          height={630}
                          className="eva-blog-card-img"
                          {...img}
                        />
                      ) : (
                        <div className="eva-blog-card-img eva-blog-card-img--empty" aria-hidden="true">
                          <i className="icon icon-folded-newspaper" />
                        </div>
                      )}
                      <div className="eva-blog-card-body">
                        <p className="eva-blog-meta">
                          <span>{post.category}</span>
                          <span aria-hidden="true"> · </span>
                          <time dateTime={post.publishDate}>{formatBlogDate(post.publishDate)}</time>
                        </p>
                        <h3 className="eva-blog-card-title">
                          <Link href={blogHref(post.slug)} className="eva-blog-card-link">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="eva-blog-card-excerpt">{post.excerpt}</p>
                        <span className="eva-blog-card-more" aria-hidden="true">
                          Read article →
                        </span>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="eva-blog-empty">
              <p className="p--lg">Our first articles are on the way.</p>
              <p>
                Meanwhile, see the films we have dubbed on <Link href={Routes.PROJECTS}>Our Projects</Link> or{" "}
                <Link href={Routes.CONTACT}>contact the studio</Link>.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
