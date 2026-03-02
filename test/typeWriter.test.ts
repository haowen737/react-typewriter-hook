import { afterEach, describe, expect, it, vi } from 'vitest'

import Typewriter from '../src/typeWriter'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Typewriter', () => {
  it('uses default delays when options are omitted', () => {
    const writer = new Typewriter()

    vi.spyOn(Math, 'random').mockReturnValue(0)
    writer.setTargetText('x')
    expect(writer.getDelayMs()).toBe(90)
  })

  it('normalizes nullish target text to empty string', () => {
    const writer = new Typewriter({ typingDelay: 0, deletingDelay: 0 })

    writer.setTargetText(undefined as unknown as string)
    expect(writer.isIdle()).toBe(true)
    expect(writer.tick()).toBe('')
  })

  it('stays idle when setting the same target text', () => {
    const writer = new Typewriter({ typingDelay: 0, deletingDelay: 0 })

    writer.setTargetText('ab')
    expect(writer.tick()).toBe('a')
    expect(writer.tick()).toBe('ab')
    expect(writer.isIdle()).toBe(true)

    writer.setTargetText('ab')
    expect(writer.isIdle()).toBe(true)
    expect(writer.tick()).toBe('ab')
  })

  it('deletes current text before typing the next target', () => {
    const writer = new Typewriter({ typingDelay: 0, deletingDelay: 0 })

    writer.setTargetText('abc')
    expect(writer.tick()).toBe('a')
    expect(writer.tick()).toBe('ab')
    expect(writer.tick()).toBe('abc')
    expect(writer.isIdle()).toBe(true)

    writer.setTargetText('d')
    expect(writer.tick()).toBe('ab')
    expect(writer.tick()).toBe('a')
    expect(writer.tick()).toBe('')
    expect(writer.tick()).toBe('d')
    expect(writer.isIdle()).toBe(true)
  })

  it('returns idle from typing mode when deleting to an empty target', () => {
    const writer = new Typewriter({ typingDelay: 0, deletingDelay: 0 })

    writer.setTargetText('a')
    expect(writer.tick()).toBe('a')

    writer.setTargetText('')
    expect(writer.tick()).toBe('')
    expect(writer.tick()).toBe('')
    expect(writer.isIdle()).toBe(true)
  })

  it('normalizes delays for numeric and reversed range options', () => {
    const writer = new Typewriter({
      typingDelay: [10, 5],
      deletingDelay: [7, 3],
    })

    vi.spyOn(Math, 'random').mockReturnValue(0).mockReturnValueOnce(0).mockReturnValueOnce(0.999999)

    writer.setTargetText('x')
    expect(writer.getDelayMs()).toBe(5)
    expect(writer.getDelayMs()).toBe(10)
    expect(writer.tick()).toBe('x')

    writer.setTargetText('')
    expect(writer.getDelayMs()).toBe(3)
  })

  it('clamps negative numeric delays to zero', () => {
    const writer = new Typewriter({ typingDelay: -5, deletingDelay: -1 })

    writer.setTargetText('a')
    expect(writer.getDelayMs()).toBe(0)
    expect(writer.tick()).toBe('a')

    writer.setTargetText('')
    expect(writer.getDelayMs()).toBe(0)
  })
})
