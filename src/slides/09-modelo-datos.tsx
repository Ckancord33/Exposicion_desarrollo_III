import { Database, KeyRound, Link2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Diagram, type DEdge, type DNode } from '../components/Diagram'
import { SlideFrame } from '../components/ui'
import { ZoomImage } from '../components/ZoomImage'
import { tables, type TableDef } from '../data/tables'
import { defineSlide } from '../deck/types'
import { colors, rgba } from '../theme'

/* ───────────── Tarjeta de tabla ───────────── */
function TableCard({ t }: { t: TableDef }) {
  // Nombres largos (p. ej. MAINTENANCE_LOG_ATTACHMENT) bajan un poco la fuente
  // para que nunca se salgan de la tarjeta.
  const headerSize = t.name.length > 20 ? 15 : 18

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
      <div
        style={{
          padding: '8px 14px',
          background: rgba(t.color, 0.22),
          borderBottom: `1.5px solid ${rgba(t.color, 0.5)}`,
          borderRadius: '12px 12px 0 0',
          fontSize: headerSize,
          fontWeight: 800,
          color: colors[t.color],
          fontFamily: 'var(--mono)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <Database size={16} style={{ flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span>
      </div>

      <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 4, fontSize: 16 }}>
        {t.columns.map((c) => (
          <div
            key={c.name}
            style={{
              display: 'flex',
              flexWrap: 'wrap', // si el tipo es largo (enum), baja a su propia línea
              justifyContent: 'space-between',
              alignItems: 'baseline',
              columnGap: 8,
            }}
          >
            <span className="mono" style={{ color: c.key ? '#fff' : '#cbd5e1', fontWeight: c.key ? 700 : 400, whiteSpace: 'nowrap' }}>
              {c.key && (
                <span style={{ color: c.key === 'PK' ? colors.amber : c.key === 'FK' ? colors.cyan : colors.violet, marginRight: 6 }}>
                  {c.key}
                </span>
              )}
              {c.name}
            </span>
            <span
              className="mono muted"
              style={{ fontSize: c.type.length > 14 ? 12 : 14, whiteSpace: 'nowrap', marginLeft: 'auto' }}
            >
              {c.type}
            </span>
          </div>
        ))}
        {t.more && <div className="muted" style={{ fontSize: 14, marginTop: 2 }}>+{t.more} columnas</div>}
      </div>
    </div>
  )
}

/* ───────────── Callout (reemplaza los chips que se montaban sobre OUTBOX) ───────────── */
function Note({ icon, color, title, children }: { icon: ReactNode; color: keyof typeof colors; title: string; children: ReactNode }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', textAlign: 'left' }}>
      <div style={{ color: colors[color], flexShrink: 0, display: 'flex' }}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: colors[color], lineHeight: 1.2 }}>{title}</div>
        <div className="muted" style={{ fontSize: 15, lineHeight: 1.3 }}>{children}</div>
      </div>
    </div>
  )
}

/* ───────────── Layout: 4 columnas, 110px de aire entre las que tienen relación ───────────── */
const nodes: DNode[] = [
  // Columna 1
  { id: 'tech', x: 0, y: 0, w: 330, h: 185, shape: 'box', color: 'violet', content: <TableCard t={tables.technician} />, at: 1 },
  { id: 'rule', x: 0, y: 215, w: 330, h: 215, shape: 'box', color: 'blue', content: <TableCard t={tables.rule} />, at: 1 },
  { id: 'audit', x: 0, y: 460, w: 330, h: 185, shape: 'box', color: 'orange', content: <TableCard t={tables.audit} />, at: 2 },

  // Columna 2 (corazón del modelo)
  { id: 'order', x: 440, y: 60, w: 360, h: 320, shape: 'box', color: 'amber', content: <TableCard t={tables.order} />, glow: true },

  // Columna 3
  { id: 'outbox', x: 910, y: 0, w: 340, h: 255, shape: 'box', color: 'rose', content: <TableCard t={tables.outbox} />, at: 2 },
  { id: 'log', x: 910, y: 300, w: 340, h: 230, shape: 'box', color: 'cyan', content: <TableCard t={tables.log} />, at: 1 },

  // Columna 4 (alineada con el centro de LOG para que la flecha sea recta)
  { id: 'att', x: 1360, y: 318, w: 320, h: 195, shape: 'box', color: 'green', content: <TableCard t={tables.attachment} />, at: 1 },

  // Decisiones de diseño (paso 3) en el espacio libre bajo MAINTENANCE_ORDER
  {
    id: 'note-idx',
    x: 440,
    y: 420,
    w: 360,
    h: 100,
    shape: 'box',
    color: 'amber',
    content: (
      <Note icon={<KeyRound size={26} />} color="amber" title="Índices únicos parciales">
        Idempotencia incluso bajo concurrencia
      </Note>
    ),
    at: 3,
  },
  {
    id: 'note-fk',
    x: 440,
    y: 540,
    w: 360,
    h: 100,
    shape: 'box',
    color: 'cyan',
    content: (
      <Note icon={<Link2 size={26} />} color="cyan" title="vehicle_id / incident_id sin FK">
        Pertenecen a otros microservicios
      </Note>
    ),
    at: 3,
  },
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
      <Diagram width={1680} height={660} nodes={nodes} edges={edges} />

      {/* Miniatura del DER completo: siempre visible, en la esquina libre arriba a la derecha */}
      <div style={{ position: 'absolute', right: 0, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <ZoomImage
          src="./diagrams/modelo-datos.png"
          alt="Diagrama Entidad Relación completo"
          style={{ width: 190, height: 106 }}
        />
        <span className="muted" style={{ fontSize: 14 }}>Clic para ver el DER completo</span>
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
- [Paso 3] Dos decisiones importantes de diseño (callouts bajo MAINTENANCE_ORDER):
  1. ` + '`vehicle_id`' + ` e ` + '`incident_id`' + ` **no tienen llave foránea** porque pertenecen a otros microservicios (desacoplamiento de datos).
  2. Usamos **índices únicos parciales** en PostgreSQL (` + '`uq_active_global_rule`' + `, ` + '`uq_preventive_active_order`' + `, ` + '`uq_corrective_incident_order`' + `) para garantizar idempotencia incluso bajo concurrencia.
- Si el profe pide ver el DER completo original, clic en la miniatura arriba a la derecha.
`,
  Component: ModeloDatos,
})