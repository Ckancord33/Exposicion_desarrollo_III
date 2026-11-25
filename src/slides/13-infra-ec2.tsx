import { Globe, Lock, Server, ShieldCheck, Database } from 'lucide-react'
import { Diagram, type DEdge, type DNode } from '../components/Diagram'
import { Reveal } from '../components/Reveal'
import { Chip, SlideFrame } from '../components/ui'
import { config } from '../config'
import { defineSlide } from '../deck/types'

const nodes: DNode[] = [
  { id: 'cli', x: 20, y: 170, w: 260, h: 140, label: 'Cliente / Gateway', sub: 'HTTPS', icon: Globe, color: 'cyan' },
  { id: 'dns', x: 400, y: 170, w: 300, h: 140, label: 'DuckDNS', sub: config.deploy.domain, icon: Globe, color: 'violet', at: 1 },
  { id: 'ec2', x: 820, y: 40, w: 470, h: 400, label: '', shape: 'box', color: 'amber', at: 1, z: 1 },
  { id: 'tls', x: 860, y: 80, w: 390, h: 130, label: `Certbot TLS · :${config.deploy.port}`, sub: 'Let’s Encrypt + Proxy inverso', icon: Lock, color: 'green', at: 2, z: 3 },
  { id: 'app', x: 860, y: 260, w: 390, h: 145, label: 'Docker · Spring Boot', sub: 'puerto interno :8083 · /actuator/health', icon: Server, color: 'cyan', glow: true, at: 2, z: 3 },
  { id: 'db', x: 1390, y: 170, w: 270, h: 140, label: 'Supabase PG', sub: 'Session Pooler', icon: Database, color: 'blue', at: 3 },
]

const edges: DEdge[] = [
  { from: 'cli', to: 'dns', at: 1, color: 'cyan', packets: 2, label: 'resuelve IP', labelDy: -26 },
  { from: 'dns', to: 'tls', at: 2, color: 'green', packets: 2, label: `HTTPS :${config.deploy.port}`, labelDx: -10, labelDy: -28 },
  { from: 'tls', to: 'app', at: 2, color: 'amber', packets: 2, label: 'HTTP :8083', labelDx: 66 },
  { from: 'app', to: 'db', at: 3, color: 'blue', packets: 2, label: 'JDBC', labelDy: -24 },
]

function InfraEc2() {
  return (
    <SlideFrame
      eyebrow="11 · Infraestructura en AWS"
      title={
        <>
          EC2 + <span className="grad">DuckDNS</span> + Puerto {config.deploy.port} + Certbot HTTPS
        </>
      }
      sub="Acceso cifrado con dominio público apuntando a la instancia sin exponer el puerto interno 8083"
    >
      <Diagram width={1680} height={470} nodes={nodes} edges={edges} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}>
        <Reveal at={2} from="left">
          <div className="card" style={{ padding: '18px 26px', display: 'flex', gap: 22, alignItems: 'center' }}>
            <ShieldCheck size={34} color="#34d399" />
            <span style={{ fontSize: 23 }}>
              Security Group abre <strong className="mono" style={{ color: '#fbbf24' }}>{config.deploy.port}</strong> para HTTPS · contenedor corre aislado en <strong className="mono" style={{ color: '#22d3ee' }}>8083</strong>
            </span>
          </div>
        </Reveal>

        <Reveal at={3} from="right">
          <div style={{ display: 'flex', gap: 12 }}>
            <Chip color="green">Certbot SSL válido</Chip>
            <Chip color="amber">AWS EC2 Linux</Chip>
          </div>
        </Reveal>
      </div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'infra-ec2',
  section: 'Infraestructura',
  title: 'EC2, DuckDNS y Certbot',
  steps: 3,
  minutes: 1.25,
  notes: `
## Qué decir
- [Paso 1] Aprovisionamos una instancia en **AWS EC2** y registramos un dominio gratuito dinámico en **DuckDNS** apuntando a la IP pública de la máquina.
- [Paso 2] Abrimos el puerto **6767** en el Security Group de AWS y emitimos un certificado TLS gratuito con **Certbot (Let's Encrypt)**. El proxy inverso recibe el tráfico cifrado por **HTTPS en el puerto 6767** y lo reenvía internamente al contenedor Docker de Mantenimiento que escucha en el puerto **8083**.
- [Paso 3] El contenedor inyecta todas sus credenciales desde el archivo \`.env\` en el servidor (nunca versionado en Git) y se conecta por JDBC al Session Pooler de PostgreSQL en **Supabase** y a los servicios de mensajería.
- **Recordatorio:** actualiza \`domain\` en \`src/config.ts\` con el subdominio exacto de DuckDNS antes de presentar.
`,
  Component: InfraEc2,
})
