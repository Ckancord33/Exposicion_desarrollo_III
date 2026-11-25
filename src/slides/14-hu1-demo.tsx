import { CheckCircle2, Database, Globe, Layers, ShieldAlert, Truck } from 'lucide-react'
import { Diagram, type DEdge, type DNode } from '../components/Diagram'
import { Reveal } from '../components/Reveal'
import { Chip, Code, SlideFrame } from '../components/ui'
import { defineSlide } from '../deck/types'
import { colors } from '../theme'

const nodes: DNode[] = [
  { id: 'ctrl', x: 20, y: 80, w: 290, h: 130, label: 'RuleController', sub: 'POST /maintenance/rules', icon: Globe, color: 'cyan', at: 0 },
  { id: 'svc', x: 430, y: 80, w: 320, h: 130, label: 'RegisterRuleService', sub: 'sin @Transactional abierta', icon: Layers, color: 'blue', at: 1 },
  { id: 'dom', x: 430, y: 270, w: 320, h: 130, label: 'MaintenanceRule', sub: 'validate(): 1k–50k km · 30–365d', icon: ShieldAlert, color: 'violet', at: 1 },
  { id: 'veh', x: 880, y: 30, w: 320, h: 120, label: 'VehicleHttpAdapter', sub: 'si scope = VEHICULO → 404', icon: Truck, color: 'amber', at: 2 },
  { id: 'repo', x: 880, y: 230, w: 320, h: 130, label: 'RulePersistenceAdapter', sub: 'índice único parcial → 409', icon: Database, color: 'green', at: 2 },
  { id: 'ok', x: 1330, y: 120, w: 320, h: 140, label: '201 Created', sub: 'RuleResponse (snake_case)', icon: CheckCircle2, color: 'green', glow: true, at: 3 },
]

const edges: DEdge[] = [
  { from: 'ctrl', to: 'svc', at: 1, color: 'cyan', packets: 2, label: '@Valid' },
  { from: 'svc', to: 'dom', at: 1, color: 'violet', packets: 1, label: '422' },
  { from: 'svc', to: 'veh', at: 2, color: 'amber', packets: 1, label: 'GET /vehiculos/{id}' },
  { from: 'svc', to: 'repo', at: 2, color: 'green', packets: 2, label: 'save()' },
  { from: 'repo', to: 'ok', at: 3, color: 'green', packets: 2 },
]

const sampleReq = `POST /maintenance/rules
{
  "scope_type": "CATEGORIA",
  "vehicle_category": "CAMIONETA",
  "mileage_interval_km": 10000,
  "time_interval_days": 180,
  "routine_description": "Cambio de aceite y filtros"
}`

function Hu1Demo() {
  return (
    <SlideFrame
      eyebrow="13 · Primer Incremento Funcional"
      title={
        <>
          Implementación de la <span className="grad">HU-01</span>
        </>
      }
      sub="Registro y parametrización de reglas preventivas (GLOBAL · CATEGORIA · VEHICULO)"
    >
      <Diagram width={1680} height={415} nodes={nodes} edges={edges} />

      <div style={{ display: 'grid', gridTemplateColumns: '760px 1fr', gap: 28, marginTop: 18, alignItems: 'center' }}>
        <Reveal at={1} from="left">
          <Code code={sampleReq} size={19} />
        </Reveal>

        <Reveal at={3} from="right">
          <div className="card" style={{ padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: colors.cyan }}>
              12 pruebas de integración &amp; controlador en verde
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <Chip color="green" style={{ fontSize: 18 }}>201 Created (ES/EN scopes)</Chip>
              <Chip color="amber" style={{ fontSize: 18 }}>400 DTO / Enum</Chip>
              <Chip color="violet" style={{ fontSize: 18 }}>422 Umbral / Alcance</Chip>
              <Chip color="rose" style={{ fontSize: 18 }}>404 Vehículo · 409 Regla activa</Chip>
              <Chip color="blue" style={{ fontSize: 18 }}>503 Dependencia caída</Chip>
            </div>
          </div>
        </Reveal>
      </div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'hu1-demo',
  section: 'HU-01',
  title: 'Implementación HU-01',
  steps: 3,
  minutes: 1.75,
  notes: `
## Qué decir
- Cerramos la exposición mostrando cómo todo el ciclo anterior aterrizó en código real con la **HU-01** (\`POST /maintenance/rules\`), ya implementada y mergeada en \`develop\`.
- [Paso 1] El request entra en \`snake_case\` por \`RuleController\`; \`@Valid\` filtra formato (400). Luego \`RegisterRuleService\` llama a \`MaintenanceRule.validate()\` en el dominio puro: exige entre **1.000 y 50.000 km** y entre **30 y 365 días**, y coherencia entre alcance y campos (422 si falla).
- [Paso 2] Fíjense en un detalle del DAS aplicado al código: **\`RegisterRuleService\` no lleva \`@Transactional\`** porque si el alcance es \`VEHICULO\`, consulta síncronamente a MS Vehículos (\`GET /vehiculos/{id}\`) y no debemos mantener abierta una conexión de BD mientras hacemos una llamada HTTP externa.
- [Paso 2-3] Valida que no exista otra regla activa para ese alcance/objetivo (con respaldo de índice único parcial en PostgreSQL → 409 si hay carrera concurrente) y responde **201 Created**.
- Todo cubierto con **12 pruebas** en \`RuleControllerTest\` más tests de servicio, adaptador HTTP y persistencia.
`,
  Component: Hu1Demo,
})
