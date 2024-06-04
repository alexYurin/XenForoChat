import { Room } from '@app/core/domain'
import { RefObject, useEffect, useState } from 'react'

export function useIntersection(
  target: RefObject<HTMLDivElement>,
  rooms: Room[],
  callback: () => Promise<void>,
) {
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    let isPending = false
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && (rooms?.length ?? 0) > 0) {
          if (!isPending) {
            setLoading(true)
            isPending = true

            callback().finally(() => {
              setLoading(false)
              isPending = false
            })
          }
        }
      },
      { threshold: 1 },
    )

    if (target.current) {
      observer.observe(target.current)
    }

    return () => {
      if (target.current) {
        observer.unobserve(target.current)
      }
    }
  }, [target, rooms])

  return isLoading
}
