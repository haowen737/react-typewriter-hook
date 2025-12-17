import { useEffect, useRef, useState } from 'react'
import Typewriter, { type TypewriterOptions } from './typeWriter'

export type UseTypewriterOptions = TypewriterOptions

export default function useTypewriter(text: string, options?: UseTypewriterOptions) {
  const [word, setWord] = useState<string | null>(null)
  const writerRef = useRef<Typewriter | null>(null)
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!writerRef.current) writerRef.current = new Typewriter(options)
    writerRef.current.setTargetText(text)

    let cancelled = false
    const writer = writerRef.current

    const run = () => {
      if (cancelled) return
      setWord(writer.tick())
      if (writer.isIdle()) return
      timeoutIdRef.current = setTimeout(run, writer.getDelayMs())
    }
    run()

    return () => {
      cancelled = true
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
    }
  }, [text])

  return word
}
