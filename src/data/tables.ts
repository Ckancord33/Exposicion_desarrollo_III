/**
 * Modelo relacional (7 tablas). Fuente: DER del equipo + migracion Flyway V1/V2 del repositorio.
 */
export interface TableDef {
  id: string
  name: string
  color: 'cyan' | 'violet' | 'green' | 'amber' | 'rose' | 'blue' | 'orange'
  columns: { name: string; type: string; key?: 'PK' | 'FK' | 'UK' }[]
  more?: number
}

export const tables: Record<string, TableDef> = {
  technician: {
    id: 'technician',
    name: 'TECHNICIAN',
    color: 'violet',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK' },
      { name: 'email', type: 'string', key: 'UK' },
      { name: 'name', type: 'string' },
      { name: 'is_active', type: 'boolean' },
    ],
    more: 4,
  },
  order: {
    id: 'order',
    name: 'MAINTENANCE_ORDER',
    color: 'amber',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK' },
      { name: 'vehicle_id', type: 'uuid' },
      { name: 'technician_id', type: 'uuid', key: 'FK' },
      { name: 'incident_id', type: 'uuid' },
      { name: 'maintenance_type', type: 'string' },
      { name: 'status', type: 'string' },
      { name: 'origin', type: 'string' },
      { name: 'total_cost', type: 'decimal' },
    ],
    more: 7,
  },
  log: {
    id: 'log',
    name: 'MAINTENANCE_LOG',
    color: 'cyan',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK' },
      { name: 'maintenance_order_id', type: 'uuid', key: 'FK' },
      { name: 'log_type', type: 'string' },
      { name: 'notes', type: 'text' },
      { name: 'cost_delta', type: 'decimal' },
    ],
    more: 4,
  },
  attachment: {
    id: 'attachment',
    name: 'MAINTENANCE_LOG_ATTACHMENT',
    color: 'green',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK' },
      { name: 'maintenance_log_id', type: 'uuid', key: 'FK' },
      { name: 'file_url', type: 'string' },
      { name: 'mime_type', type: 'string' },
    ],
    more: 3,
  },
  outbox: {
    id: 'outbox',
    name: 'OUTBOX_MESSAGE',
    color: 'rose',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK' },
      { name: 'maintenance_order_id', type: 'uuid', key: 'FK' },
      { name: 'message_type', type: 'EVENT | VEHICLE_CALL' },
      { name: 'payload', type: 'json' },
      { name: 'status', type: 'PENDING | SENT' },
      { name: 'attempts', type: 'integer' },
    ],
    more: 5,
  },
  rule: {
    id: 'rule',
    name: 'PREVENTIVE_RULE',
    color: 'blue',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK' },
      { name: 'scope_type', type: 'GLOBAL | CATEGORIA | VEHICULO' },
      { name: 'mileage_interval_km', type: 'integer' },
      { name: 'time_interval_days', type: 'integer' },
    ],
    more: 5,
  },
  audit: {
    id: 'audit',
    name: 'ACCESS_AUDIT_LOG',
    color: 'orange',
    columns: [
      { name: 'id', type: 'uuid', key: 'PK' },
      { name: 'actor_email', type: 'string' },
      { name: 'action', type: 'string' },
      { name: 'status_result', type: 'string' },
    ],
    more: 7,
  },
}
