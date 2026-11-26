import { motion } from 'framer-motion'
import { Bot, FolderGit2, GitBranch, GitPullRequest, ShieldCheck } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { Chip, SlideFrame, Terminal } from '../components/ui'
import { team } from '../data/team'
import { useStep } from '../deck/context'
import { defineSlide } from '../deck/types'
import { colors, rgba } from '../theme'

// Reglas reales de los rulesets "main" y "develop" del repositorio (API de GitHub).
const rules = [
  'Sin push directo, force-push ni borrado de main y develop',
  'Pull Request obligatorio con plantilla (.github/PULL_REQUEST_TEMPLATE.md)',
  'main exige 1 aprobación del equipo antes del merge',
  'Check de CI «Build, Lint, Test & Coverage» obligatorio y rama al día',
]

function ArquetipoRamas() {
  const step = useStep()
  return (
    <SlideFrame
      eyebrow="8 & 9 · Arquetipo y GitFlow"
      title={
        <>
          Repositorio, <span className="grad">Arquetipo con IA</span> y Rulesets
        </>
      }
      sub="github.com/FleetOpsProyect/grupo_03_mantenimiento"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '640px 1fr', gap: 36, height: '100%' }}>
        {/* Izquierda: inicializacion y arquetipo con IA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <Reveal at={0} from="left">
            <div className="card" style={{ padding: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <Bot size={32} color={colors.cyan} />
                <strong style={{ fontSize: 28 }}>Arquetipo desde Spring Initializr + IA + DAS</strong>
              </div>
              <div className="muted" style={{ fontSize: 22, lineHeight: 1.45 }}>
                Base en Spring Boot 3.4.3 / Gradle, y luego con el DAS generamos la estructura hexagonal y la capa de persistencia alineada al código real.
              </div>
            </div>
          </Reveal>

          <Terminal
            title="arquetipo · .../mantenimiento"
            at={1}
            size={21}
            step={0.12}
            lines={[
              { text: 'domain/model/        # 7 entidades + enums', color: 'cyan' },
              { text: 'domain/port/in/      # 10 casos de uso', color: 'cyan' },
              { text: 'domain/port/out/     # 7 puertos de salida', color: 'cyan' },
              { text: 'application/service/ # orquestación', color: 'blue' },
              { text: 'infrastructure/      # web, JPA, SNS, HTTP', color: 'green' },
              { text: 'db/migration/        # Flyway V1 + V2', color: 'amber' },
            ]}
          />
        </div>

        {/* Derecha: Ramas + Rulesets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <Reveal at={2} from="right">
            <div className="card" style={{ padding: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <GitBranch size={28} color={colors.violet} />
                <strong style={{ fontSize: 28 }}>Estrategia de ramas por iniciales</strong>
              </div>

              {/* Diagrama de flujo de ramas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {team.map((m, idx) => (
                    <motion.div
                      key={m.branch}
                      initial={false}
                      animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.85 }}
                      transition={{ duration: 0.35, delay: step >= 2 ? idx * 0.08 : 0 }}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 14,
                        background: rgba('cyan', 0.1),
                        border: `1.5px solid ${rgba('cyan', 0.5)}`,
                      }}
                    >
                      <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: colors.cyan }}>{m.branch}</div>
                      <div className="muted" style={{ fontSize: 16 }}>{m.short}</div>
                    </motion.div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6 }}>
                  <Chip color="cyan" icon={GitPullRequest} style={{ fontSize: 20 }}>PR personal → develop</Chip>
                  <span className="muted" style={{ fontSize: 22 }}>→</span>
                  <Chip color="violet" icon={FolderGit2} style={{ fontSize: 20 }}>develop (integración)</Chip>
                  <span className="muted" style={{ fontSize: 22 }}>→</span>
                  <Chip color="green" icon={ShieldCheck} style={{ fontSize: 20 }}>main (producción)</Chip>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal at={3} from="up">
            <div className="card" style={{ padding: 26, borderColor: rgba('rose', 0.45) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <ShieldCheck size={28} color={colors.rose} />
                <strong style={{ fontSize: 28 }}>GitHub Rulesets (main &amp; develop)</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {rules.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.035)',
                      borderLeft: `3px solid ${colors.rose}`,
                      fontSize: 20,
                    }}
                  >
                    {r}
                  </div>
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
  id: 'arquetipo-ramas',
  section: 'Repositorio',
  title: 'Arquetipo, Ramas y Rulesets',
  steps: 3,
  minutes: 1.5,
  notes: `
## Qué decir
- [Paso 0-1] Inicializamos el repo en ` + '`FleetOpsProyect/grupo_03_mantenimiento`' + ` con Spring Initializr (Java 21 + Spring Boot 3.4.3 + Gradle). Usando el **DAS como contexto para la IA**, generamos el arquetipo hexagonal completo: un dominio sin dependencias de Spring (7 entidades + enums, solo Lombok), 10 puertos de entrada (uno por historia de usuario más el relay del Outbox), 7 puertos de salida, mappers, entidades JPA y migraciones Flyway ` + '`V1__init_schema.sql`' + ` y ` + '`V2__schema_fixes.sql`' + `.
- [Paso 2] Definimos un GitFlow práctico: cada integrante trabaja en su rama personal identificada con **sus iniciales** (` + '`nco`' + `, ` + '`jss`' + `, ` + '`maj`' + `, ` + '`DAR`' + `, ` + '`jsfv`' + `), usando Conventional Commits.
- [Paso 3] Protegimos ` + '`main`' + ` y ` + '`develop`' + ` con **Rulesets en GitHub** (activos):
  - Nadie puede hacer ` + '`push`' + ` directo, force-push ni borrar ` + '`main`' + ` o ` + '`develop`' + `: todo entra por Pull Request (con la plantilla de checklist hexagonal).
  - El check de CI **«Build, Lint, Test & Coverage»** es obligatorio en ambas ramas, y la rama del PR debe estar al día con la base (política estricta).
  - ` + '`main`' + ` además exige **1 aprobación** de un compañero; en ` + '`develop`' + ` la revisión la apoya **Qodo AI**, que comenta el PR pero no bloquea el merge.
  - Solo de ` + '`develop`' + ` se promueve a ` + '`main`' + ` cuando el incremento está validado para producción.
`,
  Component: ArquetipoRamas,
})
