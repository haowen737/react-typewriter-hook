import { useState, useEffect, useRef } from "react"
import TypeWritter from './typeWriter'

export default function useTypeWritter(str: string) {
  const [word, setWord] = useState<null | string>(null)
  const intervalRef = useRef<any>({})
  const strRef = useRef<any>({})
  const writerInstRef = useRef<TypeWritter>(new TypeWritter())

  useEffect(() => {
    strRef.current = setWord(writerInstRef.current.startTypeWord(str))
  }, [str])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setWord(writerInstRef.current.typing())
    }, writerInstRef.current.rd())
    return function clear() {
      clearInterval(intervalRef.current)
    }
  }, [word])

  return word
}