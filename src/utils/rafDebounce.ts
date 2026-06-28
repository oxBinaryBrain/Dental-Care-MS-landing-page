// Wrap a callback in requestAnimationFrame debounce.
// Prevents O(N) recompute on every frame during rapid resize.
export function rafDebounce(fn: () => void): () => void {
  let rafId = 0
  return () => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      rafId = 0
      fn()
    })
  }
}
