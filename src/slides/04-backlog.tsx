import { motion } from 'framer-motion'
import { Bot, Calendar, HardHat, ListChecks, UserCog } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { Chip, CountUp, SlideFrame } from '../components/ui'
import { useStep } from '../deck/context'
import { sprintConfig, sprints, stories, totalPoints } from '../data/backlog'
import { defineSlide } from '../deck/types'
import { colors, rgba } from '../theme'

const moscowColor = { Must: 'rose', Should: 'amber', Could: 'cyan' } as const

function Backlog() {
  const step = useStep()
  return (
    <SlideFrame
      eyebrow="2 · Planificación y Backlog"
      title={
        <>
          De los procesos al <span className="grad">Product Backlog</span>
        </>
      }
      sub="Estándar ISO/IEC/IEEE 29148 con límites estrictos por microservicio"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '460px 1fr', gap: 36, height: '100%' }}>
        {/* Columna izquierda: como se construyo + actores + metricas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <Reveal at={1} from="left">
            <div className="card" style={{ padding: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <Bot size={32} color={colors.cyan} />
                <strong style={{ fontSize: 28 }}>Generación asistida</strong>
              </div>
              <div className="muted" style={{ fontSize: 22, lineHeight: 1.45 }}>
                Prompt estructurado desde BPM → Épicas → HUs con ≥ 5 criterios verificables y fronteras claras.
              </div>
            </div>
          </Reveal>

          <Reveal at={1} from="left" delay={0.12}>
            <div className="card" style={{ padding: 26 }}>
              <div style={{ fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.violet, fontWeight: 700, marginBottom: 16 }}>
                Actores identificados
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <UserCog size={30} color={colors.amber} />
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>Administrador de Flota</div>
                    <div className="muted" style={{ fontSize: 19 }}>Reglas, órdenes manuales, filtros, asignación</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <HardHat size={30} color={colors.green} />
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>Técnico de Mantenimiento</div>
                    <div className="muted" style={{ fontSize: 19 }}>Mis órdenes, avance de estado, bitácora</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal at={2} from="scale">
            <div className="card" style={{ padding: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: 56, fontWeight: 900, color: colors.cyan }}>
                  <CountUp to={stories.length} at={2} />
                </div>
                <div className="muted" style={{ fontSize: 20 }}>Historias (HU)</div>
              </div>
              <div>
                <div style={{ fontSize: 56, fontWeight: 900, color: colors.violet }}>
                  <CountUp to={totalPoints} at={2} />
                </div>
                <div className="muted" style={{ fontSize: 20 }}>Puntos Fibonacci</div>
              </div>
              <div>
                <div style={{ fontSize: 44, fontWeight: 800, color: colors.amber }}>{sprintConfig.count}</div>
                <div className="muted" style={{ fontSize: 19 }}>Sprints (1 sem.)</div>
              </div>
              <div>
                <div style={{ fontSize: 44, fontWeight: 800, color: colors.green }}>{sprintConfig.commitment}</div>
                <div className="muted" style={{ fontSize: 19 }}>Pts / sprint</div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Columna derecha: HUs + Sprints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Reveal at={2} from="up">
            <div className="card" style={{ padding: '22px 26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 700 }}>
                  <ListChecks size={26} color={colors.cyan} /> Priorización MoSCoW y Estimación
                </span>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Chip color="rose" style={{ fontSize: 18, padding: '4px 14px' }}>Must (7)</Chip>
                  <Chip color="amber" style={{ fontSize: 18, padding: '4px 14px' }}>Should (1)</Chip>
                  <Chip color="cyan" style={{ fontSize: 18, padding: '4px 14px' }}>Could (1)</Chip>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {stories.map((s, idx) => (
                  <motion.div
                    key={s.id}
                    initial={false}
                    animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 16 }}
                    transition={{ duration: 0.4, delay: step >= 2 ? idx * 0.05 : 0 }}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 14,
                      background: 'rgba(255,255,255,0.035)',
                      border: `1px solid ${rgba(moscowColor[s.moscow], 0.35)}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="mono" style={{ fontSize: 20, fontWeight: 700, color: colors[moscowColor[s.moscow]] }}>
                        {s.id}
                      </span>
                      <span className="mono" style={{ fontSize: 18, color: colors.amber }}>
                        {s.points} pts
                      </span>
                    </div>
                    <div style={{ fontSize: 19, marginTop: 6, lineHeight: 1.25 }}>{s.title}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal at={3} from="up">
            <div className="card" style={{ padding: '22px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
                <Calendar size={26} color={colors.green} /> Planificación en 5 Sprints (1 semana c/u)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
                {sprints.map((sp, idx) => (
                  <motion.div
                    key={sp.name}
                    initial={false}
                    animate={{ opacity: step >= 3 ? 1 : 0, scale: step >= 3 ? 1 : 0.9 }}
                    transition={{ duration: 0.45, delay: step >= 3 ? idx * 0.1 : 0 }}
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      background: idx === 0 ? rgba('cyan', 0.1) : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${idx === 0 ? colors.cyan : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: 22 }}>{sp.name}</strong>
                      <span className="mono" style={{ fontSize: 18, color: colors.green }}>{sp.total} pts</span>
                    </div>
                    {sp.items.map((it) => (
                      <div
                        key={it.label}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 10,
                          background: rgba(moscowColor[it.moscow], 0.12),
                          borderLeft: `3px solid ${colors[moscowColor[it.moscow]]}`,
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                      >
                        {it.label}
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'backlog',
  section: 'Planificación',
  title: 'Product Backlog y Sprints',
  steps: 3,
  minutes: 1.5,
  notes: `
## Qué decir
- [Paso 1] Para armar el Product Backlog partimos de los documentos de procesos (especialmente el Proceso 4 de Mantenimiento y el Proceso 2 de Incidentes). Usamos **IA generativa con un system prompt bajo el estándar ISO/IEC/IEEE 29148** para redactar historias verificables y con fronteras claras (hasta dónde llega Mantenimiento y dónde empieza otro microservicio).
- Identificamos dos actores directos en nuestro módulo: **Administrador de Flota** (parametriza reglas, crea órdenes manuales, filtra y asigna técnicos) y **Técnico de Mantenimiento** (consulta sus órdenes, actualiza estado y registra avances en bitácora). *Nota: el Empleado aparece en la plantilla general del caso, pero en nuestro módulo no opera directamente.*
- [Paso 2] Definimos **9 Historias de Usuario (HU-01 a HU-09)**, priorizadas con **MoSCoW** (7 Must, 1 Should, 1 Could) y estimadas con escala Fibonacci para un peso total de **68 puntos** (la más pesada: HU-02 del Scheduler con 21 pts; pivote de 8 pts).
- [Paso 3] Planificamos **5 sprints de 1 semana** con un compromiso de ~16 puntos por sprint: Sprint 1 arranca con **HU-01**, Sprint 2 con **HU-04 y HU-03**, Sprint 3 y 4 dividen el Scheduler (**HU-02 fase 1 y 2**) más consultas (**HU-05 y HU-07**), y Sprint 5 cierra con **HU-09, HU-08 y HU-06**.
`,
  Component: Backlog,
})
