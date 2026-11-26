/**
 * Configuracion global de la presentacion.
 * Los valores marcados con TODO son datos que solo el equipo conoce: ajustarlos aqui
 * y se actualizan en todas las diapositivas.
 */
export const config = {
  title: 'FleetOps · Mantenimiento',
  course: 'Desarrollo de Software III',
  university: 'Universidad del Valle',
  teamName: 'Grupo 03 · Equipo de Mantenimiento',

  /** Duracion maxima de la exposicion (minutos). El temporizador (tecla T) usa este valor. */
  totalMinutes: 20,

  repoUrl: 'https://github.com/FleetOpsProyect/grupo_03_mantenimiento',
  dockerImage: 'ckancord33/fleetops-mantenimiento',

  deploy: {
    // Dominio real (certificado Let's Encrypt valido hasta enero de 2027).
    domain: 'fleetops-mantenimiento.duckdns.org',
    port: 6767,
  },
}

export const repoSlug = config.repoUrl.replace('https://github.com/', '')
