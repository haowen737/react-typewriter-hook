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

  it('clears pending timers when unmounted', () => {
    vi.useFakeTimers()

    const { unmount } = renderHook(() =>
      useTypewriterSequence(['abc', 'd'], {
        pauseMs: 1000,
        loop: true,
        typingDelay: [10, 10],
        deletingDelay: [10, 10],
      }),
    )

    expect(vi.getTimerCount()).toBeGreaterThan(0)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('resets to null when words become empty on rerender', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ words }) =>
        useTypewriterSequence(words, {
          pauseMs: 1000,
          loop: true,
          typingDelay: [0, 0],
          deletingDelay: [0, 0],
        }),
      { initialProps: { words: ['a', 'b'] as string[] } },
    )

    expect(vi.getTimerCount()).toBeGreaterThan(0)

    rerender({ words: [] })
    expect(result.current).toBeNull()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('uses default pause/loop and supports numeric delays', () => {
    vi.useFakeTimers()

    const { result, unmount } = renderHook(() =>
      useTypewriterSequence(['ok'], {
        typingDelay: 0,
        deletingDelay: 0,
      }),
    )

    expect(result.current).toBe('o')
    expect(vi.getTimerCount()).toBeGreaterThan(0)
    unmount()
  })

  it('handles undefined entries using empty-string fallback', () => {
    vi.useFakeTimers()

    const words = [undefined as unknown as string]
    const { result, unmount } = renderHook(() =>
      useTypewriterSequence(words, {
        pauseMs: 0,
        loop: false,
        typingDelay: [0, 0],
        deletingDelay: [0, 0],
      }),
    )

    flushPendingTimers()
    expect(result.current).toBe('')
    unmount()
  })

  it('ignores stale run and pause callbacks after cleanup', () => {
    vi.useFakeTimers()
    const timeoutCallbacks: Array<() => void> = []

    vi.spyOn(globalThis, 'setTimeout').mockImplementation((fn) => {
      timeoutCallbacks.push(fn as () => void)
      return timeoutCallbacks.length as unknown as ReturnType<typeof setTimeout>
    })
    vi.spyOn(globalThis, 'clearTimeout').mockImplementation(() => {})

    const words = ['ab', undefined as unknown as string]
    const { unmount } = renderHook(() =>
      useTypewriterSequence(words, {
        pauseMs: 10,
        loop: true,
        typingDelay: [0, 0],
        deletingDelay: [0, 0],
      }),
    )

    const staleRun = timeoutCallbacks[0]
    expect(staleRun).toBeDefined()
    act(() => {
      staleRun()
    })

    const stalePause = timeoutCallbacks[1]
    expect(stalePause).toBeDefined()

    unmount()

    act(() => {
      staleRun()
      stalePause()
    })
  })
})
