import { ArrowRight, Bell, Box, Clock, Cloud, Database, DoorOpen, Globe, Inbox, Layers, Plug, RefreshCw, ShieldCheck, Truck } from 'lucide-react'
import { Diagram, type DEdge, type DNode } from '../components/Diagram'
import { Reveal } from '../components/Reveal'
import { Chip, SlideFrame } from '../components/ui'
import { defineSlide } from '../deck/types'
import { colors, rgba } from '../theme'

/*
 * Pasos:
 *  0  Hexágono vacío
 *  1  Núcleo: Aplicación + Dominio (Java 21 puro)
 *  2  Puertos de entrada + adaptadores de entrada (+ API Gateway y broker de entrada)
 *  3  Puertos de salida + adaptadores de salida (+ PostgreSQL, MS Vehículos, broker)
 *  4  Regla de dependencia
 *  5  Prueba real: RabbitMQ (DAS v0.3) -> AWS SNS/SQS (develop, PR #21) solo cambia adaptadores
 */
const SWAP = 5

const nodes: DNode[] = [
  // ---- Externos (izquierda)
  { id: 'gw', x: 0, y: 25, w: 190, h: 110, label: 'API Gateway', sub: 'JWT · rate limit', icon: DoorOpen, color: 'slate', at: 2, fontSize: 22 },
  { id: 'mqIn', x: 0, y: 265, w: 190, h: 110, label: 'RabbitMQ', sub: 'cola incidentes', icon: Inbox, color: 'orange', at: 2, until: SWAP, fontSize: 22 },
  { id: 'sqsIn', x: 0, y: 265, w: 190, h: 110, label: 'AWS SQS', sub: 'cola incidentes', icon: Inbox, color: 'amber', at: SWAP, glow: true, fontSize: 22 },

  // ---- Adaptadores de entrada
  { id: 'rest', x: 240, y: 25, w: 290, h: 100, label: 'REST Controllers', sub: 'Rule · Order · DTO @Valid', icon: Globe, color: 'cyan', at: 2, fontSize: 22 },
  { id: 'sched', x: 240, y: 145, w: 290, h: 100, label: 'Scheduler', sub: '@Scheduled 02:00 Bogotá', icon: Clock, color: 'violet', at: 2, fontSize: 22 },
  { id: 'lstOld', x: 240, y: 265, w: 290, h: 100, label: 'Incident Listener', sub: '@RabbitListener', icon: Bell, color: 'orange', at: 2, until: SWAP, fontSize: 22 },
  { id: 'lstNew', x: 240, y: 265, w: 290, h: 100, label: 'Incident Listener', sub: '@SqsListener', icon: Bell, color: 'amber', at: SWAP, glow: true, fontSize: 22 },
  { id: 'relay', x: 240, y: 385, w: 290, h: 100, label: 'Outbox Relay', sub: '@Scheduled · SKIP LOCKED', icon: RefreshCw, color: 'rose', at: 2, fontSize: 22 },

  // ---- Hexágono (núcleo)
  { id: 'hex', x: 585, y: 0, w: 670, h: 510, shape: 'hex', color: 'cyan', at: 0, z: 1 },
  { id: 'pin', x: 668, y: 170, w: 140, h: 170, label: 'Puertos IN', sub: '9 casos de uso', icon: Plug, color: 'violet', at: 2, z: 3, fontSize: 21 },
  { id: 'app', x: 825, y: 70, w: 190, h: 150, label: 'Aplicación', sub: '@Service · @Transactional', icon: Layers, color: 'blue', at: 1, z: 3, fontSize: 23 },
  { id: 'dom', x: 825, y: 265, w: 190, h: 170, label: 'Dominio', sub: 'Java 21 puro', icon: ShieldCheck, color: 'cyan', glow: true, at: 1, z: 3, fontSize: 25 },
  { id: 'pout', x: 1032, y: 170, w: 140, h: 170, label: 'Puertos OUT', sub: 'interfaces', icon: Plug, color: 'green', at: 3, z: 3, fontSize: 21 },

  // ---- Adaptadores de salida
  { id: 'jpa', x: 1310, y: 25, w: 200, h: 100, label: 'JPA Adapter', sub: 'Hibernate · Flyway', icon: Database, color: 'green', at: 3, fontSize: 21 },
  { id: 'veh', x: 1310, y: 145, w: 200, h: 100, label: 'VehicleHttp', sub: 'Resilience4j', icon: Truck, color: 'amber', at: 3, fontSize: 21 },
  { id: 'obx', x: 1310, y: 265, w: 200, h: 100, label: 'OutboxJpa', sub: 'misma transacción', icon: Box, color: 'rose', at: 3, fontSize: 21 },
  { id: 'pubOld', x: 1310, y: 385, w: 200, h: 100, label: 'RabbitMq Pub.', sub: 'Spring AMQP', icon: Bell, color: 'orange', at: 3, until: SWAP, fontSize: 21 },
  { id: 'pubNew', x: 1310, y: 385, w: 200, h: 100, label: 'SNS Publisher', sub: 'SnsTemplate', icon: Bell, color: 'amber', at: SWAP, glow: true, fontSize: 21 },

  // ---- Externos (derecha)
  { id: 'db', x: 1555, y: 25, w: 125, h: 100, label: 'PostgreSQL', sub: 'Supabase', color: 'green', at: 3, fontSize: 19 },
  { id: 'vms', x: 1555, y: 145, w: 125, h: 100, label: 'MS Vehículos', sub: 'HTTP', color: 'amber', at: 3, fontSize: 19 },
  { id: 'mqOut', x: 1555, y: 385, w: 125, h: 100, label: 'RabbitMQ', sub: 'exchange', icon: Cloud, color: 'orange', at: 3, until: SWAP, fontSize: 19 },
  { id: 'snsOut', x: 1555, y: 385, w: 125, h: 100, label: 'AWS SNS', sub: 'tópico', icon: Cloud, color: 'amber', at: SWAP, glow: true, fontSize: 19 },
]

