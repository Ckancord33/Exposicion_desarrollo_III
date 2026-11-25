import { motion } from 'framer-motion'
import { ArrowRight, Bell, Clock, Database, Globe, Layers, ShieldCheck, Truck } from 'lucide-react'
import { Diagram, type DEdge, type DNode } from '../components/Diagram'
import { Reveal } from '../components/Reveal'
import { Chip, SlideFrame } from '../components/ui'
import { defineSlide } from '../deck/types'

const nodes: DNode[] = [
  // Inbound
  { id: 'rest', x: 20, y: 40, w: 320, h: 110, label: 'REST Controllers', sub: 'Rule · Order', icon: Globe, color: 'cyan', at: 1 },
  { id: 'sched', x: 20, y: 195, w: 320, h: 110, label: 'Scheduler', sub: '@Scheduled 02:00', icon: Clock, color: 'violet', at: 1 },
  { id: 'lst', x: 20, y: 350, w: 320, h: 110, label: 'Event Listener', sub: 'Incidentes · Relay', icon: Bell, color: 'rose', at: 1 },

  // Nucleo Hexagonal
  { id: 'hex', x: 470, y: 40, w: 720, h: 420, shape: 'hex', color: 'cyan', at: 0, z: 1 },
  { id: 'app', x: 560, y: 95, w: 540, h: 120, label: 'Capa de Aplicación', sub: 'Casos de Uso (@Service · @Transactional)', icon: Layers, color: 'blue', at: 2, z: 3 },
  { id: 'dom', x: 600, y: 260, w: 460, h: 145, label: 'Núcleo de Dominio', sub: 'Java 21 Puro · Cero Spring/JPA', icon: ShieldCheck, color: 'cyan', glow: true, at: 2, z: 3 },

  // Outbound
  { id: 'jpa', x: 1320, y: 40, w: 330, h: 110, label: 'Persistencia JPA', sub: 'PostgreSQL · Flyway', icon: Database, color: 'green', at: 3 },
  { id: 'veh', x: 1320, y: 195, w: 330, h: 110, label: 'VehicleHttpAdapter', sub: 'RestClient + Resilience4j', icon: Truck, color: 'amber', at: 3 },
  { id: 'pub', x: 1320, y: 350, w: 330, h: 110, label: 'Outbox & Broker', sub: 'OutboxJpa + SNS/RabbitMQ', icon: Bell, color: 'orange', at: 3 },
]

const edges: DEdge[] = [
  { from: 'rest', to: 'app', at: 2, color: 'cyan', packets: 1 },
  { from: 'sched', to: 'app', at: 2, color: 'violet', packets: 1 },
  { from: 'lst', to: 'app', at: 2, color: 'rose', packets: 1 },
  { from: 'app', to: 'dom', at: 2, color: 'cyan', packets: 1 },
  { from: 'app', to: 'jpa', at: 3, color: 'green', packets: 1, label: 'Port Out' },
  { from: 'app', to: 'veh', at: 3, color: 'amber', packets: 1 },
  { from: 'app', to: 'pub', at: 3, color: 'orange', packets: 1 },
]

function Arquitectura() {
  return (
    <SlideFrame
      eyebrow="3 · DAS — Macro Arquitectura"
      title={
        <>
          Arquitectura <span className="grad">Hexagonal</span> (Puertos y Adaptadores)
        </>
      }
      sub="Regla de oro: todas las dependencias apuntan hacia el núcleo de dominio"
    >
      <Diagram width={1680} height={490} nodes={nodes} edges={edges} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 26 }}>
        <Reveal at={2} from="left">
          <div className="card" style={{ padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
            <strong style={{ fontSize: 26, color: '#22d3ee' }}>Regla de dependencia:</strong>
            <span className="mono" style={{ fontSize: 24 }}>Adaptadores</span>
            <ArrowRight size={24} color="#94a3b8" />
            <span className="mono" style={{ fontSize: 24 }}>Aplicación</span>
            <ArrowRight size={24} color="#94a3b8" />
            <span className="mono" style={{ fontSize: 24, color: '#34d399', fontWeight: 700 }}>Dominio (Java 21)</span>
          </div>
        </Reveal>

        <Reveal at={3} from="right">
          <div style={{ display: 'flex', gap: 12 }}>
            <Chip color="cyan">Java 21 LTS</Chip>
            <Chip color="green">Spring Boot 3.4.3</Chip>
            <Chip color="violet">9 Puertos In · 7 Puertos Out</Chip>
          </div>
        </Reveal>
      </div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'arquitectura',
  section: 'DAS',
  title: 'Arquitectura Hexagonal',
  steps: 3,
  minutes: 1.5,
  notes: `
## Qué decir
- En el **DAS (Documento de Arquitectura de Software)** elegimos **Arquitectura Hexagonal (Puertos y Adaptadores)** en lugar de arquitectura en capas tradicional.
- ¿Por qué? Porque si mañana cambia el broker de mensajería (como nos pasó migrando de RabbitMQ a AWS SNS/SQS), la base de datos o el cliente HTTP, **el núcleo de negocio no se toca**.
- [Paso 1] **Adaptadores de entrada** (izquierda): reciben estímulos externos — peticiones REST (\`RuleController\`, \`OrderController\`), el \`@Scheduled\` de las 02:00 AM, y los listeners de eventos.
- [Paso 2] **Núcleo** (centro): **Aplicación** orquesta los casos de uso (\`@Service\`, \`@Transactional\`) y el **Dominio** contiene las entidades (\`MaintenanceOrder\`, \`MaintenanceRule\`, etc.) y reglas en **Java 21 puro**, sin una sola anotación de Spring o JPA.
- [Paso 3] **Adaptadores de salida** (derecha): implementan los puertos de salida definidos por el núcleo: persistencia JPA en PostgreSQL/Supabase con Flyway, cliente HTTP a Vehículos con Resilience4j y publicador de eventos con Outbox.
`,
  Component: Arquitectura,
})
