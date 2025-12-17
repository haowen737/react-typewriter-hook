import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import useTypewriter from '../src/useTypewriter'

describe('useTypewriter', () => {
  it('types a word and stops at the full text', () => {
    vi.useFakeTimers()

    const { result } = renderHook(() =>
      useTypewriter('abc', { typingDelay: 0, deletingDelay: 0 }),
    )

    act(() => {
      vi.runAllTimers()
    })

    expect(result.current).toBe('abc')
    vi.useRealTimers()
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
    vi.useRealTimers()
  })
})

