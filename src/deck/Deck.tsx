import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, Grid2x2, Maximize, StickyNote } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { StepContext } from './context'
import { STAGE_H, STAGE_W } from './constants'
import { NotesPanel, Overview, TimerPill } from './Panels'
import type { SlideDef } from './types'

interface Pos {
  slide: number
  step: number
}

const NOTES_W = 560

function readHash(max: number): Pos {
  const m = /#\/(\d+)(?:\/(\d+))?/.exec(window.location.hash)
  if (!m) return { slide: 0, step: 0 }
  const slide = Math.min(Math.max(parseInt(m[1], 10) - 1, 0), max - 1)
  return { slide, step: m[2] ? parseInt(m[2], 10) : 0 }
}

export function Deck({ slides }: { slides: SlideDef[] }) {
  const [pos, setPos] = useState<Pos>(() => {
    const p = readHash(slides.length)
    return { slide: p.slide, step: Math.min(p.step, slides[p.slide].steps) }
  })
  const [dir, setDir] = useState(1)
  const [notesOpen, setNotesOpen] = useState(false)
  const [overview, setOverview] = useState(false)
  const [timerOn, setTimerOn] = useState(false)
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  const wrapRef = useRef<HTMLDivElement>(null)

  const next = useCallback(() => {
    setPos((p) => {
      if (p.step < slides[p.slide].steps) return { slide: p.slide, step: p.step + 1 }
      if (p.slide < slides.length - 1) {
        setDir(1)
        return { slide: p.slide + 1, step: 0 }
      }
      return p
    })
  }, [slides])

  const prev = useCallback(() => {
    setPos((p) => {
      if (p.step > 0) return { slide: p.slide, step: p.step - 1 }
      if (p.slide > 0) {
        setDir(-1)
        // Al retroceder se muestra la diapositiva anterior ya completa.
        return { slide: p.slide - 1, step: slides[p.slide - 1].steps }
      }
      return p
    })
  }, [slides])

  const goTo = useCallback(
    (i: number) => {
      setPos((p) => {
        setDir(i >= p.slide ? 1 : -1)
        return { slide: i, step: 0 }
      })
    },
    [],
  )

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
        case 'Enter':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault()
          prev()
          break
        case 'Home':
          goTo(0)
          break
        case 'End':
          goTo(slides.length - 1)
          break
        case 'n':
        case 'N':
          setNotesOpen((v) => !v)
          break
        case 't':
        case 'T':
          setTimerOn((v) => !v)
          break
        case 'o':
        case 'O':
        case 'g':
        case 'G':
          setOverview((v) => !v)
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        case 'Escape':
          setOverview(false)
          setNotesOpen(false)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, goTo, toggleFullscreen, slides.length])

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const h = `#/${pos.slide + 1}${pos.step ? `/${pos.step}` : ''}`
    if (window.location.hash !== h) history.replaceState(null, '', h)
  }, [pos])

  const reserve = notesOpen ? NOTES_W : 0
  const scale = Math.min((size.w - reserve) / STAGE_W, size.h / STAGE_H)
  const slide = slides[pos.slide]
  const Slide = slide.Component

  return (
    <div className="deck" ref={wrapRef}>
      <div className="deck-viewport" style={{ width: size.w - reserve }}>
        <div
          className="stage"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <div className="bg-orbs">
            <i className="orb o1" />
            <i className="orb o2" />
            <i className="orb o3" />
          </div>
          <motion.div
            className="progress-bar"
            animate={{ width: `${((pos.slide + (pos.step / Math.max(slide.steps, 1)) * 0.999) / slides.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={pos.slide}
              className="slide-layer"
              custom={dir}
              initial={{ opacity: 0, x: dir * 80, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: dir * -80, filter: 'blur(10px)' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <StepContext.Provider value={{ step: pos.step, slideIndex: pos.slide }}>
                <Slide />
              </StepContext.Provider>
            </motion.div>
          </AnimatePresence>

          <footer className="stage-footer">
            <span>FleetOps · Mantenimiento</span>
            <span className="pips">
              {Array.from({ length: slide.steps }).map((_, i) => (
                <i key={i} className={i < pos.step ? 'on' : ''} />
              ))}
            </span>
            <span>
              {String(pos.slide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </footer>
        </div>
      </div>

      <AnimatePresence>
        {notesOpen && <NotesPanel slide={slide} index={pos.slide} total={slides.length} onClose={() => setNotesOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {overview && (
          <Overview
            slides={slides}
            current={pos.slide}
            onPick={(i) => {
              goTo(i)
              setOverview(false)
            }}
            onClose={() => setOverview(false)}
          />
        )}
      </AnimatePresence>
      {timerOn && <TimerPill slides={slides} current={pos.slide} />}

      <nav className="toolbar" style={{ right: 24 + reserve }}>
        <button onClick={prev} title="Anterior (←)" aria-label="Anterior">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} title="Siguiente (→)" aria-label="Siguiente">
          <ChevronRight size={20} />
        </button>
        <span className="sep" />
        <button className={notesOpen ? 'active' : ''} onClick={() => setNotesOpen((v) => !v)} title="Notas del expositor (N)">
          <StickyNote size={18} /> Notas
        </button>
        <button className={timerOn ? 'active' : ''} onClick={() => setTimerOn((v) => !v)} title="Temporizador (T)">
          <Clock size={18} />
        </button>
        <button onClick={() => setOverview(true)} title="Vista general (O)">
          <Grid2x2 size={18} />
        </button>
        <button onClick={toggleFullscreen} title="Pantalla completa (F)">
          <Maximize size={18} />
        </button>
      </nav>
    </div>
  )
}
