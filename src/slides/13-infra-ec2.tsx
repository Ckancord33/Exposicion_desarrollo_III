import { Activity, Globe, Lock, Server, ShieldCheck, Database } from 'lucide-react'
import { Diagram, type DEdge, type DNode } from '../components/Diagram'
import { Reveal } from '../components/Reveal'
import { Chip, SlideFrame } from '../components/ui'
import { config } from '../config'
import { defineSlide } from '../deck/types'

const nodes: DNode[] = [
  { id: 'cli', x: 20, y: 170, w: 260, h: 140, label: 'Cliente / Gateway', sub: 'HTTPS', icon: Globe, color: 'cyan' },
  { id: 'dns', x: 400, y: 170, w: 300, h: 140, label: 'DuckDNS', sub: config.deploy.domain, icon: Globe, color: 'violet', at: 1 },
  { id: 'ec2', x: 820, y: 40, w: 470, h: 400, label: '', shape: 'box', color: 'amber', at: 1, z: 1 },
  { id: 'tls', x: 860, y: 80, w: 390, h: 130, label: `Nginx · TLS :${config.deploy.port}`, sub: 'Proxy inverso · Let’s Encrypt', icon: Lock, color: 'green', at: 2, z: 3 },
  { id: 'app', x: 860, y: 260, w: 390, h: 145, label: 'Docker · Spring Boot', sub: 'API :8083 · Actuator :18001', icon: Server, color: 'cyan', glow: true, at: 2, z: 3 },
  { id: 'db', x: 1390, y: 40, w: 270, h: 140, label: 'Supabase PG', sub: 'Session Pooler', icon: Database, color: 'blue', at: 3 },
  { id: 'mon', x: 1390, y: 290, w: 270, h: 150, label: 'Grafana (local)', sub: 'Prometheus · Loki', icon: Activity, color: 'rose', at: 3 },
]

const edges: DEdge[] = [
  { from: 'cli', to: 'dns', at: 1, color: 'cyan', packets: 2, label: 'resuelve IP', labelDy: -26 },
  { from: 'dns', to: 'tls', at: 2, color: 'green', packets: 2, label: `HTTPS :${config.deploy.port}`, labelDx: -80, labelDy: 10 },
  { from: 'tls', to: 'app', at: 2, color: 'amber', packets: 2, label: 'HTTP :8083', labelDx: 66 },
  { from: 'app', to: 'db', at: 3, color: 'blue', packets: 2, label: 'JDBC', labelDy: -24 },
  { from: 'mon', to: 'app', fromSide: 'l', toSide: 'r', at: 3, color: 'rose', packets: 2, label: 'pull :18001', labelDx: -40, labelDy: 56 },
]

function InfraEc2() {
  return (
    <SlideFrame
      eyebrow="11 · Infraestructura en AWS"
      title={
        <>
          EC2 + <span className="grad">DuckDNS</span> + Nginx :{config.deploy.port} + Certbot
        </>
      }
      sub="HTTPS con dominio público; el puerto interno 8083 nunca se expone a internet"
    >
      <Diagram width={1680} height={470} nodes={nodes} edges={edges} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}>
        <Reveal at={2} from="left">
          <div className="card" style={{ padding: '18px 26px', display: 'flex', gap: 22, alignItems: 'center' }}>
            <ShieldCheck size={34} color="#34d399" />
            <span style={{ fontSize: 22, whiteSpace: 'nowrap' }}>
              Security Group: <strong className="mono" style={{ color: '#fbbf24' }}>{config.deploy.port}</strong> público ·{' '}
              <strong className="mono" style={{ color: '#fb7185' }}>18001 13100 19100 18080</strong> solo mi IP ·{' '}
              <strong className="mono" style={{ color: '#22d3ee' }}>8083</strong> cerrado
            </span>
          </div>
        </Reveal>

        <Reveal at={3} from="right">
          <div style={{ display: 'flex', gap: 12 }}>
            <Chip color="green">Let’s Encrypt válido</Chip>
            <Chip color="amber">Amazon Linux 2023</Chip>
          </div>
        </Reveal>
      </div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'infra-ec2',
  section: 'Infraestructura',
  title: 'EC2, DuckDNS, Nginx y Certbot',
  steps: 3,
  minutes: 1.25,
  notes: `
## Qué decir
- [Paso 1] Aprovisionamos una instancia **AWS EC2** (Amazon Linux 2023) y registramos un dominio gratuito en **DuckDNS** (\`${config.deploy.domain}\`) que apunta a la IP pública de la máquina.
- [Paso 2] **Nginx** actúa como proxy inverso: recibe el tráfico cifrado por **HTTPS en el puerto ${config.deploy.port}** con un certificado gratuito emitido por **Certbot (Let's Encrypt)**, válido hasta enero de 2027, y lo reenvía al contenedor de Mantenimiento en el puerto **8083**. El 8083 no está abierto en el Security Group: desde internet solo se entra por Nginx.
- [Paso 2] El **Actuator** (health y métricas) corre en un puerto de gestión separado, el **18001**, para que nunca quede expuesto por el dominio público: si alguien pide \`/actuator\` por el ${config.deploy.port}, recibe 404.
- [Paso 3] El contenedor toma sus credenciales del \`.env\` del servidor (nunca versionado en Git) y se conecta por JDBC al Session Pooler de PostgreSQL en **Supabase** y a AWS SNS/SQS para la mensajería.
- [Paso 3] **Monitoreo**: Prometheus y Grafana corren en nuestra máquina local (no en producción) y leen el EC2 con modelo pull: métricas del servicio en **18001**, del sistema con Node Exporter (**19100**), de los contenedores con cAdvisor (**18080**) y logs desde **Loki (13100)**, que Alloy alimenta con la salida de Docker. Todos esos puertos están abiertos **solo para nuestra IP**.
`,
  Component: InfraEc2,
})
