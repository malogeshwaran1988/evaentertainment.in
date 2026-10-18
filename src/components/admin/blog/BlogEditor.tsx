"use client";

import dynamic from "next/dynamic";
import type { BlogEditorProps } from "./BlogEditorInner";

/** Browser-only (contentEditable + DOMParser); a same-height placeholder avoids a layout jump. */
const BlogEditorInner = dynamic(() => import("./BlogEditorInner"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[560px] items-center justify-center rounded-md border border-input text-sm text-muted-foreground"
      role="status"
    >
      Loading editor…
    </div>
  ),
});

export default function BlogEditor(props: BlogEditorProps) {
  return <BlogEditorInner {...props} />;
}
