import { useEffect, useRef, useState } from 'react'

import Typewriter, { type TypewriterOptions } from './typeWriter'

export type UseTypewriterSequenceOptions = TypewriterOptions & {
  pauseMs?: number
  loop?: boolean
}

export default function useTypewriterSequence(
  words: readonly string[],
  options?: UseTypewriterSequenceOptions,
) {
  const [word, setWord] = useState<string | null>(null)
  const writerRef = useRef<Typewriter | null>(null)
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const indexRef = useRef(0)

  const pauseMs = Math.max(0, options?.pauseMs ?? 1700)
  const loop = options?.loop ?? true
  const typingDelay = options?.typingDelay
  const deletingDelay = options?.deletingDelay

  const wordsKey = JSON.stringify(words)

  const delayKey = (delay: TypewriterOptions['typingDelay']) => {
    if (delay == null) return 'default'
    if (typeof delay === 'number') return `n:${delay}`
    return `r:${delay[0]}-${delay[1]}`
  }

  const optionsKey = `${pauseMs}|${loop ? 1 : 0}|t:${delayKey(typingDelay)}|d:${delayKey(deletingDelay)}`

  useEffect(() => {
    if (!words.length) {
      setWord(null)
      return
    }

    indexRef.current = 0

    const writerOptions: TypewriterOptions = {
      typingDelay,
      deletingDelay,
    }

    writerRef.current = new Typewriter(writerOptions)
    const writer = writerRef.current
    writer.setTargetText(words[0] ?? '')

    let cancelled = false

    const run = () => {
      if (cancelled) return

      setWord(writer.tick())

      if (!writer.isIdle()) {
        timeoutIdRef.current = setTimeout(run, writer.getDelayMs())
        return
      }

      const isLast = indexRef.current >= words.length - 1
      if (isLast && !loop) return

      timeoutIdRef.current = setTimeout(() => {
        if (cancelled) return
        indexRef.current = isLast ? 0 : indexRef.current + 1
        writer.setTargetText(words[indexRef.current] ?? '')
        run()
      }, pauseMs)
    }

    run()

    return () => {
      cancelled = true
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
    }
  }, [wordsKey, optionsKey])

  return word
}
