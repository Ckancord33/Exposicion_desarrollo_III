import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

/** Imagen que se amplia a pantalla completa al hacer clic (diagramas del DAS). */
export function ZoomImage({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])
  return (
    <>
      <img src={src} alt={alt} className="zoom-img" style={style} onClick={() => setOpen(true)} draggable={false} />
      <AnimatePresence>
        {open && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <img src={src} alt={alt} draggable={false} />
            <span className="lightbox-hint">clic o Esc para cerrar</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
