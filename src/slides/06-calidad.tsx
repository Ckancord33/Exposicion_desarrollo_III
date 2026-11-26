import { AnimatePresence, motion } from 'framer-motion'
import {
  Box,
  CheckCircle2,
  Clock,
  Cloud,
  Database,
  DoorOpen,
  FileCheck2,
  Layers,
  ListFilter,
  RefreshCw,
  ShieldAlert,
  Truck,
  User,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Diagram, type DEdge, type DNode } from '../components/Diagram'
import { Chip, SlideFrame } from '../components/ui'
import { attributes, coveredAt, patterns, type PatternId } from '../data/quality'
import { useStep } from '../deck/context'
import { defineSlide } from '../deck/types'
import { colors, rgba, type Color } from '../theme'

const DW = 1110
const DH = 300

/* ------------------------------------------------------------------ */
/* Mini-diagramas: uno por patrón                                      */
/* ------------------------------------------------------------------ */

function OutboxView() {
  const nodes: DNode[] = [
    { id: 'uc', x: 0, y: 95, w: 210, h: 110, label: 'Caso de uso', sub: 'HU-02 · 04 · 08', icon: Layers, color: 'blue', fontSize: 24 },
    {
      id: 'tx',
      x: 270,
      y: 0,
      w: 350,
      h: 300,
      color: 'rose',
      z: 1,
      align: 'start',
      content: (
        <div style={{ position: 'absolute', top: 12, left: 18, fontSize: 17, fontWeight: 700, color: colors.rose, letterSpacing: '0.1em' }}>
          @Transactional · 1 SOLA TX
        </div>
      ),
    },
    { id: 'ord', x: 295, y: 55, w: 300, h: 100, label: 'maintenance_order', sub: 'UPDATE estado', icon: Database, color: 'green', z: 3, fontSize: 21 },
    { id: 'obx', x: 295, y: 180, w: 300, h: 100, label: 'outbox', sub: 'INSERT evento / llamada', icon: Box, color: 'rose', z: 3, fontSize: 21, glow: true },
    { id: 'relay', x: 690, y: 95, w: 200, h: 110, label: 'Relay', sub: 'SKIP LOCKED', icon: RefreshCw, color: 'violet' },
    { id: 'sns', x: 960, y: 20, w: 150, h: 100, label: 'AWS SNS', sub: 'eventos', icon: Cloud, color: 'amber', fontSize: 20 },
    { id: 'veh', x: 960, y: 180, w: 150, h: 100, label: 'Vehículos', sub: 'PUT estado', icon: Truck, color: 'amber', fontSize: 20 },
  ]
  const edges: DEdge[] = [
    { from: 'uc', to: 'ord', color: 'green', packets: 1 },
    { from: 'uc', to: 'obx', color: 'rose', packets: 1 },
    { from: 'obx', to: 'relay', color: 'violet', packets: 2 },
    { from: 'relay', to: 'sns', color: 'amber', packets: 1 },
    { from: 'relay', to: 'veh', color: 'amber', packets: 1 },
  ]
  return (
    <>
      <Diagram width={DW} height={DH} nodes={nodes} edges={edges} />
      <Footer>
        <Chip color="rose" style={{ fontSize: 20 }}>Broker o Vehículos caídos → el mensaje espera</Chip>
        <Chip color="violet" style={{ fontSize: 20 }}>FOR UPDATE SKIP LOCKED: seguro con varias instancias</Chip>
        <Chip color="green" style={{ fontSize: 20 }}>Un solo outbox para eventos y HTTP</Chip>
      </Footer>
    </>
  )
}

const cbStates: { name: string; color: Color; hint: string }[] = [
  { name: 'CLOSED', color: 'green', hint: 'llamadas normales' },
  { name: 'OPEN', color: 'rose', hint: 'corta sin esperar' },
  { name: 'HALF_OPEN', color: 'amber', hint: 'prueba si volvió' },
]

