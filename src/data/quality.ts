/**
 * Atributos de calidad (ISO 25010) y patrones/tácticas que los cumplen.
 * Fuente: DAS v0.3 (tablas de atributos "observables" y "no observables").
 */
import type { Color } from '../theme'

export type AttrId = 'func' | 'perf' | 'compat' | 'ux' | 'rel' | 'sec' | 'maint' | 'flex' | 'prot'

export interface QualityAttribute {
  id: AttrId
  name: string
  /** Subcaracterística ISO 25010 que el DAS trabaja. */
  sub: string
  color: Color
}

export const attributes: QualityAttribute[] = [
  { id: 'func', name: 'Adecuación funcional', sub: 'Corrección', color: 'cyan' },
  { id: 'perf', name: 'Eficiencia', sub: 'Uso de recursos', color: 'amber' },
  { id: 'compat', name: 'Compatibilidad', sub: 'Interoperabilidad', color: 'blue' },
  { id: 'ux', name: 'Interacción', sub: 'Aprendizaje (API)', color: 'violet' },
  { id: 'rel', name: 'Fiabilidad', sub: 'Tolerancia a fallos', color: 'rose' },
  { id: 'sec', name: 'Seguridad', sub: 'Integridad', color: 'green' },
  { id: 'maint', name: 'Mantenibilidad', sub: 'Modificabilidad', color: 'orange' },
  { id: 'flex', name: 'Flexibilidad', sub: 'Adaptabilidad', color: 'cyan' },
  { id: 'prot', name: 'Protección', sub: 'Fallo seguro', color: 'blue' },
]

export type PatternId = 'outbox' | 'cb' | 'rules' | 'edge' | 'ops'

export interface PatternShowcase {
  id: PatternId
  /** Paso de la diapositiva en el que se presenta. */
  step: number
  title: string
  tagline: string
  attrs: AttrId[]
  color: Color
}

export const patterns: PatternShowcase[] = [
  {
    id: 'outbox',
    step: 1,
    title: 'Transactional Outbox',
    tagline: 'Estado y evento se guardan en la misma transacción: no se pierde ningún mensaje',
    attrs: ['func', 'rel', 'sec'],
    color: 'rose',
  },
  {
    id: 'cb',
    step: 2,
    title: 'Circuit Breaker + Saga',
    tagline: 'Si Vehículos cae, cortamos rápido y compensamos según el flujo',
    attrs: ['rel', 'prot'],
    color: 'amber',
  },
  {
    id: 'rules',
    step: 3,
    title: 'Rule Engine + Strategy',
    tagline: 'Las políticas cambian sin recompilar el scheduler',
    attrs: ['maint', 'prot'],
    color: 'orange',
  },
  {
    id: 'edge',
    step: 4,
    title: 'Borde seguro y contratos',
    tagline: 'Nada llega al núcleo sin pasar por el Gateway y la validación',
    attrs: ['sec', 'ux', 'compat', 'prot'],
    color: 'green',
  },
  {
    id: 'ops',
    step: 5,
    title: 'Recursos y despliegue reproducible',
    tagline: 'Consultas acotadas y el mismo esquema en cada entorno',
    attrs: ['perf', 'flex'],
    color: 'cyan',
  },
]

/** Primer paso en el que un atributo queda cubierto por algún patrón. */
export const coveredAt = (id: AttrId) => Math.min(...patterns.filter((p) => p.attrs.includes(id)).map((p) => p.step))
