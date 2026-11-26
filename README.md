# FleetOps · Presentación Microservicio de Mantenimiento (Grupo 03)

Presentación interactiva en **React + TypeScript + Framer Motion** para la exposición de **Desarrollo de Software III** (Universidad del Valle, código 750027C).  
Documenta todo el flujo trabajado por la célula de Mantenimiento: desde la comprensión del problema hasta el despliegue continuo en AWS EC2 y la implementación de la **HU-01**.

- **Repositorio del microservicio:** https://github.com/FleetOpsProyect/grupo_03_mantenimiento
- **Duración objetivo:** máximo **20 minutos** (plan actual: **19.5 min** en 15 diapositivas).
- **Documentación fuente:** [`docs/`](./docs)

---

## 1. Equipo (Célula de Mantenimiento · Grupo 03)

| Integrante | Código | Rama personal |
|---|---|---|
| Nicolas Cordoba | 2343576 | `nco` |
| Juan Sebastian Sierra | 2343656 | `jss` |
| Juan Manuel Ampudia | 2342174 | `maj` |
| Daniel Andrade | 2343792 | `DAR` |
| Jhoan Sebastian Fernandez | 2222772 | `jsfv` |

---

## 2. Cómo ejecutar la presentación

```bash
npm install
npm run dev
```

Para generar el build estático (`dist/`):

```bash
npm run typecheck
npm run build
npm run preview
```

### Controles durante la exposición

| Tecla / Acción | Función |
|---|---|
| `→` / `Espacio` / `Enter` | Avanzar paso de animación o siguiente diapositiva |
| `←` / `Backspace` | Retroceder paso o diapositiva anterior |
| `N` o botón **Notas** | Abre/cierra el panel lateral con el guion detallado de qué decir |
| `T` | Activa/oculta el temporizador comparado contra el plan de 20 minutos |
| `O` o `G` | Vista general de todas las diapositivas y su tiempo asignado |
| `F` | Pantalla completa |
| Clic en imágenes de diagramas | Abre visor ampliado (`Esc` para cerrar) |

> [!IMPORTANT]
> Antes de exponer, actualiza el subdominio real de DuckDNS en [`src/config.ts`](./src/config.ts) (`deploy.domain`).

---

## 3. Estructura del proyecto (fácil de editar y animar)

```text
├── AGENTS.md                  # Reglas y restricciones para mantener el deck
├── public/diagrams/           # Diagramas UML y DER exportados del DAS
└── src/
    ├── config.ts              # Configuración global (tiempo límite, repo, dominio DuckDNS, puerto)
    ├── theme.ts               # Paleta de colores y utilidades rgba
    ├── data/                  # Datos desacoplados de la UI
    │   ├── team.ts            # Integrantes, códigos y ramas
    │   ├── backlog.ts         # 9 HUs, MoSCoW, 68 pts Fibonacci y 5 sprints
    │   ├── quality.ts         # Atributos ISO 25010 -> patrones
    │   ├── endpoints.ts       # Endpoints REST + payloads + HUs cubiertas
    │   └── tables.ts          # Modelo relacional de 7 tablas
    ├── deck/                  # Motor de diapositivas (navegación, notas, timer, overview)
    ├── components/            # Primitivas animadas (Reveal, Diagram, Terminal, Code, ZoomImage)
    └── slides/
        ├── index.ts           # Orden oficial de las diapositivas
        └── 01-..15-*.tsx      # Una diapositiva autocontenida por archivo
```

Para **cambiar el orden, ocultar o agregar diapositivas**, solo edita [`src/slides/index.ts`](./src/slides/index.ts). Cada archivo en `src/slides/` usa `defineSlide({ id, section, title, steps, minutes, notes, Component })`.

---

## 4. Flujo de la exposición (15 diapositivas · 19.5 min)

