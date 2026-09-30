import type { HorariosResponse } from '../../types'

export const HORARIOS_REQUEST = 'horarios/request' as const
export const HORARIOS_SUCCESS = 'horarios/success' as const
export const HORARIOS_FAILURE = 'horarios/failure' as const
export const HORARIOS_CLEAR = 'horarios/clear' as const

export interface HorariosState {
  data: HorariosResponse | null
  loading: boolean
  error: string | null
}

export type HorariosAction =
  | { type: typeof HORARIOS_REQUEST }
  | { type: typeof HORARIOS_SUCCESS; payload: HorariosResponse }
  | { type: typeof HORARIOS_FAILURE; payload: string }
  | { type: typeof HORARIOS_CLEAR }
