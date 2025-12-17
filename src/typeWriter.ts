export type TypewriterDelay = number | readonly [minMs: number, maxMs: number]

export type TypewriterOptions = {
  typingDelay?: TypewriterDelay
  deletingDelay?: TypewriterDelay
}

const defaultOptions: Required<TypewriterOptions> = {
  typingDelay: [90, 170],
  deletingDelay: [55, 120],
}

function randomDelayMs(delay: TypewriterDelay): number {
  if (typeof delay === 'number') return Math.max(0, delay)
  const [minMs, maxMs] = delay
  const lower = Math.min(minMs, maxMs)
  const upper = Math.max(minMs, maxMs)
  return Math.floor(lower + Math.random() * (upper - lower + 1))
}

type Mode = 'idle' | 'typing' | 'deleting'

export default class Typewriter {
  private currentText = ''
  private targetText = ''
  private mode: Mode = 'idle'
  private readonly options: Required<TypewriterOptions>

  constructor(options?: TypewriterOptions) {
    this.options = {
      typingDelay: options?.typingDelay ?? defaultOptions.typingDelay,
      deletingDelay: options?.deletingDelay ?? defaultOptions.deletingDelay,
    }
  }

  public setTargetText(nextText: string) {
    const normalized = nextText ?? ''
    if (normalized === this.targetText) return

    this.targetText = normalized
    this.mode = this.currentText ? 'deleting' : 'typing'
  }

  public isIdle() {
    return this.mode === 'idle'
  }

  public getDelayMs() {
    if (this.mode === 'deleting') return randomDelayMs(this.options.deletingDelay)
    return randomDelayMs(this.options.typingDelay)
  }

  public tick() {
    if (this.mode === 'idle') return this.currentText

    if (this.mode === 'deleting') {
      this.currentText = this.currentText.slice(0, -1)
      if (!this.currentText) this.mode = 'typing'
      return this.currentText
    }

    if (this.currentText === this.targetText) {
      this.mode = 'idle'
      return this.currentText
    }

    const nextLength = Math.min(this.currentText.length + 1, this.targetText.length)
    this.currentText = this.targetText.slice(0, nextLength)
    if (this.currentText === this.targetText) this.mode = 'idle'
    return this.currentText
  }
}
