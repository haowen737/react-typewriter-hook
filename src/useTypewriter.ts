import { useState, useEffect, useRef } from "react"
import TypeWritter from './typeWriter'

const writter = new TypeWritter()

export default function useTypeWritter(str: string) {
  const [word, setWord] = useState<null | string>(null)
  const intervalRef = useRef<any>({})
  const strRef = useRef<any>({})

  useEffect(() => {
    strRef.current = setWord(writter.startTypeWord(str))
  }, [str])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setWord(writter.typing())
    }, writter.rd())
    return function clear() {
      clearInterval(intervalRef.current)
    }
  }, [word])

  return word
}