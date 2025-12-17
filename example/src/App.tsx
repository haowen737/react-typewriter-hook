import { useMemo, useState } from 'react'
import useTypewriter, { useTypewriterSequence } from 'react-typewriter-hook'

const defaultSequenceWords = ['vue', 'react', 'angular', 'svelte'] as const

function parseWordsInput(input: string): string[] {
  const trimmed = input.trim()
  if (!trimmed) return []

  try {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed)) return parsed.map((v) => String(v))
  } catch {
    // ignore
  }

  return trimmed
    .split(/[\n,]+/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

export default function App() {
  const [singleInput, setSingleInput] = useState('Use react hooks for typing effect easily')
  const [singleTarget, setSingleTarget] = useState(singleInput)

  const [sequenceInput, setSequenceInput] = useState(
    JSON.stringify([...defaultSequenceWords], null, 2),
  )
  const [sequenceWords, setSequenceWords] = useState<readonly string[]>([...defaultSequenceWords])
  const [sequencePauseMs, setSequencePauseMs] = useState(1700)
  const [sequenceLoop, setSequenceLoop] = useState(true)
  const [typingMinMs, setTypingMinMs] = useState(90)
  const [typingMaxMs, setTypingMaxMs] = useState(170)
  const [deletingMinMs, setDeletingMinMs] = useState(55)
  const [deletingMaxMs, setDeletingMaxMs] = useState(120)

  const typing = useTypewriter(
    singleTarget,
    useMemo(() => ({ typingDelay: [90, 160], deletingDelay: [55, 120] }), []),
  )
  const sequenceOptions = useMemo(
    () => ({
      pauseMs: sequencePauseMs,
      loop: sequenceLoop,
      typingDelay: [typingMinMs, typingMaxMs] as const,
      deletingDelay: [deletingMinMs, deletingMaxMs] as const,
    }),
    [deletingMaxMs, deletingMinMs, sequenceLoop, sequencePauseMs, typingMaxMs, typingMinMs],
  )
  const sequenceTyping = useTypewriterSequence(sequenceWords, sequenceOptions)

  const singleCode = `import useTypewriter from "react-typewriter-hook";

function MagicWriter(word) {
  const typing = useTypewriter(word, {
    typingDelay: [90, 160],
    deletingDelay: [55, 120],
  });
  return typing ?? "";
}`

  const sequenceCode = `import { useTypewriterSequence } from "react-typewriter-hook";

const words = ["vue", "react", "angular", "svelte"];

function MagicSequence() {
  const typing = useTypewriterSequence(words, {
    pauseMs: 1700,
    loop: true,
    typingDelay: [90, 170],
    deletingDelay: [55, 120],
  });
  return typing ?? "";
}`

  return (
    <div className="page">
      <header className="header">
        <div className="title">react-typewriter-hook</div>
        <div className="subtitle">GitHub Pages demo</div>
      </header>

      <main className="stack">
        <section className="card">
          <div className="sectionTitle">useTypewriterSequence</div>
          <div className="output">{sequenceTyping ?? ''}</div>

          <details className="codeDetails">
            <summary className="codeSummary">Code</summary>
            <pre className="codePre">
              <code>{sequenceCode}</code>
            </pre>
          </details>

          <label className="label" htmlFor="sequenceInput">
            words (JSON array or comma/newline separated)
          </label>
          <textarea
            id="sequenceInput"
            className="textarea"
            rows={5}
            value={sequenceInput}
            onChange={(event) => setSequenceInput(event.target.value)}
            placeholder='["vue","react","angular","svelte"]'
          />

          <div className="optionsGrid" aria-label="useTypewriterSequence options">
            <label className="field">
              <div className="fieldLabel">pauseMs</div>
              <input
                className="input"
                type="number"
                min={0}
                step={100}
                value={sequencePauseMs}
                onChange={(event) => setSequencePauseMs(Math.max(0, Number(event.target.value)))}
              />
            </label>

            <label className="field checkboxField">
              <div className="fieldLabel">loop</div>
              <input
                className="checkbox"
                type="checkbox"
                checked={sequenceLoop}
                onChange={(event) => setSequenceLoop(event.target.checked)}
              />
            </label>

            <label className="field">
              <div className="fieldLabel">typingDelay min</div>
              <input
                className="input"
                type="number"
                min={0}
                step={10}
                value={typingMinMs}
                onChange={(event) => setTypingMinMs(Math.max(0, Number(event.target.value)))}
              />
            </label>

            <label className="field">
              <div className="fieldLabel">typingDelay max</div>
              <input
                className="input"
                type="number"
                min={0}
                step={10}
                value={typingMaxMs}
                onChange={(event) => setTypingMaxMs(Math.max(0, Number(event.target.value)))}
              />
            </label>

            <label className="field">
              <div className="fieldLabel">deletingDelay min</div>
              <input
                className="input"
                type="number"
                min={0}
                step={10}
                value={deletingMinMs}
                onChange={(event) => setDeletingMinMs(Math.max(0, Number(event.target.value)))}
              />
            </label>

            <label className="field">
              <div className="fieldLabel">deletingDelay max</div>
              <input
                className="input"
                type="number"
                min={0}
                step={10}
                value={deletingMaxMs}
                onChange={(event) => setDeletingMaxMs(Math.max(0, Number(event.target.value)))}
              />
            </label>
          </div>

          <div className="actions">
            <button
              className="button"
              onClick={() => {
                setSequenceWords(parseWordsInput(sequenceInput))
              }}
            >
              Start
            </button>
            <button
              className="button buttonSecondary"
              onClick={() => {
                const next = JSON.stringify([...defaultSequenceWords], null, 2)
                setSequenceInput(next)
                setSequenceWords([...defaultSequenceWords])
                setSequencePauseMs(1700)
                setSequenceLoop(true)
                setTypingMinMs(90)
                setTypingMaxMs(170)
                setDeletingMinMs(55)
                setDeletingMaxMs(120)
              }}
            >
              Reset
            </button>
          </div>
        </section>

        <section className="card">
          <div className="sectionTitle">useTypewriter</div>
          <div className="output">{typing ?? ''}</div>

          <details className="codeDetails">
            <summary className="codeSummary">Code</summary>
            <pre className="codePre">
              <code>{singleCode}</code>
            </pre>
          </details>

          <label className="label" htmlFor="singleInput">
            text
          </label>
          <textarea
            id="singleInput"
            className="textarea"
            rows={4}
            value={singleInput}
            onChange={(event) => setSingleInput(event.target.value)}
            placeholder="Write something interesting..."
          />

          <div className="actions">
            <button className="button" onClick={() => setSingleTarget(singleInput)}>
              Start
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
