"use client";

import { useEffect, useState } from "react";
import { previewBlogHtmlAction } from "@@/app/(admin)/admin/blog/actions";
import BlogArticleView from "@@/components/blog/BlogArticleView";
import { readBlogPreview, type BlogPreviewPayload } from "@@/lib/blog/preview";
import "@@/styles/routes/blog.scss";

type State = { kind: "loading" } | { kind: "missing" } | { kind: "ready"; post: BlogPreviewPayload };

export default function BlogPreviewClient() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get("k") ?? "";
    const data = key ? readBlogPreview(key) : null;
    if (!data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only storage once
      setState({ kind: "missing" });
      return;
    }
    let live = true;
    previewBlogHtmlAction(data.content)
      .then((content) => live && setState({ kind: "ready", post: { ...data, content } }))
      .catch(() => live && setState({ kind: "missing" }));
    return () => {
      live = false;
    };
  }, []);

  const title = state.kind === "ready" ? state.post.title || "Untitled post" : "Preview";

  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <div className="eva-blog-preview-banner" role="status">
        <strong>Preview - not published.</strong> This is how the post will look on the live site. Only
        admins can see this page; close the tab to return to the editor.
      </div>
      {state.kind === "ready" ? (
        <BlogArticleView post={{ ...state.post, title }} schema={false} />
      ) : (
        <section className="block block--darkbg eva-blog">
          <div className="container">
            <p className="eva-blog-empty">
              {state.kind === "loading"
                ? "Loading preview…"
                : "Nothing to preview. Open the post in the editor and press Preview again."}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