| # | Diapositiva | Archivo | Contenido principal | Min |
|---|---|---|---|---|
| 01 | Portada | `01-portada.tsx` | FleetOps · Mantenimiento y los 5 integrantes | 0.50 |
| 02 | El problema | `02-problema.tsx` | FleetCorp (+250 vehículos), gestión manual y dolores del dominio | 0.75 |
| 03 | Qué hace el microservicio | `03-que-hace.tsx` | Preventivo (Scheduler 02:00), Correctivo (eventos) e integraciones | 1.25 |
| 04 | Product Backlog y Sprints | `04-backlog.tsx` | Prompt IA (IEEE 29148), actores, 9 HUs, MoSCoW, 68 pts y 5 sprints | 1.50 |
| 05 | Arquitectura Hexagonal | `05-arquitectura.tsx` | DAS: núcleo Java 21, 9 puertos de entrada, adaptadores de entrada/salida, regla de dependencia y prueba real RabbitMQ → SNS/SQS | 1.75 |
| 06 | ISO 25010 y Patrones | `06-calidad.tsx` | 9 atributos ISO 25010 que se van cubriendo con 5 patrones animados: Outbox, Circuit Breaker + Saga, Rule Engine + Strategy, Borde seguro, Recursos/Despliegue | 2.00 |
| 07 | Endpoints y Payloads | `07-endpoints.tsx` | Inspector interactivo de endpoints REST + payloads cubriendo HU-01..HU-09 | 1.50 |
| 08 | Catálogo de Eventos | `08-eventos.tsx` | CloudEvents v1.0, evento entrante/salientes, DLQ y evolución RabbitMQ → SNS/SQS | 1.25 |
| 09 | Modelo Relacional | `09-modelo-datos.tsx` | 7 tablas en PostgreSQL/Supabase, Flyway V1/V2 e índices únicos parciales | 1.25 |
| 10 | Diagramas UML | `10-diagramas.tsx` | Vistas de Componentes, Física y Despliegue con visor ampliable | 1.25 |
| 11 | Arquetipo, Ramas y Rulesets | `11-arquetipo-ramas.tsx` | Inicialización con IA + DAS, ramas por iniciales (`nco`, `jss`, `maj`, `DAR`, `jsfv`) y rulesets | 1.50 |
| 12 | CI / CD | `12-ci-cd.tsx` | GitHub Actions: Checkstyle, Tests/Testcontainers, JaCoCo ≥ 80%, SonarCloud, Qodo AI, Docker Hub → EC2 | 1.75 |
| 13 | Infraestructura EC2 | `13-infra-ec2.tsx` | AWS EC2, DuckDNS, puerto abierto `6767`, Certbot HTTPS → contenedor `:8083` | 1.25 |
| 14 | Implementación HU-01 | `14-hu1-demo.tsx` | Flujo en vivo por el hexágono de `POST /maintenance/rules`, validaciones y 12 pruebas | 1.75 |
| 15 | Cierre | `15-cierre.tsx` | Síntesis del recorrido completo y espacio para preguntas | 0.75 |

---

## 5. Resumen técnico de referencia (del DAS y el repositorio)

- **Stack:** Java 21 LTS, Spring Boot 3.4.3, Gradle, PostgreSQL (Supabase Session Pooler), Flyway, Resilience4j, Spring Cloud AWS (SNS/SQS) / CloudEvents v1.0, OpenAPI 3.0, Actuator + Prometheus/Grafana.
- **Calidad y CI (`ci.yml` + `qodo-review.yml`):** PostgreSQL 16 service container, Checkstyle, Testcontainers, JaCoCo (umbral mínimo 80%), SonarCloud Quality Gate, revisión automática de PRs con Qodo AI (Gemini).
- **Despliegue (`cd.yml`):** Dockerfile multi-stage (JRE 21 non-root), publicación en Docker Hub (`ckancord33/fleetops-mantenimiento:latest` y `:sha`) y despliegue por SSH en AWS EC2 con `docker-compose.prod.yml`.
