import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { useStep } from '../deck/context'

type From = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade' | 'pop'

const offsets: Record<From, { x?: number; y?: number; scale?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: -60 },
  right: { x: 60 },
  scale: { scale: 0.85 },
  pop: { scale: 0.4 },
  fade: {},
}

interface RevealProps {
  /** Paso desde el cual el contenido aparece (1 = primer →). 0 = visible desde el inicio. */
  at?: number
  /** Paso en el que desaparece (opcional). */
  until?: number
  from?: From
  delay?: number
  duration?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/**
 * Muestra su contenido cuando el paso actual alcanza `at`.
 * Mantiene su espacio en el layout aunque este oculto, para que nada "salte".
 */
export function Reveal({
  at = 1,
  until,
  from = 'up',
  delay = 0,
  duration = 0.65,
  className,
  style,
  children,
}: RevealProps) {
  const step = useStep()
  const visible = step >= at && (until === undefined || step < until)
  const hidden = { opacity: 0, x: 0, y: 0, scale: 1, ...offsets[from] }
  return (
    <motion.div
      className={className}
      style={{ ...style, pointerEvents: visible ? undefined : 'none' }}
      initial={false}
      animate={visible ? { opacity: 1, x: 0, y: 0, scale: 1 } : hidden}
      transition={{ duration, delay: visible ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
