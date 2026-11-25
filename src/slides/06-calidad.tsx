import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { SlideFrame } from '../components/ui'
import { Reveal } from '../components/Reveal'
import { useStep } from '../deck/context'
import { quality } from '../data/quality'
import { defineSlide } from '../deck/types'
import { colors, rgba } from '../theme'

function Calidad() {
  const step = useStep()
  return (
    <SlideFrame
      eyebrow="3 · DAS — ISO 25010"
      title={
        <>
          Atributos de Calidad → <span className="grad">Patrones de Diseño</span>
        </>
      }
      sub="Cada decisión arquitectónica en el DAS responde a un requisito medible de ISO 25010"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22, marginTop: 6 }}>
        {quality.map((q, idx) => {
          const revealAt = idx < 4 ? 1 : 2
          const on = step >= revealAt
          return (
            <motion.div
              key={q.id}
              initial={false}
              animate={{ opacity: on ? 1 : 0, y: on ? 0 : 28, scale: on ? 1 : 0.94 }}
              transition={{ duration: 0.5, delay: on ? (idx % 4) * 0.08 : 0 }}
              className="card"
              style={{
                padding: '24px 24px',
                borderTop: `4px solid ${colors[q.color]}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 280,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <Shield size={24} color={colors[q.color]} />
                  <strong style={{ fontSize: 25, color: '#fff' }}>{q.name}</strong>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {q.patterns.map((p) => (
                    <span
                      key={p}
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        padding: '5px 12px',
                        borderRadius: 999,
                        background: rgba(q.color, 0.14),
                        border: `1px solid ${rgba(q.color, 0.45)}`,
                        color: colors[q.color],
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div className="muted" style={{ fontSize: 19, lineHeight: 1.35, marginTop: 14 }}>
                {q.where}
              </div>
            </motion.div>
          )
        })}
      </div>

      <Reveal at={3} from="up" style={{ marginTop: 22 }}>
        <div
          className="card"
          style={{
            padding: '18px 28px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            background: rgba('cyan', 0.07),
          }}
        >
          <span style={{ fontSize: 24 }}>
            <strong style={{ color: colors.rose }}>Transactional Outbox + Saga:</strong> cero pérdida de eventos ante caídas
          </span>
          <span className="muted">|</span>
          <span style={{ fontSize: 24 }}>
            <strong style={{ color: colors.amber }}>Circuit Breaker:</strong> corta fallos en cascada con MS Vehículos
          </span>
          <span className="muted">|</span>
          <span style={{ fontSize: 24 }}>
            <strong style={{ color: colors.green }}>Rule Engine:</strong> VEHÍCULO &gt; CATEGORÍA &gt; GLOBAL
          </span>
        </div>
      </Reveal>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'calidad',
  section: 'DAS',
  title: 'ISO 25010 y Patrones',
  steps: 3,
  minutes: 1.5,
  notes: `
## Qué decir
- En el DAS aterrizamos la norma **ISO 25010** separando atributos observables en código de los no observables (infraestructura y pruebas). No pusimos patrones "por moda", sino atados a un atributo:
- [Paso 1] **Adecuación funcional, Eficiencia, Compatibilidad e Interacción**: pruebas unitarias, pool HikariCP (máx 10 conexiones), paginación obligatoria (\`20\` por defecto, \`100\` máx), DTOs ligeros, OpenAPI 3.0 y un \`GlobalExceptionHandler\` (\`@RestControllerAdvice\`) que estandariza los errores sin filtrar stack traces.
- [Paso 2] **Fiabilidad, Seguridad, Mantenibilidad y Flexibilidad**:
  - **Transactional Outbox + Relay (\`FOR UPDATE SKIP LOCKED\`) + Saga de compensación** para consistencia distribuida.
  - **Circuit Breaker + Timeouts (Resilience4j)** para no colgar hilos si Vehículos cae.
  - **Idempotencia + DLQ** al consumir eventos de incidentes.
  - **Motor de Reglas + Strategy** para resolver \`VEHICULO > CATEGORIA > GLOBAL\` y filtros dinámicos.
  - **Flyway + Docker + Variables de entorno** para despliegues reproducibles.
- [Paso 3] Destacar la tríada clave del módulo: **Outbox + Saga**, **Circuit Breaker** y **Rule Engine**.
`,
  Component: Calidad,
})
