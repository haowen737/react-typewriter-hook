import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import useTypewriterSequence from '../src/useTypewriterSequence'

function flushPendingTimers(maxCycles = 100) {
  for (let i = 0; i < maxCycles; i++) {
    if (vi.getTimerCount() === 0) return
    act(() => {
      vi.runOnlyPendingTimers()
    })
  }
  throw new Error('Timed out flushing timers (likely an infinite loop)')
}

describe('useTypewriterSequence', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns null for empty words', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTypewriterSequence([], { pauseMs: 0, loop: true }))
    expect(result.current).toBeNull()
  })

  it('types through all words and stops when loop=false', () => {
    vi.useFakeTimers()

    const { result } = renderHook(() =>
      useTypewriterSequence(['a', 'bb'], {
        pauseMs: 0,
        loop: false,
        typingDelay: [0, 0],
        deletingDelay: [0, 0],
      }),
    )

    flushPendingTimers()

    expect(result.current).toBe('bb')
  })

  it('cycles when loop=true', () => {
    vi.useFakeTimers()

    const { result } = renderHook(() =>
      useTypewriterSequence(['a', 'b'], {
        pauseMs: 0,
        loop: true,
        typingDelay: [0, 0],
        deletingDelay: [0, 0],
      }),
    )

    const seen = new Set<string>()
    for (let i = 0; i < 50; i++) {
      act(() => {
        vi.runOnlyPendingTimers()
      })
      const current = result.current
      if (current != null) seen.add(current)
      if (seen.has('a') && seen.has('b')) break
    }

    expect(seen.has('a')).toBe(true)
    expect(seen.has('b')).toBe(true)
  })
})
