import { motion } from 'framer-motion'
import { Bot, CheckCircle2, CloudUpload, Container, FlaskConical, ShieldCheck, Sparkles, Terminal as TermIcon } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { Chip, SlideFrame, StatusDot } from '../components/ui'
import { config } from '../config'
import { useStep } from '../deck/context'
import { defineSlide } from '../deck/types'
import { colors, rgba } from '../theme'

const ciSteps = [
  { label: 'PostgreSQL 16 service + JDK 21', icon: TermIcon, color: 'blue' as const },
  { label: 'Checkstyle (Google Java Style)', icon: ShieldCheck, color: 'cyan' as const },
  { label: 'Tests unitarios + Testcontainers', icon: FlaskConical, color: 'violet' as const },
  { label: 'JaCoCo ≥ 80% cobertura (96% alcanzado)', icon: CheckCircle2, color: 'green' as const },
  { label: 'SonarCloud Quality Gate', icon: Sparkles, color: 'amber' as const },
  { label: 'bootJar ejecutable', icon: Container, color: 'cyan' as const },
]

const cdSteps = [
  { label: 'Push / Merge a main', sub: 'dispara cd.yml', color: 'cyan' as const },
  { label: 'Dockerfile multi-stage', sub: 'JDK 21 build → JRE 21 non-root', color: 'blue' as const },
  { label: 'Push a Docker Hub', sub: `${config.dockerImage}:latest + :sha`, color: 'violet' as const },
  { label: 'SSH a AWS EC2', sub: 'docker compose pull && up -d', color: 'green' as const },
]

function CiCd() {
  const step = useStep()
  return (
    <SlideFrame
      eyebrow="10 & 12 · GitHub Actions"
      title={
        <>
          Integración y <span className="grad">Despliegue Continuo</span> (CI / CD)
        </>
      }
      sub="Tres workflows automatizados: ci.yml · qodo-review.yml · cd.yml"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34, height: '100%' }}>
        {/* Columna izquierda: CI + Qodo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="card" style={{ padding: 26, flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <strong style={{ fontSize: 28, color: colors.cyan }}>CI Pipeline (ci.yml)</strong>
              <Chip color="cyan" style={{ fontSize: 18 }}>PR → develop / main</Chip>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ciSteps.map((s, i) => {
                const Icon = s.icon
                const active = step >= 1
                const passed = step >= 2
                return (
                  <motion.div
                    key={s.label}
                    initial={false}
                    animate={{ opacity: active ? 1 : 0.25, x: active ? 0 : -14 }}
                    transition={{ duration: 0.4, delay: active ? i * 0.1 : 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 14,
                      background: 'rgba(255,255,255,0.035)',
                      border: `1px solid ${passed ? rgba('green', 0.45) : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Icon size={22} color={colors[s.color]} />
                      <span style={{ fontSize: 22, fontWeight: 600 }}>{s.label}</span>
                    </div>
                    <StatusDot state={passed ? 'ok' : active ? 'run' : 'idle'} color={passed ? 'green' : s.color} />
                  </motion.div>
                )
              })}
            </div>
          </div>

          <Reveal at={2} from="up">
            <div className="card" style={{ padding: '20px 26px', borderColor: rgba('violet', 0.55), display: 'flex', alignItems: 'center', gap: 18 }}>
              <Bot size={38} color={colors.violet} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>
                  Qodo AI PR Review <span className="mono muted" style={{ fontSize: 18 }}>(qodo-review.yml)</span>
                </div>
                <div className="muted" style={{ fontSize: 19, marginTop: 4 }}>
                  pr-agent con Gemini 3.8 Flash (+ fallback) ejecuta <code className="mono">review</code> e <code className="mono">improve</code> en cada PR hacia develop.
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Columna derecha: CD */}
        <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <strong style={{ fontSize: 28, color: colors.green }}>CD Pipeline (cd.yml)</strong>
              <Chip color="green" icon={CloudUpload} style={{ fontSize: 18 }}>push → main</Chip>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {cdSteps.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={false}
                  animate={{ opacity: step >= 3 ? 1 : 0.2, x: step >= 3 ? 0 : 24 }}
                  transition={{ duration: 0.45, delay: step >= 3 ? i * 0.14 : 0 }}
                  style={{
                    padding: '18px 22px',
                    borderRadius: 18,
                    background: rgba(s.color, 0.1),
                    border: `1.5px solid ${rgba(s.color, 0.5)}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 25, fontWeight: 700 }}>{s.label}</div>
                    <div className="mono muted" style={{ fontSize: 19, marginTop: 4 }}>{s.sub}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 28, fontWeight: 800, color: colors[s.color] }}>
                    0{i + 1}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <Reveal at={3} from="fade">
            <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', fontSize: 20 }}>
              <strong style={{ color: colors.amber }}>Dato clave:</strong> la imagen se etiqueta con el <strong>SHA del commit</strong> y se despliega sin compilar en el servidor EC2 (<code className="mono">--no-build</code>).
            </div>
          </Reveal>
        </div>
      </div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'ci-cd',
  section: 'CI / CD',
  title: 'Integración y Despliegue Continuo',
  steps: 3,
  minutes: 1.75,
  notes: `
## Qué decir
- Aquí conectamos la exigencia DevOps del curso con nuestros tres workflows en GitHub Actions:
- [Paso 1-2] **Integración Continua (\`ci.yml\`)**: cada Pull Request hacia \`develop\` o \`main\` levanta un servicio real de PostgreSQL 16, ejecuta **Checkstyle**, corre todas las pruebas unitarias e integración (con **Testcontainers**), exige **mínimo 80% de cobertura en JaCoCo** (llegamos hasta el 96% en la capa de persistencia), envía métricas a **SonarCloud** para validar el Quality Gate y compila el \`bootJar\`.
- [Paso 2] **Revisión con IA (\`qodo-review.yml\`)**: en paralelo, cuando alguien abre PR hacia \`develop\`, Qodo (\`pr-agent\` usando Gemini) revisa el diff automáticamente, deja sugerencias y detecta bugs (por ejemplo, nos ayudó a corregir mapeos bidireccionales JPA, el \`FOR UPDATE SKIP LOCKED\` del outbox y el endurecimiento de Actuator).
- [Paso 3] **Despliegue Continuo (\`cd.yml\`)**: al hacer merge a \`main\`, construye la imagen con nuestro **Dockerfile multi-stage** (usuario no-root \`spring\` y healthcheck), la publica en **Docker Hub** (\`ckancord33/fleetops-mantenimiento\`) etiquetada con \`:latest\` y el SHA exacto del commit, entra por SSH a nuestra instancia **AWS EC2** y actualiza el contenedor con \`docker compose pull && up -d --no-build\`.
`,
  Component: CiCd,
})
