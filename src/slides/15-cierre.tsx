import { motion } from 'framer-motion'
import { CheckCircle2, Cloud, GitBranch, Layers, Rocket } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { Chip, SlideFrame } from '../components/ui'
import { config } from '../config'
import { defineSlide } from '../deck/types'
import { colors } from '../theme'

const pillars = [
  { Icon: Layers, color: 'cyan' as const, title: 'Diseño limpio', desc: 'Hexagonal + ISO 25010 + 7 tablas Flyway' },
  { Icon: GitBranch, color: 'violet' as const, title: 'Flujo seguro', desc: 'Ramas personales, Rulesets y Qodo AI' },
  { Icon: CheckCircle2, color: 'green' as const, title: 'Calidad verificada', desc: 'Checkstyle, Testcontainers, JaCoCo & SonarCloud' },
  { Icon: Cloud, color: 'amber' as const, title: 'Entrega continua', desc: 'Docker Hub → EC2 · DuckDNS :6767 · HU-01 lista' },
]

function Cierre() {
  return (
    <SlideFrame
      eyebrow="Cierre"
      title={
        <>
          De los procesos manuales a <span className="grad">producción continua</span>
        </>
      }
      sub={`${config.teamName} · ${config.repoUrl}`}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 28 }}>
        {pillars.map(({ Icon, color, title, desc }, i) => (
          <Reveal key={title} at={1} from="up" delay={i * 0.1}>
            <div className="card" style={{ padding: 28, height: 290, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Icon size={48} color={colors[color]} />
              <div>
                <div style={{ fontSize: 30, fontWeight: 800 }}>{title}</div>
                <div className="muted" style={{ fontSize: 22, marginTop: 8, lineHeight: 1.35 }}>{desc}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        style={{
          marginTop: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 36px',
          borderRadius: 24,
          background: 'linear-gradient(90deg, rgba(34,211,238,0.12), rgba(167,139,250,0.12))',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Rocket size={40} color={colors.cyan} />
          <span style={{ fontSize: 38, fontWeight: 800 }}>¿Preguntas o comentarios?</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Chip color="cyan">Próximo paso: HU-04 y HU-02</Chip>
          <Chip color="green">¡Gracias!</Chip>
        </div>
      </motion.div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'cierre',
  section: 'Cierre',
  title: 'Resumen y Preguntas',
  steps: 1,
  minutes: 0.75,
  notes: `
## Qué decir
- En resumen: arrancamos entendiendo el negocio, delimitamos el módulo con un Product Backlog bajo IEEE 29148, diseñamos arquitectura hexagonal y contratos antes de tirar una línea de código, automatizamos calidad (CI + SonarCloud + Qodo) y despliegue continuo en AWS EC2 con HTTPS, y ya entregamos la **HU-01** funcionando.
- Lo siguiente en nuestro roadmap de sprints: completar **HU-04** (eventos de incidentes) y **HU-02** (scheduler preventivo).
- Quedamos atentos a preguntas del profesor y de los demás equipos.
`,
  Component: Cierre,
})