const edges: DEdge[] = [
  // Entrada
  { from: 'gw', to: 'rest', at: 2, color: 'cyan', packets: 1 },
  { from: 'mqIn', to: 'lstOld', at: 2, until: SWAP, color: 'orange', packets: 1 },
  { from: 'sqsIn', to: 'lstNew', at: SWAP, color: 'amber', packets: 1 },
  { from: 'rest', to: 'pin', at: 2, color: 'cyan', packets: 1, toSide: 'l' },
  { from: 'sched', to: 'pin', at: 2, color: 'violet', packets: 1, toSide: 'l' },
  { from: 'lstOld', to: 'pin', at: 2, until: SWAP, color: 'orange', packets: 1, toSide: 'l' },
  { from: 'lstNew', to: 'pin', at: SWAP, color: 'amber', packets: 1, toSide: 'l' },
  { from: 'relay', to: 'pin', at: 2, color: 'rose', packets: 1, toSide: 'l' },

  // Núcleo
  { from: 'pin', to: 'app', at: 2, color: 'violet', fromSide: 't', toSide: 'l', via: [[738, 145]] },
  { from: 'app', to: 'dom', at: 1, color: 'cyan', packets: 1 },
  { from: 'app', to: 'pout', at: 3, color: 'green', fromSide: 'r', toSide: 't', via: [[1102, 145]] },

  // Salida
  { from: 'pout', to: 'jpa', at: 3, color: 'green', packets: 1, fromSide: 'r' },
  { from: 'pout', to: 'veh', at: 3, color: 'amber', packets: 1, fromSide: 'r' },
  { from: 'pout', to: 'obx', at: 3, color: 'rose', packets: 1, fromSide: 'r' },
  { from: 'pout', to: 'pubOld', at: 3, until: SWAP, color: 'orange', packets: 1, fromSide: 'r' },
  { from: 'pout', to: 'pubNew', at: SWAP, color: 'amber', packets: 1, fromSide: 'r' },
  { from: 'jpa', to: 'db', at: 3, color: 'green' },
  { from: 'veh', to: 'vms', at: 3, color: 'amber' },
  { from: 'pubOld', to: 'mqOut', at: 3, until: SWAP, color: 'orange' },
  { from: 'pubNew', to: 'snsOut', at: SWAP, color: 'amber' },
]

