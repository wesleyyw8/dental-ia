import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  actions: ReactNode
}

export function Modal({ open, title, children, onClose, actions }: ModalProps) {
  if (!open) return null
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal__header"><h2 id="modal-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={20} /></button></div>
        <div className="modal__body">{children}</div>
        <div className="modal__actions">{actions}</div>
      </section>
    </div>
  )
}
