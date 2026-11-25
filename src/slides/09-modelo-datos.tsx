import { motion } from 'framer-motion'
import { Database, KeyRound, Link2 } from 'lucide-react'
import { Diagram, type DEdge, type DNode } from '../components/Diagram'
import { Reveal } from '../components/Reveal'
import { Chip, SlideFrame } from '../components/ui'
import { ZoomImage } from '../components/ZoomImage'
import { tables, type TableDef } from '../data/tables'
import { defineSlide } from '../deck/types'
import { colors, rgba } from '../theme'

function TableCard({ t }: { t: TableDef }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
      <div
        style={{
          padding: '8px 14px',
          background: rgba(t.color, 0.22),
          borderBottom: `1.5px solid ${rgba(t.color, 0.5)}`,
          borderRadius: '18px 18px 0 0',
          fontSize: 18,
          fontWeight: 800,
          color: colors[t.color],
          fontFamily: 'var(--mono)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Database size={16} /> {t.name}
      </div>
      <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 4, fontSize: 16 }}>
        {t.columns.map((c) => (
          <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <span className="mono" style={{ color: c.key ? '#fff' : '#cbd5e1', fontWeight: c.key ? 700 : 400 }}>
              {c.key && (
                <span style={{ color: c.key === 'PK' ? colors.amber : c.key === 'FK' ? colors.cyan : colors.violet, marginRight: 6 }}>
                  {c.key}
                </span>
              )}
              {c.name}
            </span>
            <span className="mono muted" style={{ fontSize: 14 }}>{c.type}</span>
          </div>
        ))}
        {t.more && <div className="muted" style={{ fontSize: 14, marginTop: 2 }}>+{t.more} columnas</div>}
      </div>
    </div>
  )
}

const nodes: DNode[] = [
  { id: 'tech', x: 10, y: 10, w: 350, h: 185, shape: 'box', color: 'violet', content: <TableCard t={tables.technician} />, at: 1 },
  { id: 'rule', x: 10, y: 225, w: 350, h: 190, shape: 'box', color: 'blue', content: <TableCard t={tables.rule} />, at: 1 },
  { id: 'audit', x: 10, y: 440, w: 350, h: 185, shape: 'box', color: 'orange', content: <TableCard t={tables.audit} />, at: 2 },
  { id: 'order', x: 460, y: 45, w: 390, h: 325, shape: 'box', color: 'amber', content: <TableCard t={tables.order} />, glow: true },
  { id: 'outbox', x: 960, y: 10, w: 380, h: 255, shape: 'box', color: 'rose', content: <TableCard t={tables.outbox} />, at: 2 },
  { id: 'log', x: 960, y: 315, w: 380, h: 230, shape: 'box', color: 'cyan', content: <TableCard t={tables.log} />, at: 1 },
  { id: 'att', x: 1400, y: 345, w: 280, h: 195, shape: 'box', color: 'green', content: <TableCard t={tables.attachment} />, at: 1 },
]

const edges: DEdge[] = [
  { from: 'tech', to: 'order', at: 1, color: 'violet', label: '1 : N' },
  { from: 'order', to: 'outbox', at: 2, color: 'rose', label: '1 : N' },
  { from: 'order', to: 'log', at: 1, color: 'cyan', label: '1 : N' },
  { from: 'log', to: 'att', at: 1, color: 'green', label: '1 : N' },
]

function ModeloDatos() {
  return (
    <SlideFrame
      eyebrow="6 · Persistencia (PostgreSQL / Supabase)"
      title={
        <>
          Modelo Relacional: <span className="grad">7 Tablas</span> + Migraciones Flyway
        </>
      }
    >
      <Diagram width={1680} height={640} nodes={nodes} edges={edges} />

      <div style={{ position: 'absolute', right: 0, top: -6, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Reveal at={3} from="right">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Chip color="amber" icon={KeyRound} style={{ fontSize: 18 }}>
              Índices únicos parciales (idempotencia)
            </Chip>
            <Chip color="cyan" icon={Link2} style={{ fontSize: 18 }}>
              vehicle_id / incident_id sin FK externa
            </Chip>
            <ZoomImage
              src="./diagrams/modelo-datos.png"
              alt="Diagrama Entidad Relación completo"
              style={{ width: 120, height: 68 }}
            />
          </div>
        </Reveal>
      </div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'modelo-datos',
  section: 'Base de Datos',
  title: 'Modelo Relacional',
  steps: 3,
  minutes: 1.25,
  notes: `
## Qué decir
- Cada microservicio es dueño exclusivo de su base de datos (PostgreSQL alojado en **Supabase** vía Session Pooler + **Flyway V1 y V2**).
- [Paso 0-1] El corazón es ` + '`MAINTENANCE_ORDER`' + `. Alrededor giran los técnicos (` + '`TECHNICIAN`' + `), las reglas preventivas (` + '`PREVENTIVE_RULE`' + `) y la bitácora cronológica (` + '`MAINTENANCE_LOG`' + ` + ` + '`MAINTENANCE_LOG_ATTACHMENT`' + `).
- [Paso 2] Para confiabilidad y seguridad agregamos dos tablas clave: **` + '`OUTBOX_MESSAGE`' + `** (Transactional Outbox con ` + '`attempts`' + ` y ` + '`next_attempt_at`' + `) y **` + '`ACCESS_AUDIT_LOG`' + `** para auditoría.
- [Paso 3] Dos decisiones importantes de diseño:
  1. ` + '`vehicle_id`' + ` e ` + '`incident_id`' + ` **no tienen llave foránea** porque pertenecen a otros microservicios (desacoplamiento de datos).
  2. Usamos **índices únicos parciales** en PostgreSQL (` + '`uq_active_global_rule`' + `, ` + '`uq_preventive_active_order`' + `, ` + '`uq_corrective_incident_order`' + `) para garantizar idempotencia incluso bajo concurrencia.
- Si el profe pide ver el DER completo original, clic en la miniatura arriba a la derecha.
`,
  Component: ModeloDatos,
})
