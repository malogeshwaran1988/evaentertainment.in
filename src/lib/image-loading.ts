/** First image on a page loads eagerly at high priority; every other image is lazy. */
export function imageLoading(index: number) {
  return index === 0
    ? ({ loading: "eager", fetchPriority: "high" } as const)
    : ({ loading: "lazy" } as const);
}
