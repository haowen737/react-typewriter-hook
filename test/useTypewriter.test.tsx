import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import useTypewriter from '../src/useTypewriter'

describe('useTypewriter', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('types a word and stops at the full text', () => {
    vi.useFakeTimers()

    const { result } = renderHook(() =>
      useTypewriter('abc', { typingDelay: 0, deletingDelay: 0 }),
    )

    act(() => {
      vi.runAllTimers()
    })

    expect(result.current).toBe('abc')
  })

  it('deletes previous word then types the next word', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ text }) => useTypewriter(text, { typingDelay: 0, deletingDelay: 0 }),
      { initialProps: { text: 'hi' } },
    )

    act(() => {
      vi.runAllTimers()
    })
    expect(result.current).toBe('hi')

    rerender({ text: 'bye' })

    act(() => {
      vi.runAllTimers()
    })

    expect(result.current).toBe('bye')
  })

  it('clears pending timers on unmount', () => {
    vi.useFakeTimers()

    const { unmount } = renderHook(() =>
      useTypewriter('abcdef', { typingDelay: 10, deletingDelay: 10 }),
    )

    expect(vi.getTimerCount()).toBeGreaterThan(0)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not schedule a timeout for empty text and cleans up safely', () => {
    vi.useFakeTimers()

    const { result, unmount } = renderHook(() => useTypewriter('', { typingDelay: 10, deletingDelay: 10 }))

    expect(result.current).toBe('')
    expect(vi.getTimerCount()).toBe(0)

    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('ignores stale timer callbacks after cleanup', () => {
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'clearTimeout').mockImplementation(() => {})

    const { unmount } = renderHook(() =>
      useTypewriter('abcdef', { typingDelay: 10, deletingDelay: 10 }),
    )

    expect(vi.getTimerCount()).toBeGreaterThan(0)
    unmount()

    act(() => {
      vi.runOnlyPendingTimers()
    })
  })
})
