import type { Dentista } from '../../types'

export const DENTISTAS_REQUEST = 'dentistas/request' as const
export const DENTISTAS_SUCCESS = 'dentistas/success' as const
export const DENTISTAS_FAILURE = 'dentistas/failure' as const
export const DENTISTAS_CLEAR = 'dentistas/clear' as const

export interface DentistasState {
  items: Dentista[]
  loading: boolean
  error: string | null
}

export type DentistasAction =
  | { type: typeof DENTISTAS_REQUEST }
  | { type: typeof DENTISTAS_SUCCESS; payload: Dentista[] }
  | { type: typeof DENTISTAS_FAILURE; payload: string }
  | { type: typeof DENTISTAS_CLEAR }
