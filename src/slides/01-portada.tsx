import { motion } from 'framer-motion'
import { Cog, Truck, Wrench } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { config } from '../config'
import { team } from '../data/team'
import { defineSlide } from '../deck/types'

const floaters = [
  { Icon: Wrench, x: 1420, y: 130, size: 120, delay: 0 },
  { Icon: Cog, x: 1640, y: 420, size: 170, delay: 1.2 },
  { Icon: Truck, x: 1300, y: 330, size: 130, delay: 2.4 },
]

function Portada() {
  return (
    <div className="slide" style={{ justifyContent: 'center' }}>
      {floaters.map(({ Icon, x, y, size, delay }, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', left: x, top: y, color: 'rgba(34,211,238,0.16)' }}
          animate={{ y: [0, -26, 0], rotate: i === 1 ? [0, 180, 360] : [0, 8, 0] }}
          transition={{ duration: i === 1 ? 24 : 7, repeat: Infinity, ease: 'easeInOut', delay }}
        >
          <Icon size={size} strokeWidth={1.2} />
        </motion.div>
      ))}

      <motion.div
        className="eyebrow"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="eyebrow-dot" />
        {config.course} · {config.university}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 50, filter: 'blur(14px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontSize: 176, margin: '20px 0 0', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95 }}
      >
        <span className="grad">FleetOps</span>
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{ fontSize: 60, margin: '14px 0 0', fontWeight: 600, color: '#e2e8f0' }}
      >
        Microservicio de Mantenimiento
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="sub"
      >
        {config.teamName}
      </motion.p>

      <div style={{ display: 'flex', gap: 22, marginTop: 70 }}>
        {team.map((m, i) => (
          <Reveal key={m.code} at={1} from="up" delay={i * 0.12}>
            <div className="card" style={{ width: 300, padding: '24px 26px' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 26,
                  background: 'linear-gradient(135deg, rgba(34,211,238,.35), rgba(167,139,250,.35))',
                  marginBottom: 16,
                }}
              >
                {m.name
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>{m.name}</div>
              <div className="mono muted" style={{ fontSize: 22, marginTop: 8 }}>
                {m.code}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default defineSlide({
  id: 'portada',
  section: 'Inicio',
  title: 'Portada',
  steps: 1,
  minutes: 0.5,
  notes: `
## Qué decir
- Saludo y presentación del grupo: somos el **Grupo 03, equipo de Mantenimiento** del proyecto FleetOps.
- Presentar a los cinco integrantes (aparecen con →).
- Adelantar la ruta: primero entendemos qué hace el microservicio, luego cómo lo planificamos y diseñamos, y al final cómo lo construimos, lo integramos y lo desplegamos.

## Tiempo
- 30 segundos. No te detengas aquí.
`,
  Component: Portada,
})
