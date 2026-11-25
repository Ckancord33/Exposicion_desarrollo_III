import { createContext, useContext } from 'react'

export interface DeckState {
  /** Paso actual dentro de la diapositiva (0 = nada revelado todavia). */
  step: number
  slideIndex: number
}

export const StepContext = createContext<DeckState>({ step: 0, slideIndex: 0 })

/** Devuelve el paso actual. Usar en componentes de diapositiva para condicionar animaciones. */
export const useStep = () => useContext(StepContext).step
