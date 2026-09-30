import axios from 'axios'

export const api = axios.create({
  // O proxy local evita CORS sem exigir qualquer alteração no FastAPI.
  baseURL: import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'),
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

interface ApiErrorBody {
  erro?: string
  detail?: string
}

export function getApiError(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (error.code === 'ECONNABORTED') return 'A API demorou para responder. Tente novamente.'
    if (!error.response) return 'Não foi possível conectar à API. Verifique se o backend está ativo.'
    return error.response.data?.erro ?? error.response.data?.detail ?? 'Não foi possível concluir a solicitação.'
  }
  return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
}
