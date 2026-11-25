import { motion } from 'framer-motion'
import { CalendarClock, FileSpreadsheet, Link2Off, Mail, Phone, ShieldAlert } from 'lucide-react'
import { CountUp, IconBadge, SlideFrame } from '../components/ui'
import { Reveal } from '../components/Reveal'
import { defineSlide } from '../deck/types'
import { colors } from '../theme'

const chaos = [
  { Icon: FileSpreadsheet, label: 'Hojas de cálculo', x: 40, y: 20, color: 'green' as const, r: -4 },
  { Icon: Mail, label: 'Correos', x: 330, y: 150, color: 'blue' as const, r: 3 },
  { Icon: Phone, label: 'Llamadas', x: 60, y: 300, color: 'amber' as const, r: -2 },
]

const pains = [
  { Icon: CalendarClock, color: 'rose' as const, title: 'Preventivos sin sistema', text: 'Fechas y kilometraje se revisan a mano' },
  { Icon: Link2Off, color: 'amber' as const, title: 'Correctivos sin trazabilidad', text: 'Nadie une el incidente con la reparación' },
  { Icon: ShieldAlert, color: 'violet' as const, title: 'El vehículo dañado sigue asignado', text: 'Nada lo bloquea mientras se repara' },
]

function Problema() {
  return (
    <SlideFrame eyebrow="1 · Contexto" title={<>Hoy la flota se gestiona <span className="grad">a mano</span></>}>
      <div style={{ display: 'flex', gap: 80, height: '100%' }}>
        <div style={{ width: 640, position: 'relative' }}>
          <Reveal at={0} from="scale">
            <div style={{ fontSize: 150, fontWeight: 900, lineHeight: 1, color: colors.cyan }}>
              <CountUp to={250} at={0} suffix="+" />
            </div>
            <div className="muted" style={{ fontSize: 30, marginTop: 6 }}>vehículos · varias ciudades · FleetCorp S.A.</div>
          </Reveal>
          <div style={{ position: 'relative', marginTop: 40, height: 380 }}>
            {chaos.map(({ Icon, label, x, y, color, r }, i) => (
              <Reveal key={label} at={1} from="pop" delay={i * 0.15} style={{ position: 'absolute', left: x, top: y }}>
                <motion.div
                  className="card"
                  animate={{ rotate: [r, -r, r], y: [0, -8, 0] }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 26px' }}
                >
                  <Icon size={40} color={colors[color]} />
                  <span style={{ fontSize: 28, fontWeight: 600 }}>{label}</span>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 26, justifyContent: 'center' }}>
          {pains.map(({ Icon, color, title, text }, i) => (
            <Reveal key={title} at={i + 2} from="right">
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                <IconBadge icon={Icon} color={color} />
                <div>
                  <div style={{ fontSize: 36, fontWeight: 700 }}>{title}</div>
                  <div className="muted" style={{ fontSize: 26, marginTop: 4 }}>{text}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'problema',
  section: 'Contexto',
  title: 'El problema de FleetCorp',
  steps: 4,
  minutes: 0.75,
  notes: `
## Qué decir
- **FleetCorp S.A.** gestiona más de 250 vehículos en varias ciudades y lo hace con hojas de cálculo, correos y llamadas. [Paso 1]
- Eso genera tres problemas que son justo los que le toca resolver a Mantenimiento:
- [Paso 2] **Preventivos sin sistema**: dependen de recordatorios manuales de fechas y kilometraje, y eso ha causado fallas evitables y sobrecostos.
- [Paso 3] **Correctivos sin trazabilidad**: el conductor avisa por teléfono, administración escribe un correo, y después no hay forma de ligar el incidente con la reparación.
- [Paso 4] **El vehículo dañado sigue asignado**: no hay un mecanismo que lo bloquee mientras se repara.

## Idea fuerza
- Nuestro microservicio nace para eliminar esos tres puntos.
`,
  Component: Problema,
})
