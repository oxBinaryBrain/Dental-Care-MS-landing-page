import { useCallback, useRef, type MutableRefObject } from 'react'

// Merge multiple refs (callback + object) onto a single element.
// Solves the fragile cast pattern in the original App.
export function useMergeRefs<T>(
  ...refs: (MutableRefObject<T | null> | ((el: T | null) => void) | null | undefined)[]
): (el: T | null) => void {
  // Store cleanups in an array to avoid recursive type inference
  const cleanupsRef = useRef<Array<() => void>>([])

  return useCallback(
    (el: T | null) => {
      // Run any prior cleanups
      const priorCleanups = cleanupsRef.current
      cleanupsRef.current = []
      for (let i = 0; i < priorCleanups.length; i++) {
        priorCleanups[i]()
      }

      for (const ref of refs) {
        if (!ref) continue
        if (typeof ref === 'function') {
          ref(el)
        } else {
          ref.current = el
        }
      }
    },
    [refs],
  )
}
