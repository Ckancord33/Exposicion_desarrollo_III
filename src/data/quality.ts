/**
 * Atributos de calidad (ISO 25010) y patrones/tacticas que los cumplen.
 * Fuente: DAS v0.3 (tablas de atributos observables y no observables).
 */
export interface QualityAttribute {
  id: string
  name: string
  patterns: string[]
  where: string
  color: 'cyan' | 'violet' | 'green' | 'amber' | 'rose' | 'blue' | 'orange'
}

export const quality: QualityAttribute[] = [
  {
    id: 'func',
    name: 'Adecuación funcional',
    patterns: ['Pruebas unitarias', 'Bean Validation', 'Transactional Outbox'],
    where: 'Umbrales del scheduler y transiciones de estado verificados en src/test',
    color: 'cyan',
  },
  {
    id: 'perf',
    name: 'Eficiencia',
    patterns: ['Pool HikariCP', 'Paginación (20 / 100)', 'DTO ligeros'],
    where: 'maximum-pool-size en application.yaml; Pageable en cada listado',
    color: 'amber',
  },
  {
    id: 'compat',
    name: 'Compatibilidad',
    patterns: ['REST + OpenAPI', 'Pub/Sub', 'CloudEvents v1.0'],
    where: 'Contratos tipados y eventos con sobre estándar',
    color: 'blue',
  },
  {
    id: 'ux',
    name: 'Interacción (API)',
    patterns: ['Códigos HTTP semánticos', 'Errores estandarizados', 'Fail-fast'],
    where: 'GlobalExceptionHandler traduce cada excepción a su código HTTP',
    color: 'violet',
  },
  {
    id: 'rel',
    name: 'Fiabilidad',
    patterns: ['Outbox', 'Circuit Breaker', 'Saga', 'DLQ', 'Idempotencia'],
    where: 'Cliente de Vehículos, relay del outbox y consumidor de incidentes',
    color: 'rose',
  },
  {
    id: 'sec',
    name: 'Seguridad',
    patterns: ['API Gateway', 'JWT + RBAC', 'Auditoría', 'Validación en DTO'],
    where: 'Gateway en el borde y Spring Security como defensa en profundidad',
    color: 'green',
  },
  {
    id: 'maint',
    name: 'Mantenibilidad',
    patterns: ['Arquitectura hexagonal', 'Rule Engine', 'Strategy', 'Métricas'],
    where: 'Dominio puro; reglas VEHICULO > CATEGORIA > GLOBAL; Prometheus',
    color: 'orange',
  },
  {
    id: 'flex',
    name: 'Flexibilidad',
    patterns: ['Flyway', 'Docker', 'Variables de entorno', 'ORM'],
    where: 'Migraciones versionadas e imagen inmutable por commit',
    color: 'cyan',
  },
]
