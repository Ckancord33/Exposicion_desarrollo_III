import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useStep } from '../deck/context'
import { colors, rgba, type Color } from '../theme'

export type Side = 'l' | 'r' | 't' | 'b'

export interface DNode {
  id: string
  x: number
  y: number
  w: number
  h: number
  label?: ReactNode
  sub?: ReactNode
  icon?: LucideIcon
  color?: Color
  at?: number
  until?: number
  shape?: 'box' | 'pill' | 'circle' | 'hex' | 'plain'
  /** Contenido libre (por ejemplo una tabla de BD) en lugar de icono + texto. */
  content?: ReactNode
  glow?: boolean
  dim?: boolean
  z?: number
  fontSize?: number
  /** Alinea el texto al inicio en lugar del centro. */
  align?: 'center' | 'start'
}

export interface DEdge {
  from: string
  to: string
  fromSide?: Side
  toSide?: Side
  /** Puntos intermedios opcionales (coordenadas del diagrama). */
  via?: [number, number][]
  label?: string
  at?: number
  until?: number
  color?: Color
  /** Cantidad de "paquetes" que viajan por la linea. */
  packets?: number
  dashed?: boolean
  arrow?: 'end' | 'both' | 'none'
  labelDx?: number
  labelDy?: number
  /** Si es true, los paquetes viajan de to -> from. */
  reverse?: boolean
}

interface Props {
  width: number
  height: number
  nodes: DNode[]
  edges?: DEdge[]
}

type Pt = [number, number]

function anchor(n: DNode, side: Side): Pt {
  switch (side) {
    case 'l':
      return [n.x, n.y + n.h / 2]
    case 'r':
      return [n.x + n.w, n.y + n.h / 2]
    case 't':
      return [n.x + n.w / 2, n.y]
    default:
      return [n.x + n.w / 2, n.y + n.h]
  }
}

function autoSides(a: DNode, b: DNode): [Side, Side] {
  const dx = b.x + b.w / 2 - (a.x + a.w / 2)
  const dy = b.y + b.h / 2 - (a.y + a.h / 2)
  if (Math.abs(dx) * 0.55 >= Math.abs(dy)) return dx >= 0 ? ['r', 'l'] : ['l', 'r']
  return dy >= 0 ? ['b', 't'] : ['t', 'b']
}

function route(a: DNode, b: DNode, e: DEdge): Pt[] {
  const [fs0, ts0] = autoSides(a, b)
  const fs = e.fromSide ?? fs0
  const ts = e.toSide ?? ts0
  const p1 = anchor(a, fs)
  const p2 = anchor(b, ts)
  if (e.via?.length) return [p1, ...e.via, p2]
  const horizontal = fs === 'l' || fs === 'r'
  if (horizontal) {
    if (Math.abs(p1[1] - p2[1]) < 3) return [p1, [p2[0], p1[1]]]
    const mx = (p1[0] + p2[0]) / 2
    return [p1, [mx, p1[1]], [mx, p2[1]], p2]
  }
  if (Math.abs(p1[0] - p2[0]) < 3) return [p1, [p1[0], p2[1]]]
  const my = (p1[1] + p2[1]) / 2
  return [p1, [p1[0], my], [p2[0], my], p2]
}

function length(pts: Pt[]) {
  let total = 0
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  return total
}

function pointAt(pts: Pt[], ratio: number): Pt {
  const target = length(pts) * ratio
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    if (acc + seg >= target) {
      const t = seg === 0 ? 0 : (target - acc) / seg
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t]
    }
    acc += seg
  }
  return pts[pts.length - 1]
}

const angle = (a: Pt, b: Pt) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI

