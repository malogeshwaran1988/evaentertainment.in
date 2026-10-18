/** First image on a page loads eagerly at high priority; every other image is lazy + low priority. */
export function imageLoading(index: number) {
  return index === 0
    ? ({ loading: "eager", fetchPriority: "high" } as const)
    : ({ loading: "lazy", fetchPriority: "low" } as const);
}

/**
 * Poster grids revealed in batches: the first batch (10) loads eagerly; only the visible first
 * row gets fetchPriority=high (marking all 10 high would dilute it); the rest of the first batch
 * is auto; later batches are lazy + low.
 */
export function gridImageLoading(index: number, firstRow = 6, firstBatch = 10) {
  if (index < firstRow) return { loading: "eager", fetchPriority: "high" } as const;
  if (index < firstBatch) return { loading: "eager", fetchPriority: "auto" } as const;
  return { loading: "lazy", fetchPriority: "low" } as const;
}
