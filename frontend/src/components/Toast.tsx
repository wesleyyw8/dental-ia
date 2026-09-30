import { CheckCircle2, X } from 'lucide-react'

interface ToastProps { message: string; onClose: () => void }

export function Toast({ message, onClose }: ToastProps) {
  return <div className="toast" role="status"><CheckCircle2 size={20} /><span>{message}</span><button onClick={onClose} aria-label="Fechar"><X size={16} /></button></div>
}