function NodeView({ n }: { n: DNode }) {
  const step = useStep()
  const at = n.at ?? 0
  const visible = step >= at && (n.until === undefined || step < n.until)
  const c = n.color ?? 'cyan'
  const col = colors[c]
  const Icon = n.icon
  const radius = n.shape === 'pill' ? 999 : n.shape === 'circle' ? '50%' : 22
  const isHex = n.shape === 'hex'
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? (n.dim ? 0.45 : 1) : 0, scale: visible ? 1 : 0.8 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={n.glow && visible ? 'dnode pulse' : 'dnode'}
      style={{
        left: n.x,
        top: n.y,
        width: n.w,
        height: n.h,
        zIndex: n.z ?? 2,
        borderRadius: radius,
        background: n.shape === 'plain' || isHex ? 'transparent' : rgba(c, 0.13),
        border: n.shape === 'plain' || isHex ? 'none' : `2px solid ${rgba(c, 0.6)}`,
        color: '#fff',
        alignItems: n.align === 'start' ? 'flex-start' : 'center',
        textAlign: n.align === 'start' ? 'left' : 'center',
        ['--glow' as string]: rgba(c, 0.55),
      }}
    >
      {isHex && (
        <svg className="dnode-hex" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon
            points="25,3 75,3 98,50 75,97 25,97 2,50"
            fill={rgba(c, 0.1)}
            stroke={rgba(c, 0.7)}
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      {n.content ?? (
        <>
          {Icon && <Icon size={Math.min(54, n.h * 0.38)} color={col} strokeWidth={1.8} />}
          {n.label && <div className="dnode-label" style={{ fontSize: n.fontSize ?? 28 }}>{n.label}</div>}
          {n.sub && <div className="dnode-sub">{n.sub}</div>}
        </>
      )}
    </motion.div>
  )
}

function EdgeView({ e, nodes }: { e: DEdge; nodes: Record<string, DNode> }) {
  const step = useStep()
  const a = nodes[e.from]
  const b = nodes[e.to]
  if (!a || !b) return null
  const visible = step >= (e.at ?? 0) && (e.until === undefined || step < e.until)
  const pts = route(a, b, e)
  const col = colors[e.color ?? 'cyan']
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')
  const len = length(pts)
  const packets = e.packets ?? 0
  const dur = Math.max(1.8, len / 330)
  const arrow = e.arrow ?? 'end'
  const last = pts[pts.length - 1]
  const prev = pts[pts.length - 2]
  const first = pts[0]
  const second = pts[1]
  const motionPath = e.reverse ? pts.slice().reverse().map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') : d
  return (
    <>
      <g style={{ pointerEvents: 'none' }}>
        <motion.path
          d={d}
          fill="none"
          stroke={col}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={e.dashed ? '10 10' : undefined}
          initial={false}
          animate={{ pathLength: visible ? 1 : 0, opacity: visible ? 0.85 : 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        {visible && packets > 0 &&
          Array.from({ length: packets }).map((_, i) => (
            <circle key={i} r={7} fill={col} style={{ filter: `drop-shadow(0 0 8px ${col})` }}>
              <animateMotion dur={`${dur}s`} begin={`${0.8 + (i * dur) / packets}s`} repeatCount="indefinite" path={motionPath} />
            </circle>
          ))}
        {(arrow === 'end' || arrow === 'both') && (
          <motion.polygon
            points="0,0 -18,-9 -18,9"
            fill={col}
            initial={false}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.3, delay: visible ? 0.6 : 0 }}
            transform={`translate(${last[0]},${last[1]}) rotate(${angle(prev, last)})`}
          />
        )}
        {arrow === 'both' && (
          <motion.polygon
            points="0,0 -18,-9 -18,9"
            fill={col}
            initial={false}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.3, delay: visible ? 0.6 : 0 }}
            transform={`translate(${first[0]},${first[1]}) rotate(${angle(second, first)})`}
          />
        )}
      </g>
    </>
  )
}

function EdgeLabel({ e, nodes }: { e: DEdge; nodes: Record<string, DNode> }) {
  const step = useStep()
  const a = nodes[e.from]
  const b = nodes[e.to]
  if (!a || !b || !e.label) return null
  const visible = step >= (e.at ?? 0) && (e.until === undefined || step < e.until)
  const mid = pointAt(route(a, b, e), 0.5)
  const col = colors[e.color ?? 'cyan']
  return (
    <motion.div
      className="dedge-label"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
      transition={{ duration: 0.45, delay: visible ? 0.55 : 0 }}
      style={{ left: mid[0] + (e.labelDx ?? 0), top: mid[1] + (e.labelDy ?? 0), borderColor: rgba(col, 0.55), color: col }}
    >
      {e.label}
    </motion.div>
  )
}

/**
 * Diagrama animado: nodos posicionados en coordenadas absolutas y flechas que se dibujan
 * (con paquetes viajeros) segun el paso actual. Todo se declara con datos, sin SVG a mano.
 */
export function Diagram({ width, height, nodes, edges = [] }: Props) {
  const map = Object.fromEntries(nodes.map((n) => [n.id, n]))
  return (
    <div className="diagram" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="diagram-svg">
        {edges.map((e, i) => (
          <EdgeView key={i} e={e} nodes={map} />
        ))}
      </svg>
      {nodes.map((n) => (
        <NodeView key={n.id} n={n} />
      ))}
      {edges.map((e, i) => (
        <EdgeLabel key={i} e={e} nodes={map} />
      ))}
    </div>
  )
}
