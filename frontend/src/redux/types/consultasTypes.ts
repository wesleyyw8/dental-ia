import type { Consulta, CriarConsultaResponse } from '../../types'

export const CONSULTAS_REQUEST = 'consultas/request' as const
export const CONSULTAS_SUCCESS = 'consultas/success' as const
export const CONSULTAS_FAILURE = 'consultas/failure' as const
export const CRIAR_CONSULTA_REQUEST = 'consultas/createRequest' as const
export const CRIAR_CONSULTA_SUCCESS = 'consultas/createSuccess' as const
export const CRIAR_CONSULTA_FAILURE = 'consultas/createFailure' as const
export const CRIAR_CONSULTA_RESET = 'consultas/createReset' as const

export interface ConsultasState {
  items: Consulta[]
  loading: boolean
  error: string | null
  creating: boolean
  createError: string | null
  created: CriarConsultaResponse | null
}

export type ConsultasAction =
  | { type: typeof CONSULTAS_REQUEST }
  | { type: typeof CONSULTAS_SUCCESS; payload: Consulta[] }
  | { type: typeof CONSULTAS_FAILURE; payload: string }
  | { type: typeof CRIAR_CONSULTA_REQUEST }
  | { type: typeof CRIAR_CONSULTA_SUCCESS; payload: CriarConsultaResponse }
  | { type: typeof CRIAR_CONSULTA_FAILURE; payload: string }
  | { type: typeof CRIAR_CONSULTA_RESET }
