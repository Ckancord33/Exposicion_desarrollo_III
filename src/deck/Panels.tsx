import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { config } from '../config'
import type { SlideDef } from './types'

/** Renderizador minimo para las notas: "## titulo", "- viñeta", **negrita** y `codigo`. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>
    return part
  })
}

function renderNotes(notes: string): ReactNode[] {
  return notes
    .trim()
    .split('\n')
    .map((raw, i) => {
      const line = raw.trim()
      if (!line) return <div key={i} style={{ height: 10 }} />
      if (line.startsWith('## ')) return <h4 key={i}>{line.slice(3)}</h4>
      if (line.startsWith('- ')) return <li key={i}>{inline(line.slice(2))}</li>
      return <p key={i}>{inline(line)}</p>
    })
}

export function NotesPanel({ slide, index, total, onClose }: { slide: SlideDef; index: number; total: number; onClose: () => void }) {
  return (
    <motion.aside
      className="notes"
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header>
        <div>
          <small>
            Diapositiva {index + 1} / {total} · ~{slide.minutes} min
            {slide.presenter ? ` · ${slide.presenter}` : ''}
          </small>
          <h3>{slide.title}</h3>
        </div>
        <button onClick={onClose} aria-label="Cerrar notas">
          <X size={22} />
        </button>
      </header>
      <div className="notes-body">{renderNotes(slide.notes)}</div>
    </motion.aside>
  )
}

export function Overview({
  slides,
  current,
  onPick,
  onClose,
}: {
  slides: SlideDef[]
  current: number
  onPick: (i: number) => void
  onClose: () => void
}) {
  const total = slides.reduce((a, s) => a + s.minutes, 0)
  return (
    <motion.div className="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <div className="overview-inner" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>Vista general</h2>
          <span>
            Plan: {total.toFixed(1)} min de {config.totalMinutes} · {slides.length} diapositivas
          </span>
        </header>
        <div className="overview-grid">
          {slides.map((s, i) => (
            <button key={s.id} className={i === current ? 'current' : ''} onClick={() => onPick(i)}>
              <small>
                {String(i + 1).padStart(2, '0')} · {s.section}
              </small>
              <strong>{s.title}</strong>
              <em>
                {s.minutes} min · {s.steps} pasos
              </em>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const fmt = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/** Temporizador del expositor: compara el tiempo real con el plan acumulado de cada diapositiva. */
export function TimerPill({ slides, current }: { slides: SlideDef[]; current: number }) {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!running) return
    const t0 = Date.now() - elapsed
    const id = setInterval(() => setElapsed(Date.now() - t0), 250)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])
  const planned = useMemo(
    () => slides.slice(0, current + 1).reduce((a, s) => a + s.minutes, 0) * 60_000,
    [slides, current],
  )
  const limit = config.totalMinutes * 60_000
  const diff = elapsed - planned
  const tone = elapsed > limit ? 'bad' : diff > 30_000 ? 'warn' : 'ok'
  return (
    <div className={`timer ${tone}`}>
      <button onClick={() => setRunning((r) => !r)} aria-label={running ? 'Pausar' : 'Iniciar'}>
        {running ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <span className="timer-main">{fmt(elapsed)}</span>
      <span className="timer-sub">
        / {fmt(limit)} · plan {fmt(planned)}
      </span>
      <button
        onClick={() => {
          setRunning(false)
          setElapsed(0)
        }}
        aria-label="Reiniciar"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  )
}
