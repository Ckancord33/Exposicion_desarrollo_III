import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  src: string
  alt: string
  style?: CSSProperties
  className?: string
}

/**
 * Miniatura que abre la imagen a pantalla completa.
 *
 * El visor se monta con un portal en document.body: así `position: fixed`
 * es relativo a la ventana y no al slide (que está escalado con transform).
 */
export function ZoomImage({ src, alt, style, className }: Props) {
  const [open, setOpen] = useState(false)

  // Esc cierra el visor; las flechas/espacio no cambian de slide mientras está abierto.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopImmediatePropagation()
        setOpen(false)
      } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown'].includes(e.key)) {
        e.stopImmediatePropagation()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label={`Ampliar: ${alt}`}
        className={className}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        style={{
          padding: 0,
          border: '1.5px solid rgba(255,255,255,0.25)',
          borderRadius: 10,
          overflow: 'hidden',
          background: '#fff',
          cursor: 'zoom-in',
          display: 'block',
          ...style,
        }}
      >
        <img src={src} alt={alt} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="zoom-overlay"
              role="dialog"
              aria-modal="true"
              aria-label={alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
              }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(3, 6, 18, 0.92)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5vh 4vw',
                cursor: 'zoom-out',
              }}
            >
              <motion.img
                src={src}
                alt={alt}
                draggable={false}
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.96 }}
                transition={{ duration: 0.18 }}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                }}
              />
              <div
                style={{
                  position: 'fixed',
                  top: 18,
                  right: 24,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 16,
                  color: '#cbd5e1',
                }}
              >
                <X size={18} /> Clic o Esc para cerrar
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}