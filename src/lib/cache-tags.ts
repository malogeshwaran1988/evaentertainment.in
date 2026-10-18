/** Data-cache tags for Blob-backed JSON. Admin saves call updateTag(); reads are cached a day. */
export const PROJECTS_TAG = "eva-projects";
export const BLOG_TAG = "eva-blog";
/** Long revalidate: data only changes on admin save, which invalidates the tag immediately. */
export const DATA_REVALIDATE_SECONDS = 60 * 60 * 24;