function BreakerState() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % cbStates.length), 1500)
    return () => clearInterval(t)
  }, [])
  const s = cbStates[i]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>
      <ShieldAlert size={40} color={colors[s.color]} />
      <div style={{ fontSize: 17, color: colors.slate, fontWeight: 600, letterSpacing: '0.08em' }}>CIRCUIT BREAKER</div>
      <style>{`@keyframes cbIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }`}</style>
      <div
        key={s.name}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, animation: 'cbIn 0.3s ease-out' }}
      >
        <span
          className="mono"
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: colors[s.color],
            padding: '4px 14px',
            borderRadius: 10,
            background: rgba(s.color, 0.15),
            border: `1.5px solid ${rgba(s.color, 0.6)}`,
          }}
        >
          {s.name}
        </span>
        <span style={{ fontSize: 16, color: colors.slate }}>{s.hint}</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {cbStates.map((c, k) => (
          <i key={c.name} style={{ width: 10, height: 10, borderRadius: '50%', background: k === i ? colors[c.color] : 'rgba(255,255,255,0.15)' }} />
        ))}
      </div>
    </div>
  )
}

function BreakerView() {
  const nodes: DNode[] = [
    { id: 'uc', x: 0, y: 95, w: 200, h: 110, label: 'Caso de uso', sub: 'sin TX abierta', icon: Layers, color: 'blue', fontSize: 24 },
    { id: 'adp', x: 260, y: 95, w: 250, h: 110, label: 'VehicleHttpAdapter', sub: 'timeout 5 s · reintentos', icon: Truck, color: 'amber', fontSize: 21 },
    { id: 'cb', x: 580, y: 35, w: 260, h: 230, color: 'amber', content: <BreakerState /> },
    { id: 'vms', x: 920, y: 95, w: 190, h: 110, label: 'MS Vehículos', sub: 'no responde', icon: Truck, color: 'rose', dim: true, fontSize: 22 },
  ]
  const edges: DEdge[] = [
    { from: 'uc', to: 'adp', color: 'blue', packets: 1 },
    { from: 'adp', to: 'cb', color: 'amber', packets: 1 },
    { from: 'cb', to: 'vms', color: 'rose', dashed: true, packets: 1 },
  ]
  return (
    <>
      <Diagram width={DW} height={DH} nodes={nodes} edges={edges} />
      <Footer title="Si falla, depende del flujo (Tabla 11 del DAS):">
        <Chip color="violet" style={{ fontSize: 20 }}>Preventivo HU-02 → orden CANCELADA (Saga)</Chip>
        <Chip color="rose" style={{ fontSize: 20 }}>Correctivo HU-04 → reintento vía outbox</Chip>
        <Chip color="green" style={{ fontSize: 20 }}>Finalización HU-08 → reintenta hasta lograrlo</Chip>
      </Footer>
    </>
  )
}

function RulesView() {
  const nodes: DNode[] = [
    { id: 'veh', x: 0, y: 95, w: 210, h: 110, label: 'Vehículo', sub: 'CAMIONETA', icon: Truck, color: 'blue', fontSize: 24 },
    { id: 'rv', x: 330, y: 0, w: 300, h: 85, label: '1 · VEHICULO', sub: 'sin regla propia', color: 'slate', dim: true, fontSize: 22 },
    { id: 'rc', x: 330, y: 107, w: 300, h: 85, label: '2 · CATEGORIA', sub: 'CAMIONETA', color: 'orange', glow: true, fontSize: 22 },
    { id: 'rg', x: 330, y: 215, w: 300, h: 85, label: '3 · GLOBAL', sub: 'respaldo', color: 'slate', dim: true, fontSize: 22 },
    { id: 'res', x: 760, y: 85, w: 350, h: 130, label: 'Regla aplicada', sub: '10.000 km · 180 días', icon: CheckCircle2, color: 'green' },
  ]
  const edges: DEdge[] = [
    { from: 'veh', to: 'rv', color: 'slate', dashed: true, toSide: 'l' },
    { from: 'veh', to: 'rc', color: 'orange', packets: 2, toSide: 'l' },
    { from: 'veh', to: 'rg', color: 'slate', dashed: true, toSide: 'l', arrow: 'none' },
    { from: 'rc', to: 'res', color: 'green', packets: 2 },
  ]
  return (
    <>
      <Diagram width={DW} height={DH} nodes={nodes} edges={edges} />
      <Footer>
        <Chip color="orange" style={{ fontSize: 20 }}>Precedencia en el dominio: VEHICULO &gt; CATEGORIA &gt; GLOBAL</Chip>
        <Chip color="violet" icon={ListFilter} style={{ fontSize: 20 }}>Strategy · Specifications: filtros de GET (HU-05)</Chip>
      </Footer>
    </>
  )
}

