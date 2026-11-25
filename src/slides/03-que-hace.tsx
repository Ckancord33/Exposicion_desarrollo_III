import { BarChart3, Bell, Clock, HardHat, TriangleAlert, Truck, Wrench } from 'lucide-react'
import { Chip, SlideFrame } from '../components/ui'
import { Diagram, type DEdge, type DNode } from '../components/Diagram'
import { Reveal } from '../components/Reveal'
import { defineSlide } from '../deck/types'

const nodes: DNode[] = [
  { id: 'sched', x: 40, y: 20, w: 330, h: 120, label: 'Scheduler 02:00', sub: 'cada día', icon: Clock, color: 'violet', at: 1 },
  { id: 'inc', x: 40, y: 480, w: 330, h: 120, label: 'Incidentes', sub: 'otro microservicio', icon: TriangleAlert, color: 'rose', at: 3 },
  { id: 'mant', x: 640, y: 230, w: 460, h: 220, label: 'Mantenimiento', sub: 'órdenes preventivas y correctivas', icon: Wrench, color: 'cyan', glow: true, fontSize: 40 },
  { id: 'veh', x: 1370, y: 20, w: 300, h: 130, label: 'Vehículos', icon: Truck, color: 'green' },
  { id: 'not', x: 1370, y: 285, w: 300, h: 130, label: 'Notificaciones', icon: Bell, color: 'amber', at: 2 },
  { id: 'rep', x: 1370, y: 540, w: 300, h: 130, label: 'Reportes', icon: BarChart3, color: 'blue', at: 4 },
  { id: 'tec', x: 690, y: 540, w: 360, h: 120, label: 'Técnico', sub: 'ejecuta la orden', icon: HardHat, color: 'orange', at: 4 },
]

const edges: DEdge[] = [
  { from: 'sched', to: 'mant', at: 1, color: 'violet', packets: 2 },
  { from: 'mant', to: 'veh', fromSide: 't', toSide: 'l', via: [[870, 85]], at: 1, color: 'green', label: 'consulta flota · bloquea', labelDx: 160, labelDy: -34, packets: 1 },
  { from: 'mant', to: 'not', at: 2, color: 'amber', dashed: true, label: 'evento preventivo', packets: 2 },
  { from: 'inc', to: 'mant', at: 3, color: 'rose', dashed: true, label: 'evento incidente', packets: 2 },
  { from: 'tec', to: 'mant', at: 4, color: 'orange', packets: 1, label: 'avanza · finaliza', labelDx: 100 },
  { from: 'mant', to: 'veh', fromSide: 'r', toSide: 'b', via: [[1520, 340]], at: 4, color: 'green', dashed: true, label: 'libera vehículo', labelDx: -10, labelDy: 70 },
  { from: 'rep', to: 'mant', fromSide: 'l', toSide: 'b', via: [[1110, 605]], at: 4, color: 'blue', label: 'GET /maintenance', labelDx: -30, labelDy: 40 },
]

function QueHace() {
  return (
    <SlideFrame eyebrow="1 · El microservicio" title={<>Qué hace <span className="grad">Mantenimiento</span></>}>
      <Diagram width={1680} height={690} nodes={nodes} edges={edges} />
      <div style={{ position: 'absolute', left: 0, bottom: -10, display: 'flex', gap: 18 }}>
        <Reveal at={1}>
          <Chip color="violet">Preventivo → automático</Chip>
        </Reveal>
        <Reveal at={3}>
          <Chip color="rose">Correctivo → por evento</Chip>
        </Reveal>
        <Reveal at={4}>
          <Chip color="green">Una orden = un vehículo bloqueado hasta cerrar</Chip>
        </Reveal>
      </div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'que-hace',
  section: 'Contexto',
  title: 'Qué hace el microservicio',
  steps: 4,
  minutes: 1.25,
  notes: `
## Qué decir
- Mantenimiento es el servicio que **centraliza las órdenes de mantenimiento** y mantiene la trazabilidad completa de cada una.
- [Paso 1] **Flujo preventivo**: un scheduler interno corre todos los días a las 02:00 (hora Bogotá), consulta la flota activa en Vehículos, aplica las reglas por kilometraje y tiempo, crea la orden y bloquea el vehículo.
- [Paso 2] Al crear la orden preventiva publicamos un evento para que **Notificaciones** avise al administrador y al técnico.
- [Paso 3] **Flujo correctivo**: Incidentes publica un evento cuando un conductor reporta un problema; nosotros lo consumimos y creamos la orden correctiva **ligada al incident_id**. Ahí queda la trazabilidad que antes no existía.
- [Paso 4] El técnico avanza la orden hasta completarla; al completar liberamos el vehículo con un evento. Reportes Operativos consulta nuestras órdenes por HTTP.

## Datos para tener a mano
- Reglas con jerarquía **VEHICULO > CATEGORIA > GLOBAL**.
- Consumimos Incidentes (evento) y Vehículos (HTTP); somos consumidos por Notificaciones, Vehículos y Reportes.

## Cuidado
- No entres al detalle técnico todavía: eso viene en la parte del DAS.
`,
  Component: QueHace,
})
