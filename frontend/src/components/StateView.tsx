import { AlertCircle, Inbox, LoaderCircle, RefreshCw } from 'lucide-react'

interface StateViewProps {
  type: 'loading' | 'error' | 'empty'
  title?: string
  message?: string
  onRetry?: () => void
  compact?: boolean
}

export function StateView({ type, title, message, onRetry, compact = false }: StateViewProps) {
  const Icon = type === 'loading' ? LoaderCircle : type === 'error' ? AlertCircle : Inbox
  const defaultTitle = type === 'loading' ? 'Carregando…' : type === 'error' ? 'Algo não saiu como esperado' : 'Nenhum resultado encontrado'
  return (
    <div className={`state-view ${compact ? 'state-view--compact' : ''}`}>
      <span className={`state-view__icon state-view__icon--${type}`}><Icon size={22} className={type === 'loading' ? 'spin' : ''} /></span>
      <div><strong>{title ?? defaultTitle}</strong>{message && <p>{message}</p>}</div>
      {onRetry && <button className="button button--secondary button--small" onClick={onRetry}><RefreshCw size={15} /> Tentar novamente</button>}
    </div>
  )
}
