# AGENTS.md — Instrucciones y Restricciones del Proyecto

Este archivo define las reglas obligatorias para cualquier agente o colaborador que modifique esta presentación de **FleetOps · Microservicio de Mantenimiento (Grupo 03)**.

## 1. Contexto del Proyecto y Equipo

- **Curso:** Desarrollo de Software III (750027C) · Universidad del Valle.
- **Repositorio del microservicio:** `https://github.com/FleetOpsProyect/grupo_03_mantenimiento`
- **Equipo (Célula de Mantenimiento / Grupo 03):**
  - Nicolas Cordoba (`2343576`) · rama `nco`
  - Juan Sebastian Sierra (`2343656`) · rama `jss`
  - Juan Manuel Ampudia (`2342174`) · rama `maj`
  - Daniel Andrade (`2343792`) · rama `DAR`
  - Jhoan Sebastian Fernandez (`2222772`) · rama `jsfv`

## 2. Restricciones Estrictas de la Presentación

1. **Duración máxima: 20 minutos.**
   - La suma de `minutes` de todas las diapositivas en `src/slides/index.ts` **nunca debe superar `20`** (`config.totalMinutes` en `src/config.ts`).
   - Actualmente las 15 diapositivas suman **18.75 minutos**, dejando ~1.25 minutos de margen.
2. **Mínimo texto en pantalla.**
   - Las diapositivas deben priorizar diagramas animados (`Diagram`), tarjetas cortas, código puntual (`Code` / `Terminal`) y chips visuales.
   - Evitar párrafos largos en el escenario (`1920x1080`).
3. **Notas de expositor ricas en detalle.**
   - Toda la explicación extensa que se espera decir en voz alta va dentro del campo `notes` de `defineSlide(...)` (visible mediante el botón **Notas** o tecla `N`).
4. **Animación por pasos (`steps`).**
   - Cada diapositiva debe usar `steps` (> 0 salvo excepciones justificadas) combinando `Reveal`, `Diagram` (nodos/flechas con `at` y `packets`) y `Terminal`/`motion`.
   - Mantener siempre el espacio en layout al ocultar elementos con `Reveal` para evitar saltos bruscos.
5. **Fidelidad a los artefactos reales.**
   - No inventar endpoints, tablas, nombres de ramas, herramientas de CI/CD ni métricas que no estén en `docs/` o en el repositorio `grupo_03_mantenimiento`.
   - Nota de evolución real: el DAS inicial contempla **RabbitMQ** y en `develop` (PR #21) la mensajería migró a **AWS SNS / SQS** con CloudEvents v1.0. Ambas realidades deben quedar claras sin contradecirse.
   - Si falta un dato específico de despliegue (ej. subdominio exacto de DuckDNS), centralizarlo en `src/config.ts` con un comentario `TODO`.

## 3. Convenciones Técnicas de Código

- **Stack:** React 19 + TypeScript + Vite + Framer Motion + Lucide React.
- **Escenario fijo:** `1920 x 1080` (`STAGE_W`, `STAGE_H` en `src/deck/constants.ts`), escalado automáticamente al viewport.
- **Cómo agregar o editar una diapositiva:**
  1. Crear o editar `src/slides/XX-nombre.tsx` exportando por defecto `defineSlide({ id, section, title, steps, minutes, notes, Component })`.
  2. Registrar o reordenar el módulo en `src/slides/index.ts`.
  3. Verificar con `npm run typecheck` y `npm run build` después de cada cambio.
- **Rutas de imágenes estáticas:** colocar diagramas en `public/diagrams/` y referenciarlos con ruta relativa `./diagrams/...` (por `base: './'` en `vite.config.ts`).
- **Idioma del contenido:** Español (las diapositivas, títulos y notas están en español para la exposición de clase).