function Arquitectura() {
  return (
    <SlideFrame
      eyebrow="3 · DAS — Macro Arquitectura"
      title={
        <>
          Arquitectura <span className="grad">Hexagonal</span> · Puertos y Adaptadores
        </>
      }
      sub="El negocio vive en el centro; la tecnología se enchufa por los bordes"
    >
      <div className="arq-diagram">
        <style>{`
          .arq-diagram .dnode-sub { font-size: 16px !important; }
          .arq-diagram .dnode { gap: 5px !important; padding: 8px 10px !important; }
        `}</style>

        {/* Rótulos de zona */}
        <div style={{ position: 'relative', height: 36, width: 1680 }}>
          {[
            { x: 160, w: 450, t: 'Adaptadores de entrada', c: colors.cyan, at: 2 },
            { x: 585, w: 670, t: 'Núcleo · el dominio no conoce Spring, JPA ni broker', c: colors.cyan, at: 1 },
            { x: 1240, w: 340, t: 'Adaptadores de salida', c: colors.green, at: 3 },
          ].map((z) => (
            <Reveal key={z.t} at={z.at} from="fade" style={{ position: 'absolute', left: z.x, width: z.w, textAlign: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: z.c }}>{z.t}</span>
            </Reveal>
          ))}
        </div>

        <Diagram width={1680} height={510} nodes={nodes} edges={edges} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 22, alignItems: 'stretch' }}>
        <Reveal at={4} from="left">
          <div className="card" style={{ padding: '18px 26px', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <strong style={{ fontSize: 22, color: colors.cyan, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Regla de dependencia
            </strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 25 }}>
              <span className="mono">Adaptadores</span>
              <ArrowRight size={24} color={colors.slate} />
              <span className="mono">Aplicación</span>
              <ArrowRight size={24} color={colors.slate} />
              <span className="mono" style={{ color: colors.green, fontWeight: 700 }}>Dominio</span>
            </div>
            <span className="muted" style={{ fontSize: 19 }}>
              Descartamos capas tradicionales: el dominio no depende de ningún framework.
            </span>
          </div>
        </Reveal>

        <Reveal at={SWAP} from="right">
          <div
            className="card"
            style={{
              padding: '18px 26px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: rgba('amber', 0.08),
              borderColor: rgba('amber', 0.45),
            }}
          >
            <strong style={{ fontSize: 22, color: colors.amber, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Prueba real · PR #21
            </strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Chip color="orange" style={{ fontSize: 20, textDecoration: 'line-through', opacity: 0.75 }}>RabbitMQ (DAS v0.3)</Chip>
              <ArrowRight size={24} color={colors.amber} />
              <Chip color="amber" solid style={{ fontSize: 20 }}>AWS SNS / SQS</Chip>
            </div>
            <span className="muted" style={{ fontSize: 19 }}>
              Solo cambiaron los adaptadores de mensajería. Casos de uso y dominio: intactos.
            </span>
          </div>
        </Reveal>
      </div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'arquitectura',
  section: 'DAS',
  title: 'Arquitectura Hexagonal',
  steps: 5,
  minutes: 1.75,
  notes: `
## Idea central (decirla primero)
"Separamos **qué hace el negocio** de **con qué tecnología lo hace**. El negocio vive en el centro del hexágono y la tecnología se conecta por los bordes."

## [Paso 1] El núcleo
- Dos capas: **Aplicación** y **Dominio**.
- **Dominio** = Java 21 puro. Aquí viven \`MaintenanceOrder\`, \`MaintenanceRule\`, \`Progress\`, \`OutboxMessage\` y \`Technician\`. También las reglas de negocio:
  - qué transiciones de estado puede tener una orden: \`PROGRAMADO_PENDIENTE → EN_PROCESO → COMPLETADO\`, y \`CANCELADO\` solo por compensación;
  - qué regla aplica a un vehículo: **VEHICULO > CATEGORIA > GLOBAL**;
  - los umbrales de kilometraje y días.
- **Aplicación** = los casos de uso. Solo usa \`@Service\` y \`@Transactional\` para armarlos y marcar dónde empieza y termina cada transacción. **Ninguna otra anotación de framework entra al núcleo.**

## [Paso 2] Entrada: quién "despierta" al núcleo
- Cada caso de uso se expone como un **puerto de entrada** (una interfaz). Hay **9**: \`RegisterRuleUseCase\` (HU-01), \`ExecutePreventiveInspectionUseCase\` (HU-02), \`RegisterManualOrderUseCase\` (HU-03), \`ProcessReportedIncidentUseCase\` (HU-04), \`QueryOrdersUseCase\` (HU-05/07), \`GetOrderDetailUseCase\` (HU-06), \`UpdateOrderStatusUseCase\` (HU-08), \`RegisterProgressUseCase\` (HU-09) y \`PublishPendingOutboxUseCase\`.
- Cuatro adaptadores llaman a esos puertos:
  1. **Controladores REST** (\`RuleController\`, \`OrderController\`): llegan siempre a través del **API Gateway** y validan los DTO con \`@Valid\`.
  2. **Scheduler preventivo**: se ejecuta todos los días a las **02:00, hora America/Bogota**.
  3. **Listener de incidentes**: consume \`incidente.reportado\`.
  4. **Relay del outbox**: lee los mensajes pendientes con \`FOR UPDATE SKIP LOCKED\`.
- Lo importante: **a la lógica le da igual si la orden llega por HTTP, por el reloj o por un evento.**

## [Paso 3] Salida: lo que el núcleo necesita del mundo
- El núcleo declara **puertos de salida**: \`OrderRepository\`, \`RuleRepository\`, \`ProgressRepository\`, \`VehiclePort\`, \`OutboxPort\` y \`EventBrokerPort\`.
- Los adaptadores los implementan:
  - **JPA**: Hibernate + Flyway sobre PostgreSQL en Supabase. Las entidades JPA **nunca salen** de este adaptador; siempre devuelve objetos de dominio.
  - **VehicleHttpAdapter**: timeout de 5 s, reintentos acotados y Circuit Breaker de Resilience4j.
  - **OutboxJpa**: guarda el evento en la misma transacción que el cambio de estado.
  - **Publicador de eventos** hacia el broker.

## [Paso 4] Regla de dependencia
- Las dependencias **siempre apuntan hacia adentro**: los adaptadores conocen a la aplicación y la aplicación conoce al dominio. Nunca al revés.
- Alternativa que **descartamos** en el DAS (Tabla 15): **capas tradicionales**. Elegimos hexagonal para que el dominio no dependa de frameworks y los adaptadores sean intercambiables.
- Además, con esto podemos probar el dominio y los casos de uso con **JUnit + Mockito**, reemplazando los puertos de salida por dobles de prueba.

## [Paso 5] La prueba de que funciona
- El **DAS v0.3** definió **RabbitMQ** como broker.
- En \`develop\` (**PR #21**) migramos a **AWS SNS / SQS** con Spring Cloud AWS y CloudEvents v1.0.
- ¿Qué cambió? **Solo los adaptadores**: el listener (\`@RabbitListener\` → \`@SqsListener\`), el publicador (Spring AMQP → \`SnsTemplate\`) y la infraestructura del broker.
- Los casos de uso y el dominio **no se tocaron**. Para eso diseñamos así.
- Transición a la siguiente diapositiva: "¿Y cómo garantizamos la calidad dentro de esta estructura? Con patrones atados a ISO 25010."
`,
  Component: Arquitectura,
})
