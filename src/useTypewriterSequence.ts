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

  useEffect(() => {
    if (!words.length) {
      setWord(null)
      return
    }

    indexRef.current = 0

    const pauseMs = Math.max(0, options?.pauseMs ?? 1700)
    const loop = options?.loop ?? true
    const writerOptions: TypewriterOptions = {
      typingDelay: options?.typingDelay,
      deletingDelay: options?.deletingDelay,
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
  }, [words, options?.deletingDelay, options?.loop, options?.pauseMs, options?.typingDelay])

  return word
}
