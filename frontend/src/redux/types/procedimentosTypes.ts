import type { Procedimento } from '../../types'

export const PROCEDIMENTOS_REQUEST = 'procedimentos/request' as const
export const PROCEDIMENTOS_SUCCESS = 'procedimentos/success' as const
export const PROCEDIMENTOS_FAILURE = 'procedimentos/failure' as const

export interface ProcedimentosState {
  items: Procedimento[]
  loading: boolean
  error: string | null
}

export type ProcedimentosAction =
  | { type: typeof PROCEDIMENTOS_REQUEST }
  | { type: typeof PROCEDIMENTOS_SUCCESS; payload: Procedimento[] }
  | { type: typeof PROCEDIMENTOS_FAILURE; payload: string }