function EdgeView() {
  const nodes: DNode[] = [
    { id: 'cli', x: 0, y: 40, w: 160, h: 110, label: 'Cliente', sub: 'admin · técnico', icon: User, color: 'slate', fontSize: 22 },
    { id: 'gw', x: 220, y: 40, w: 230, h: 110, label: 'API Gateway', sub: 'JWT · rate limit', icon: DoorOpen, color: 'green', fontSize: 22 },
    { id: 'dto', x: 510, y: 40, w: 260, h: 110, label: 'DTO + @Valid', sub: 'UUID v4 · enums · rangos', icon: FileCheck2, color: 'cyan', fontSize: 22 },
    { id: 'uc', x: 830, y: 40, w: 280, h: 110, label: 'Caso de uso', sub: 'fail-fast en dominio', icon: Layers, color: 'blue', fontSize: 22 },
    {
      id: 'err',
      x: 380,
      y: 205,
      w: 560,
      h: 90,
      label: 'GlobalExceptionHandler',
      sub: '400 · 404 · 409 · 422 · 503 · sin stack traces',
      icon: ShieldAlert,
      color: 'violet',
      fontSize: 22,
    },
  ]
  const edges: DEdge[] = [
    { from: 'cli', to: 'gw', color: 'green', packets: 1 },
    { from: 'gw', to: 'dto', color: 'cyan', packets: 1 },
    { from: 'dto', to: 'uc', color: 'blue', packets: 1 },
    { from: 'dto', to: 'err', color: 'violet', dashed: true, fromSide: 'b', toSide: 't', via: [[640, 178], [660, 178]] },
    { from: 'err', to: 'cli', color: 'violet', dashed: true, fromSide: 'l', toSide: 'b', via: [[80, 250]], packets: 1 },
  ]
  return (
    <>
      <Diagram width={DW} height={DH} nodes={nodes} edges={edges} />
      <Footer>
        <Chip color="blue" style={{ fontSize: 20 }}>OpenAPI 3.0 · springdoc</Chip>
        <Chip color="amber" style={{ fontSize: 20 }}>CloudEvents v1.0 en eventos</Chip>
        <Chip color="green" style={{ fontSize: 20 }}>X-Correlation-Id en cada petición</Chip>
      </Footer>
    </>
  )
}

function Tile({ big, label, sub, color, icon: Icon }: { big: string; label: string; sub: string; color: Color; icon: typeof Clock }) {
  return (
    <div
      className="card"
      style={{
        padding: '22px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        borderTop: `4px solid ${colors[color]}`,
        height: '100%',
      }}
    >
      <Icon size={30} color={colors[color]} />
      <div className="mono" style={{ fontSize: 46, fontWeight: 800, color: colors[color], lineHeight: 1 }}>
        {big}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{label}</div>
      <div className="muted" style={{ fontSize: 17 }}>
        {sub}
      </div>
    </div>
  )
}

function OpsView() {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, height: DH }}>
        <Tile big="20/100" label="Paginación" sub="Pageable: por defecto / máximo" color="amber" icon={ListFilter} />
        <Tile big="10" label="HikariCP" sub="maximum-pool-size" color="amber" icon={Database} />
        <Tile big="V1→V2" label="Flyway" sub="esquema versionado en el repo" color="cyan" icon={FileCheck2} />
        <Tile big=".env" label="Docker" sub="imagen inmutable + variables de entorno" color="cyan" icon={Box} />
      </div>
      <Footer>
        <Chip color="amber" style={{ fontSize: 20 }}>Eficiencia: ninguna consulta trae todo</Chip>
        <Chip color="cyan" style={{ fontSize: 20 }}>Flexibilidad: mismo despliegue en local y EC2</Chip>
      </Footer>
    </>
  )
}

