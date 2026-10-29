import { useEffect, useEffectEvent } from 'react'

type FrameCallback = (now: number) => void

// Sayfadaki tüm canvas'lar tek bir requestAnimationFrame döngüsünü paylaşır.
// İlk abone geldiğinde döngü başlar, son abone gidince durur.
const subscribers = new Set<FrameCallback>()
let frameId = 0

function tick(now: number) {
  subscribers.forEach((callback) => callback(now))
  frameId = subscribers.size > 0 ? requestAnimationFrame(tick) : 0
}

/** `callback` her animasyon karesinde çağrılır; en güncel props/state'i görür. */
export function useAnimationLoop(callback: FrameCallback, enabled = true) {
  const onFrame = useEffectEvent(callback)

  useEffect(() => {
    if (!enabled) return
    const subscriber: FrameCallback = (now) => onFrame(now)
    subscribers.add(subscriber)
    if (!frameId) frameId = requestAnimationFrame(tick)
    return () => {
      subscribers.delete(subscriber)
      if (subscribers.size === 0 && frameId) {
        cancelAnimationFrame(frameId)
        frameId = 0
      }
    }
  }, [enabled])
}
