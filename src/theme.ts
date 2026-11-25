export const colors = {
  cyan: '#22d3ee',
  violet: '#a78bfa',
  green: '#34d399',
  amber: '#fbbf24',
  rose: '#fb7185',
  blue: '#60a5fa',
  orange: '#fb923c',
  slate: '#94a3b8',
} as const

export type Color = keyof typeof colors

/** Convierte un color del tema a rgba() con la opacidad indicada. */
export function rgba(color: Color | string, alpha: number): string {
  const hex = (color in colors ? colors[color as Color] : color).replace('#', '')
  const n = parseInt(hex, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

export const hex = (c: Color) => colors[c]
