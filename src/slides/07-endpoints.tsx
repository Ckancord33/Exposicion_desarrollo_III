import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Code, Chip, SlideFrame } from '../components/ui'
import { Reveal } from '../components/Reveal'
import { useStep } from '../deck/context'
import { endpoints, nonRestStories, type Method } from '../data/endpoints'
import { defineSlide } from '../deck/types'
import { colors, rgba } from '../theme'

const methodColor: Record<Method, 'green' | 'cyan' | 'amber'> = {
  GET: 'green',
  POST: 'cyan',
  PUT: 'amber',
}

function Endpoints() {
  const step = useStep()
  const [selected, setSelected] = useState(0)

  // Al avanzar pasos con la flecha, recorre algunos endpoints clave automaticamente si no se toco manualmente.
  useEffect(() => {
    if (step === 1) setSelected(0)
    if (step === 2) setSelected(2)
    if (step === 3) setSelected(5)
  }, [step])

  const current = endpoints[selected]

  return (
    <SlideFrame
      eyebrow="4 · Contrato REST"
      title={
        <>
          Endpoints y <span className="grad">Payloads</span> que cubren las 9 HUs
        </>
      }
      sub="Haz clic en cualquier endpoint para inspeccionar su Request, Response y códigos HTTP"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '650px 1fr', gap: 32, height: '100%' }}>
        {/* Lista de endpoints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {endpoints.map((ep, i) => {
            const active = i === selected
            const mc = methodColor[ep.method]
            return (
              <motion.button
                key={ep.id}
                onClick={() => setSelected(i)}
                whileHover={{ x: 4 }}
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 14,
                  padding: '13px 18px',
                  borderRadius: 16,
                  background: active ? rgba(mc, 0.14) : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${active ? colors[mc] : 'rgba(255,255,255,0.08)'}`,
                  color: '#fff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                  <span
                    className="mono"
                    style={{
                      width: 68,
                      textAlign: 'center',
                      padding: '4px 0',
                      borderRadius: 8,
                      fontSize: 18,
                      fontWeight: 800,
                      background: rgba(mc, 0.2),
                      color: colors[mc],
                      flexShrink: 0,
                    }}
                  >
                    {ep.method}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div className="mono" style={{ fontSize: 21, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ep.path}
                    </div>
                    <div className="muted" style={{ fontSize: 17 }}>{ep.summary}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {ep.stories.map((hu) => (
                    <span
                      key={hu}
                      className="mono"
                      style={{
                        fontSize: 16,
                        padding: '3px 9px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.08)',
                        color: '#e2e8f0',
                      }}
                    >
                      {hu}
                    </span>
                  ))}
                </div>
              </motion.button>
            )
          })}

          <Reveal at={2} from="up">
            <div className="card" style={{ padding: '12px 18px', marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 17 }}>
              {nonRestStories.map((n) => (
                <span key={n.id}>
                  <strong className="mono" style={{ color: colors.violet }}>{n.id}:</strong>{' '}
                  <span className="muted">{n.via}</span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Inspector de payload */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="card"
          style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 28, justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Chip color={methodColor[current.method]} solid>{current.method}</Chip>
                <span className="mono" style={{ fontSize: 28, fontWeight: 800 }}>{current.path}</span>
              </div>
              <Chip color="violet">{current.stories.join(' · ')}</Chip>
            </div>
            <div className="muted" style={{ fontSize: 22 }}>
              Rol: <strong style={{ color: '#fff' }}>{current.role}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, justifyContent: 'center' }}>
            {current.request && (
              <div>
                <div className="mono muted" style={{ fontSize: 18, marginBottom: 6 }}>
                  REQUEST {current.method === 'GET' ? '(Query Params)' : '(JSON snake_case)'}
                </div>
                <Code code={current.request} size={21} />
              </div>
            )}
            <div>
              <div className="mono" style={{ fontSize: 18, marginBottom: 6, color: colors.green }}>
                RESPONSE · {current.status}
              </div>
              <Code code={current.response} size={21} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14 }}>
            <span className="muted" style={{ fontSize: 20 }}>Códigos de error manejados:</span>
            <span className="mono" style={{ fontSize: 21, color: colors.rose, fontWeight: 700 }}>{current.errors}</span>
          </div>
        </motion.div>
      </div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'endpoints',
  section: 'Contratos API',
  title: 'Endpoints y Payloads',
  steps: 3,
  minutes: 1.5,
  notes: `
## Qué decir
- Para cubrir las 9 Historias de Usuario acordamos con los demás equipos la convención REST en inglés (\`/maintenance/...\` con soporte/alias en Gateway a \`/mantenimientos\`), payloads en **snake_case**, UUID v4 y paginación estándar (\`page\`, \`size\`, bloque \`resumen\`).
- [Paso 1] **HU-01 (\`POST /maintenance/rules\`)** y **HU-03 (\`POST /maintenance\`)**: parametriza reglas preventivas y registra órdenes manuales dejando la orden en \`PROGRAMADO_PENDIENTE\` y encolando el bloqueo del vehículo en el Outbox.
- [Paso 2] **HU-05 (\`GET /maintenance\`)**, **HU-06 (\`GET /maintenance/{id}\`)** y **HU-07 (\`GET /maintenance/my_orders\`)**: listados paginados con Strategy/Specifications y un bloque \`resumen\` pensado para que **Reportes Operativos** saque KPIs (como \`avg_repair_hours\`) sin recorrer todas las páginas.
- [Paso 3] **HU-08 (\`PUT /maintenance/{id}/status\`)** y **HU-09 (\`POST /maintenance/{id}/logs\`)**: el técnico avanza la orden (\`PROGRAMADO_PENDIENTE → EN_PROCESO → COMPLETADO\`), registra avances/costos en la bitácora y al finalizar dispara el evento de liberación.
- Recordar: **HU-02** y **HU-04** no tienen endpoint REST porque las disparan el **Scheduler** y el **Listener de eventos**, respectivamente.
`,
  Component: Endpoints,
})
