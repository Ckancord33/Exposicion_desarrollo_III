import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Box, Cloud, Cpu } from 'lucide-react'
import { SlideFrame } from '../components/ui'
import { ZoomImage } from '../components/ZoomImage'
import { useStep } from '../deck/context'
import { defineSlide } from '../deck/types'
import { colors, rgba } from '../theme'

const views = [
  {
    id: 'componentes',
    title: 'Vista Lógica / Componentes',
    sub: 'Descomposición hexagonal en paquetes, puertos y adaptadores (DAS §4)',
    icon: Cpu,
    color: 'cyan' as const,
    images: ['./diagrams/componentes-1.png', './diagrams/componentes-2.png'],
  },
  {
    id: 'fisica',
    title: 'Vista Física',
    sub: 'Topología de red: API Gateway, contenedor, NAT Gateway, Supabase y MS Vehículos (DAS §3)',
    icon: Box,
    color: 'amber' as const,
    images: ['./diagrams/fisica.png'],
  },
  {
    id: 'despliegue',
    title: 'Vista de Despliegue',
    sub: 'EC2 + Docker, Prometheus/Grafana (/actuator/prometheus), Broker y Supabase Cloud (DAS §5)',
    icon: Cloud,
    color: 'violet' as const,
    images: ['./diagrams/despliegue.png'],
  },
]

function Diagramas() {
  const step = useStep()
  const [tab, setTab] = useState(0)

  useEffect(() => {
    if (step >= 0 && step < views.length) setTab(step)
  }, [step])

  const v = views[tab]

  return (
    <SlideFrame
      eyebrow="7 · Vistas Arquitectónicas (Modelo de Kruchten)"
      title={
        <>
          Componentes, Vista <span className="grad">Física</span> y de Despliegue
        </>
      }
      sub="Haz clic en cada imagen para ampliarla a pantalla completa"
    >
      <div style={{ display: 'flex', gap: 16, marginBottom: 22 }}>
        {views.map((item, i) => {
          const Icon = item.icon
          const active = i === tab
          return (
            <button
              key={item.id}
              onClick={() => setTab(i)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 22px',
                borderRadius: 18,
                background: active ? rgba(item.color, 0.16) : 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${active ? colors[item.color] : 'rgba(255,255,255,0.1)'}`,
                color: '#fff',
                textAlign: 'left',
              }}
            >
              <Icon size={28} color={colors[item.color]} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{item.title}</div>
                <div className="muted" style={{ fontSize: 17, marginTop: 2 }}>{item.sub.slice(0, 56)}…</div>
              </div>
            </button>
          )
        })}
      </div>

      <motion.div
        key={v.id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card"
        style={{
          height: 550,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
          {v.images.map((src, idx) => (
            <ZoomImage
              key={src}
              src={src}
              alt={`${v.title} ${idx + 1}`}
              style={{
                maxHeight: 470,
                maxWidth: v.images.length > 1 ? '48%' : '92%',
                width: 'auto',
                height: 'auto',
              }}
            />
          ))}
        </div>
        <div className="muted" style={{ fontSize: 20 }}>{v.sub}</div>
      </motion.div>
    </SlideFrame>
  )
}

export default defineSlide({
  id: 'diagramas',
  section: 'Vistas UML',
  title: 'Componentes, Física y Despliegue',
  steps: 2,
  minutes: 1.25,
  notes: `
## Qué decir
- Siguiendo el modelo de Kruchten del DAS, cerramos el diseño antes de programar con las 3 vistas UML:
- [Paso 0] **Vista Lógica / de Componentes**: muestra cómo el contenedor de Spring Boot separa por paquetes los controladores/schedulers/listeners (entrada), los casos de uso (` + '`Application`' + `), las entidades puras (` + '`Domain`' + `), los puertos y los adaptadores de salida.
- [Paso 1] **Vista Física**: tráfico HTTPS del usuario entra por **AWS API Gateway**, llega al microservicio en puerto interno, sale por NAT Gateway hacia **Supabase** y se comunica con **MS Vehículos** y el broker.
- [Paso 2] **Vista de Despliegue**: nodo **AWS EC2** ejecutando el contenedor Docker de Spring Boot + Java 21, scrapeado por **Prometheus y Grafana** en ` + '`/actuator/prometheus`' + `, conectado a Supabase Cloud y al broker de eventos.
- Tip para la demo: si querés mostrar detalles de un diagrama, haz clic sobre la imagen y se abre en pantalla completa.
`,
  Component: Diagramas,
})
