import { Bell, CheckCircle2, Cloud, Inbox, Layers, ShieldAlert, TriangleAlert, Truck, Wrench } from 'lucide-react'
import { Diagram, type DEdge, type DNode } from '../components/Diagram'
import { Reveal } from '../components/Reveal'
import { Chip, Code, SlideFrame } from '../components/ui'
import { defineSlide } from '../deck/types'

const nodes: DNode[] = [
  { id: 'inc', x: 10, y: 120, w: 220, h: 125, label: 'MS Incidentes', sub: 'POST /incidents', icon: TriangleAlert, color: 'rose', at: 1 },
  { id: 'broker', x: 490, y: 120, w: 270, h: 125, label: 'Broker (CloudEvents)', sub: 'AWS SNS/SQS · antes RabbitMQ', icon: Cloud, color: 'amber', at: 1 },
  { id: 'dlq', x: 515, y: 315, w: 220, h: 95, label: 'DLQ', sub: 'tras 3 reintentos', icon: ShieldAlert, color: 'rose', at: 1 },
  { id: 'mnt', x: 970, y: 95, w: 260, h: 175, label: 'MS Mantenimiento', sub: 'Idempotente + Outbox', icon: Wrench, color: 'cyan', glow: true },
  { id: 'not', x: 1465, y: 15, w: 210, h: 120, label: 'MS Notificaciones', sub: 'alerta por correo', icon: Bell, color: 'violet', at: 2 },
  { id: 'veh', x: 1465, y: 230, w: 210, h: 120, label: 'MS Vehículos', sub: 'vuelve a ACTIVO', icon: Truck, color: 'green', at: 3 },
]

const edges: DEdge[] = [
  { from: 'inc', to: 'broker', at: 1, color: 'rose', packets: 2, label: 'incidente.reportado', labelDx: -78 },
  { from: 'broker', to: 'mnt', at: 1, color: 'rose', packets: 2, label: 'crea correctivo', labelDx: -62 },
  { from: 'broker', to: 'dlq', at: 1, color: 'rose', dashed: true, label: 'fallo', labelDx: 18 },
  { from: 'mnt', to: 'not', at: 2, color: 'violet', packets: 2, label: 'PreventivoRequerido', labelDx: -80 },
  { from: 'mnt', to: 'veh', at: 3, color: 'green', packets: 2, label: 'MantenimientoFinalizado', labelDx: -94 },
]

const cloudEventExample = `{
  "specversion": "1.0",
  "id": "evt-inc-8a9d1e34-5f67-4890",
  "type": "com.fleetops.incidentes.reportado",
  "source": "/servicios/ms-incidentes",
  "time": "2026-10-18T16:30:00Z",
  "data": { "incidente_id": "4b6c…", "vehiculo_id": "018f…", "tipo_incidente": "ACCIDENTE_GRAVE" }
}`

function Eventos() {
  return (
    <SlideFrame
      eyebrow="5 · Arquitectura Orientada a Eventos"
      title={
        <>
          Eventos <span className="grad">Entrantes y Salientes</span> (CloudEvents v1.0)
        </>
      }
    >
      <div className="eventos-diagram">
        <style>{`
          .eventos-diagram .dedge-label {
            font-size: 14px !important;
            padding: 3px 10px !important;
          }
        `}</style>
        <Diagram width={1680} height={425} nodes={nodes} edges={edges} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 640px', gap: 28, marginTop: 18, alignItems: 'center' }}>
        <Reveal at={2} from="left">
          <Code code={cloudEventExample} size={19} />
        </Reveal>

        <Reveal at={3} from="right">
          <div className="card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 23, fontWeight: 700 }}>
              <Layers size={24} color="#22d3ee" /> Garantías en producción
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <Chip color="rose" icon={Inbox} style={{ fontSize: 18 }}>Idempotencia por incident_id / event_id</Chip>
              <Chip color="amber" icon={CheckCircle2} style={{ fontSize: 18 }}>Transactional Outbox + SKIP LOCKED</Chip>
              <Chip color="cyan" style={{ fontSize: 18 }}>Evolución en repo: RabbitMQ → AWS SNS / SQS</Chip>
            </div>
          </div>
        </Reveal>
      </div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'eventos',
  section: 'Eventos',
  title: 'Catálogo de Eventos',
  steps: 3,
  minutes: 1.25,
  notes: `
## Qué decir
- Nuestra comunicación asíncrona sigue la especificación **CloudEvents v1.0** (sobre estándar con \`specversion\`, \`id\`, \`type\`, \`source\`, \`time\` y \`data\`).
- [Paso 1] **Evento entrante (\`IncidenteReportadoEvent\`)**: publicado por MS Incidentes cuando hay un choque o falla. Nuestro consumidor es **idempotente** (revisa \`incident_id\` antes de insertar, respaldado por índice único en BD); si algo falla reintenta hasta **3 veces** y luego lo aísla en una **DLQ**.
- [Paso 2] **Evento saliente 1 (\`MantenimientoPreventivoRequeridoEvent\`)**: se emite tras el Scheduler de las 02:00 AM para que **Notificaciones** avise al administrador y al técnico.
- [Paso 3] **Evento saliente 2 (\`MantenimientoFinalizadoEvent\`)**: se emite cuando el técnico pasa una orden a \`COMPLETADO\`; **MS Vehículos** lo escucha y vuelve a poner el vehículo en \`ACTIVO\`.
- **Evolución técnica real en el repo**: en el DAS inicial planeamos RabbitMQ, y en la implementación más reciente en \`develop\` (PR #21) migramos la mensajería a **AWS SNS / SQS** usando Spring Cloud AWS para aprovechar los servicios administrados en la nube sin perder el patrón **Transactional Outbox**.
`,
  Component: Eventos,
})