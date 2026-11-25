/**
 * Endpoints del microservicio de Mantenimiento y las HU que cubren.
 * Fuente: FleetOps_Endpoints_y_Eventos_Modulo_Mantenimiento.xlsx + backlog.
 */
export type Method = 'GET' | 'POST' | 'PUT'

export interface EndpointDef {
  id: string
  method: Method
  path: string
  summary: string
  stories: string[]
  role: string
  request?: string
  response: string
  status: string
  errors: string
}

export const endpoints: EndpointDef[] = [
  {
    id: 'rules',
    method: 'POST',
    path: '/maintenance/rules',
    summary: 'Registra una regla preventiva',
    stories: ['HU-01'],
    role: 'Administrador de flota',
    request: `{
  "scope_type": "CATEGORIA",
  "vehicle_category": "CAMIONETA",
  "mileage_interval_km": 10000,
  "time_interval_days": 180,
  "routine_description": "Cambio de aceite"
}`,
    status: '201 Created',
    response: `{
  "id": "0c9e…",
  "scope_type": "CATEGORIA",
  "vehicle_category": "CAMIONETA",
  "mileage_interval_km": 10000,
  "time_interval_days": 180,
  "is_active": true
}`,
    errors: '400 · 404 · 409 · 422 · 503',
  },
  {
    id: 'manual',
    method: 'POST',
    path: '/maintenance',
    summary: 'Registra una orden manual',
    stories: ['HU-03'],
    role: 'Administrador de flota',
    request: `{
  "vehicle_id": "018f3a5e-…",
  "maintenance_type": "CORRECTIVO",
  "description": "Revisión extraordinaria de frenos",
  "technician_id": "tec-…"
}`,
    status: '201 Created',
    response: `{
  "id": "manto-4a8f…",
  "status": "PROGRAMADO_PENDIENTE",
  "origin": "MANUAL",
  "incident_id": null,
  "current_mileage": 50120
}`,
    errors: '400 · 404 · 409 · 503',
  },
  {
    id: 'list',
    method: 'GET',
    path: '/maintenance',
    summary: 'Lista paginada con filtros y resumen',
    stories: ['HU-05'],
    role: 'Administrador · Sistema (Reportes)',
    request: `?status=EN_PROCESO
&maintenance_type=PREVENTIVO
&vehicle_id=…&technician_id=…
&page=0&size=20`,
    status: '200 OK',
    response: `{
  "contenido": [ … ],
  "page": 0, "size": 20, "total": 42,
  "resumen": {
    "by_status": { … },
    "by_type": { … },
    "avg_repair_hours": 6.4
  }
}`,
    errors: '400 · 503',
  },
  {
    id: 'detail',
    method: 'GET',
    path: '/maintenance/{id}',
    summary: 'Detalle con bitácora y adjuntos',
    stories: ['HU-06'],
    role: 'Administrador · Técnico · Sistema',
    response: `{
  "id": "manto-4a8f…",
  "status": "EN_PROCESO",
  "total_cost": 350000,
  "logs": [
    { "log_type": "AVANCE",
      "notes": "Cambio de pastillas",
      "attachments": [ … ] }
  ]
}`,
    status: '200 OK',
    errors: '404 · 503',
  },
  {
    id: 'mine',
    method: 'GET',
    path: '/maintenance/my_orders',
    summary: 'Órdenes del técnico autenticado',
    stories: ['HU-07'],
    role: 'Técnico de mantenimiento',
    request: `?status=PROGRAMADO_PENDIENTE
&page=0&size=20`,
    status: '200 OK',
    response: `{
  "contenido": [ … ],
  "total": 3,
  "resumen": { "by_status": { … } }
}`,
    errors: '400 · 404 · 503',
  },
  {
    id: 'status',
    method: 'PUT',
    path: '/maintenance/{id}/status',
    summary: 'Avanza el estado de la orden',
    stories: ['HU-08'],
    role: 'Técnico de mantenimiento',
    request: `{ "status": "COMPLETADO" }`,
    status: '200 OK',
    response: `{
  "id": "manto-4a8f…",
  "status": "COMPLETADO",
  "completed_at": "2026-11-18T15:30:00Z",
  "total_cost": 350000
}
→ evento MantenimientoFinalizadoEvent`,
    errors: '404 · 409 INVALID_TRANSITION · 422',
  },
  {
    id: 'logs',
    method: 'POST',
    path: '/maintenance/{id}/logs',
    summary: 'Registra un avance en la bitácora',
    stories: ['HU-09'],
    role: 'Técnico de mantenimiento',
    request: `{
  "log_type": "AVANCE",
  "notes": "Cambio de pastillas delanteras",
  "cost_delta": 120000,
  "attachments": [ { "file_url": "…" } ]
}`,
    status: '201 Created',
    response: `{
  "id": "log-…",
  "log_type": "AVANCE",
  "registered_at": "2026-11-18T14:02:11Z"
}`,
    errors: '400 · 404 · 409 ORDER_NOT_IN_PROGRESS',
  },
  {
    id: 'tech',
    method: 'PUT',
    path: '/maintenance/{id}/technician',
    summary: 'Asigna o reasigna el técnico',
    stories: ['HU-07', 'HU-08'],
    role: 'Administrador de flota',
    request: `{ "technician_id": "tec-…" }`,
    status: '200 OK',
    response: `{
  "id": "manto-4a8f…",
  "technician_id": "tec-…"
}
→ log ASIGNACION_TECNICO`,
    errors: '400 · 404 · 409',
  },
]

/** HU que no se exponen por REST: las dispara un proceso interno o un evento. */
export const nonRestStories = [
  { id: 'HU-02', via: 'Scheduler @Scheduled · 02:00 America/Bogota' },
  { id: 'HU-04', via: 'Listener de eventos: incidente.reportado' },
]