function Footer({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      {title && <span style={{ fontSize: 19, fontWeight: 600, color: colors.slate, marginRight: 4 }}>{title}</span>}
      {children}
    </div>
  )
}

const views: Record<PatternId, () => ReactNode> = {
  outbox: OutboxView,
  cb: BreakerView,
  rules: RulesView,
  edge: EdgeView,
  ops: OpsView,
}

function PatternView({ id }: { id: PatternId }) {
  const View = views[id]
  return <View />
}

/* ------------------------------------------------------------------ */

function Intro() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 26, textAlign: 'center' }}>
      <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.2 }}>
        Ningún patrón <span className="grad">"por moda"</span>
      </div>
      <div className="muted" style={{ fontSize: 26, maxWidth: 820 }}>
        Cada patrón del DAS responde a un atributo de calidad
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <Chip color="cyan">Observables · en el código</Chip>
        <Chip color="violet">No observables · en ejecución</Chip>
      </div>
    </div>
  )
}

function Calidad() {
  const step = useStep()
  const current = patterns.find((p) => p.step === step)
  const covered = attributes.filter((a) => step >= coveredAt(a.id)).length

  return (
    <SlideFrame
      eyebrow="3 · DAS — ISO 25010"
      title={
        <>
          Atributos de calidad → <span className="grad">Patrones de diseño</span>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: 28, height: '100%' }}>
        {/* Columna izquierda: atributos ISO 25010 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.14em', color: colors.slate }}>ISO 25010</span>
            <span className="mono" style={{ fontSize: 22, fontWeight: 700, color: covered === attributes.length ? colors.green : colors.slate }}>
              {covered}/{attributes.length} cubiertos
            </span>
          </div>
          {attributes.map((a) => {
            const active = current?.attrs.includes(a.id) ?? false
            const done = step >= coveredAt(a.id)
            const dim = step > 0 && !active
            return (
              <motion.div
                key={a.id}
                initial={false}
                animate={{ opacity: dim ? 0.42 : 1, x: active ? 10 : 0 }}
                transition={{ duration: 0.35 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '8px 16px',
                  borderRadius: 16,
                  border: `1.5px solid ${active ? rgba(a.color, 0.7) : 'rgba(255,255,255,0.08)'}`,
                  background: active ? rgba(a.color, 0.14) : 'rgba(255,255,255,0.03)',
                  boxShadow: active ? `0 0 26px ${rgba(a.color, 0.3)}` : 'none',
                }}
              >
                <span style={{ width: 6, alignSelf: 'stretch', borderRadius: 4, background: colors[a.color] }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 23, fontWeight: 700 }}>{a.name}</div>
                  <div className="muted" style={{ fontSize: 16 }}>
                    {a.sub}
                  </div>
                </div>
                <motion.span initial={false} animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.4 }} transition={{ duration: 0.35 }}>
                  <CheckCircle2 size={26} color={colors.green} />
                </motion.span>
              </motion.div>
            )
          })}
        </div>

        {/* Columna derecha: escenario del patrón actual */}
        <div className="card q-stage" style={{ padding: '24px 30px', position: 'relative', overflow: 'hidden' }}>
          <style>{`
            .q-stage .dnode-sub { font-size: 17px !important; }
            .q-stage .dnode { gap: 5px !important; }
            .q-stage .dnode > svg { flex-shrink: 0; width: 30px; height: 30px; }
          `}</style>
          <AnimatePresence mode="wait">
            <motion.div
              key={current?.id ?? 'intro'}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              {current ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
                    <span className="mono" style={{ fontSize: 20, fontWeight: 700, color: colors[current.color] }}>
                      {String(current.step).padStart(2, '0')}/{String(patterns.length).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: 36, fontWeight: 800 }}>{current.title}</span>
                  </div>
                  <div className="muted" style={{ fontSize: 22, marginBottom: 22 }}>
                    {current.tagline}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 30 }}>
                    <PatternView id={current.id} />
                  </div>
                </>
              ) : (
                <Intro />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'calidad',
  section: 'DAS',
  title: 'ISO 25010 y Patrones',
  steps: 5,
  minutes: 2,
  notes: `
## Idea central
"En el DAS no elegimos patrones porque estuvieran de moda. **Cada uno responde a un atributo de ISO 25010.** A la izquierda están los 9 atributos; con cada paso se ilumina lo que cubre cada patrón."
- El DAS separa los atributos **observables**, que se ven en el código (src/test, \`application.yaml\`, adaptadores), de los **no observables**, que solo se miden en ejecución: latencia real, CPU/RAM con Prometheus/Grafana, pruebas de aceptación.

## [Paso 1] Transactional Outbox → Adecuación funcional · Fiabilidad · Seguridad (integridad)
- Problema: si guardamos la orden y luego el broker está caído, el evento se pierde. Si publicamos primero y luego falla la BD, avisamos de algo que no pasó.
- Solución: en **la misma transacción** actualizamos \`maintenance_order\` e insertamos el mensaje en la tabla \`outbox\`.
- Un **relay** programado lee los pendientes con \`FOR UPDATE SKIP LOCKED\`, los despacha y los marca como enviados. Así sigue siendo seguro aunque algún día corran varias instancias.
- Decisión del DAS: **un solo outbox genérico**, que sirve tanto para eventos como para llamadas HTTP a Vehículos (una tabla y un proceso para todos los reintentos).

## [Paso 2] Circuit Breaker + Saga → Fiabilidad · Protección
- \`VehicleHttpAdapter\` usa **Resilience4j**: timeout de **5 s**, reintentos acotados y Circuit Breaker.
- Los estados del circuito (están en la animación): **CLOSED** (normal) → **OPEN** (corta sin esperar el timeout y responde de forma controlada) → **HALF_OPEN** (prueba si Vehículos volvió).
- Regla importante: las llamadas HTTP **no se hacen dentro de una transacción de BD abierta**.
- Qué hacer ante un fallo depende del flujo (Tabla 11):
  - **Preventivo (HU-02)**: compensación tipo **Saga**. La orden pasa a CANCELADA y el vehículo se vuelve a evaluar en la próxima ejecución.
  - **Correctivo (HU-04)**: la orden se conserva porque el incidente ya ocurrió; el bloqueo queda en el outbox.
  - **Finalización (HU-08)**: liberar el vehículo queda en el outbox y se reintenta hasta lograrlo.

## [Paso 3] Rule Engine + Strategy → Mantenibilidad · Protección
- El **motor de reglas** aísla la jerarquía **VEHICULO > CATEGORIA > GLOBAL** en una estructura con parámetros. Ejemplo: una camioneta sin regla propia toma la de su categoría (10.000 km / 180 días, la misma regla de la demo de HU-01).
- Con esto cambiamos las políticas **sin recompilar el scheduler**.
- **Strategy con Spring Data Specifications**: cada filtro de \`GET /mantenimientos\` (estado, tipo, vehículo, técnico) es una especificación que se combina en tiempo de ejecución.

## [Paso 4] Borde seguro y contratos → Seguridad · Interacción · Compatibilidad · Protección
- **AWS API Gateway** es la única puerta de entrada: valida JWT, aplica rate limiting y enruta. El microservicio no expone puertos directos a internet.
- **Bean Validation** en los DTO (UUID v4, enums, rangos y longitudes) actúa como barrera antes del núcleo. El dominio valida otra vez las transiciones (**fail-fast**).
- \`@RestControllerAdvice\` estandariza los errores: datos inválidos → 400/422, no existe → 404, duplicado → 409, BD caída → 503. **Nunca devuelve stack traces.**
- **OpenAPI 3.0 (springdoc)** y **CloudEvents v1.0** dan contratos homogéneos a los demás equipos.

## [Paso 5] Recursos y despliegue → Eficiencia · Flexibilidad
- **Paginación** obligatoria con \`Pageable\`: **20** registros por defecto y **100** como máximo.
- **HikariCP** con \`maximum-pool-size=10\`.
- **Flyway** versiona el esquema (V1, V2). **Docker** y las **variables de entorno** dejan el mismo despliegue en local y en EC2.
- Cierre: "**9 de 9** atributos cubiertos, y cada uno con su patrón trazable en el DAS." Transición a los endpoints.
`,
  Component: Calidad,
})
