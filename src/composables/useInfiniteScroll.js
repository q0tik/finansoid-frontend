import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Attaches an IntersectionObserver to a sentinel element.
 * Calls `callback` whenever the sentinel enters the viewport.
 *
 * Usage:
 *   const { sentinel } = useInfiniteScroll(() => loadMore())
 *   // In template: <div ref="sentinel" />
 */
export function useInfiniteScroll(callback) {
  const sentinel = ref(null)
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callback()
      },
      { threshold: 0.1 }
    )
    if (sentinel.value) observer.observe(sentinel.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { sentinel }
}
