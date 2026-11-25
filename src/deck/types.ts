import type { ComponentType } from 'react'

/**
 * Definicion de una diapositiva.
 *  - steps:   cantidad de "pasos" (animaciones que se disparan con →). 0 = diapositiva estatica.
 *  - minutes: tiempo sugerido para explicarla (alimenta el temporizador y la vista general).
 *  - notes:   guion para el expositor (boton "Notas" o tecla N). Puede ser largo.
 */
export interface SlideDef {
  id: string
  section: string
  title: string
  steps: number
  minutes: number
  presenter?: string
  notes: string
  Component: ComponentType
}

/** Helper para obtener autocompletado/tipado al declarar una diapositiva. */
export const defineSlide = (slide: SlideDef): SlideDef => slide
