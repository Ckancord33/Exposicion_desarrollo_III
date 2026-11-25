/**
 * Product Backlog del microservicio de Mantenimiento.
 * Fuente: Mantenimiento_ProductBacklogV2.0.xlsx (hojas "Estimacion y Priorizacion" y "Sprint Backlog").
 */
export type Moscow = 'Must' | 'Should' | 'Could'
export type Actor = 'admin' | 'tecnico'

export interface Story {
  id: string
  actor: Actor
  title: string
  points: number
  moscow: Moscow
}

export const stories: Story[] = [
  { id: 'HU-01', actor: 'admin', title: 'Parametrizar reglas preventivas', points: 5, moscow: 'Must' },
  { id: 'HU-02', actor: 'admin', title: 'Scheduler preventivo multicriterio', points: 21, moscow: 'Must' },
  { id: 'HU-03', actor: 'admin', title: 'Registrar orden manual', points: 3, moscow: 'Must' },
  { id: 'HU-04', actor: 'admin', title: 'Procesar incidente → orden correctiva', points: 13, moscow: 'Must' },
  { id: 'HU-05', actor: 'admin', title: 'Listar y filtrar órdenes', points: 5, moscow: 'Must' },
  { id: 'HU-06', actor: 'admin', title: 'Consultar detalle de una orden', points: 3, moscow: 'Could' },
  { id: 'HU-07', actor: 'tecnico', title: 'Ver mis órdenes asignadas', points: 5, moscow: 'Must' },
  { id: 'HU-08', actor: 'tecnico', title: 'Actualizar estado y finalizar', points: 5, moscow: 'Must' },
  { id: 'HU-09', actor: 'tecnico', title: 'Registrar avances', points: 8, moscow: 'Should' },
]

export const totalPoints = stories.reduce((acc, s) => acc + s.points, 0) // 68

export interface SprintItem {
  label: string
  /** Puntos tal como figuran en la hoja "Sprint Backlog". */
  points: number
  moscow: Moscow
}

export interface Sprint {
  name: string
  items: SprintItem[]
  total: number
}

// Duracion del sprint: 1 semana. Compromiso por sprint: 16 puntos.
export const sprints: Sprint[] = [
  { name: 'Sprint 1', total: 15, items: [{ label: 'HU-01', points: 15, moscow: 'Must' }] },
  {
    name: 'Sprint 2',
    total: 16,
    items: [
      { label: 'HU-04', points: 13, moscow: 'Must' },
      { label: 'HU-03', points: 3, moscow: 'Must' },
    ],
  },
  { name: 'Sprint 3', total: 16, items: [{ label: 'HU-02 · fase 1', points: 16, moscow: 'Must' }] },
  {
    name: 'Sprint 4',
    total: 15,
    items: [
      { label: 'HU-02 · fase 2', points: 5, moscow: 'Must' },
      { label: 'HU-05', points: 5, moscow: 'Must' },
      { label: 'HU-07', points: 5, moscow: 'Must' },
    ],
  },
  {
    name: 'Sprint 5',
    total: 16,
    items: [
      { label: 'HU-09', points: 8, moscow: 'Should' },
      { label: 'HU-08', points: 5, moscow: 'Must' },
      { label: 'HU-06', points: 3, moscow: 'Could' },
    ],
  },
]

export const sprintConfig = { weeks: 1, commitment: 16, count: 5 }
