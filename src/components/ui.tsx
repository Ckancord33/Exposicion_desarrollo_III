import { animate, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { useStep } from '../deck/context'
import { colors, rgba, type Color } from '../theme'

/** Marco comun de una diapositiva: etiqueta de seccion, titulo animado y area de contenido. */
export function SlideFrame({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow: string
  title: ReactNode
  sub?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="slide">
      <motion.div
        className="eyebrow"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <span className="eyebrow-dot" />
        {eyebrow}
      </motion.div>
      <motion.h1
        className="h1"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h1>
      {sub && (
        <motion.p
          className="sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          {sub}
        </motion.p>
      )}
      <div className="slide-body">{children}</div>
    </div>
  )
}

export function Chip({
  color = 'cyan',
  icon: Icon,
  children,
  style,
  solid,
}: {
  color?: Color
  icon?: LucideIcon
  children: ReactNode
  style?: CSSProperties
  solid?: boolean
}) {
  return (
    <span
      className="chip"
      style={{
        color: solid ? '#0b1020' : colors[color],
        background: solid ? colors[color] : rgba(color, 0.12),
        borderColor: rgba(color, solid ? 1 : 0.5),
        ...style,
      }}
    >
      {Icon && <Icon size={22} />}
      {children}
    </span>
  )
}

export function IconBadge({ icon: Icon, color = 'cyan', size = 84 }: { icon: LucideIcon; color?: Color; size?: number }) {
  return (
    <div
      className="icon-badge"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${rgba(color, 0.28)}, ${rgba(color, 0.06)})`,
        borderColor: rgba(color, 0.5),
        boxShadow: `0 10px 40px ${rgba(color, 0.25)}`,
      }}
    >
      <Icon size={size * 0.5} color={colors[color]} strokeWidth={1.8} />
    </div>
  )
}

/** Numero que cuenta desde 0 hasta `to` cuando se alcanza el paso `at`. */
export function CountUp({ to, at = 1, suffix = '', duration = 1.4 }: { to: number; at?: number; suffix?: string; duration?: number }) {
  const step = useStep()
  const [value, setValue] = useState(step >= at ? to : 0)
  useEffect(() => {
    if (step >= at) {
      const controls = animate(0, to, { duration, ease: 'easeOut', onUpdate: (v) => setValue(Math.round(v)) })
      return () => controls.stop()
    }
    setValue(0)
  }, [step >= at, to])
  return (
    <>
      {value}
      {suffix}
    </>
  )
}

/** Resaltado minimo para JSON / texto de configuracion. */
function highlight(line: string): ReactNode {
  const parts: ReactNode[] = []
  const regex = /("(?:[^"\\]|\\.)*")(\s*:)?|(\b-?\d+(?:\.\d+)?\b)|(\btrue\b|\bfalse\b|\bnull\b)|(→.*$)|(&|\?)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = regex.exec(line))) {
    if (m.index > last) parts.push(line.slice(last, m.index))
    if (m[1]) parts.push(<span key={i++} className={m[2] ? 'tok-key' : 'tok-str'}>{m[1]}</span>)
    if (m[2]) parts.push(m[2])
    else if (m[3]) parts.push(<span key={i++} className="tok-num">{m[3]}</span>)
    else if (m[4]) parts.push(<span key={i++} className="tok-kw">{m[4]}</span>)
    else if (m[5]) parts.push(<span key={i++} className="tok-evt">{m[5]}</span>)
    else if (m[6]) parts.push(<span key={i++} className="tok-kw">{m[6]}</span>)
    last = regex.lastIndex
  }
  if (last < line.length) parts.push(line.slice(last))
  return parts
}

export function Code({ code, size = 26, style }: { code: string; size?: number; style?: CSSProperties }) {
  return (
    <pre className="code" style={{ fontSize: size, ...style }}>
      {code.split('\n').map((line, i) => (
        <div key={i}>{highlight(line) || ' '}</div>
      ))}
    </pre>
  )
}

/** Ventana de terminal con lineas que aparecen una a una desde el paso `at`. */
export function Terminal({
  title,
  lines,
  at = 1,
  step: perLine = 0.18,
  size = 24,
  style,
}: {
  title: string
  lines: { text: string; color?: Color | 'muted'; prompt?: boolean }[]
  at?: number
  step?: number
  size?: number
  style?: CSSProperties
}) {
  const step = useStep()
  const on = step >= at
  return (
    <div className="terminal" style={style}>
      <div className="terminal-bar">
        <i style={{ background: '#fb7185' }} />
        <i style={{ background: '#fbbf24' }} />
        <i style={{ background: '#34d399' }} />
        <span>{title}</span>
      </div>
      <div className="terminal-body" style={{ fontSize: size }}>
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: on ? 1 : 0, x: on ? 0 : -12 }}
            transition={{ duration: 0.35, delay: on ? i * perLine : 0 }}
            style={{ color: l.color === 'muted' ? '#7c8aa5' : l.color ? colors[l.color] : '#e2e8f0' }}
          >
            {l.prompt && <span style={{ color: colors.green }}>$ </span>}
            {l.text || ' '}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/** Pequena barra de "check" animada para pipelines. */
export function StatusDot({ state, color = 'green' }: { state: 'idle' | 'run' | 'ok'; color?: Color }) {
  return (
    <span
      className={`status-dot ${state}`}
      style={{ ['--c' as string]: colors[color], ['--cb' as string]: rgba(color, 0.35) }}
    />
  )
}
