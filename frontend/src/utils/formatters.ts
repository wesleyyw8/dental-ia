export const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL',
}).format(value)

export const formatDate = (value: string) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: 'short', year: 'numeric',
}).format(new Date(`${value.slice(0, 10)}T12:00:00`))

export const formatLongDate = (value: string) => new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long', day: '2-digit', month: 'long',
}).format(new Date(`${value.slice(0, 10)}T12:00:00`))

export const formatTime = (value: string) => value.slice(11, 16)

export const todayIso = () => {
  const date = new Date()
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

export const initials = (name: string) => name
  .replace(/^(Dr\.?|Dra\.?)\s+/i, '')
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase()
