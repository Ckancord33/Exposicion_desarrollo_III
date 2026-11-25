export interface Member {
  name: string
  short: string
  code: string
  /** Rama personal del repositorio (iniciales del nombre). */
  branch: string
}

export const team: Member[] = [
  { name: 'Nicolas Cordoba', short: 'Nicolas', code: '2343576', branch: 'nco' },
  { name: 'Juan Sebastian Sierra', short: 'Juan Sebastian', code: '2343656', branch: 'jss' },
  { name: 'Juan Manuel Ampudia', short: 'Juan Manuel', code: '2342174', branch: 'maj' },
  { name: 'Daniel Andrade', short: 'Daniel', code: '2343792', branch: 'DAR' },
  { name: 'Jhoan Sebastian Fernandez', short: 'Jhoan', code: '2222772', branch: 'jsfv' },
]
