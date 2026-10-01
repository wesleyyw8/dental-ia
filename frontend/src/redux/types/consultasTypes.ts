import type { Consulta, CriarConsultaResponse } from '../../types'

export const CONSULTAS_REQUEST = 'consultas/request' as const
export const CONSULTAS_SUCCESS = 'consultas/success' as const
export const CONSULTAS_FAILURE = 'consultas/failure' as const
export const CRIAR_CONSULTA_REQUEST = 'consultas/createRequest' as const
export const CRIAR_CONSULTA_SUCCESS = 'consultas/createSuccess' as const
export const CRIAR_CONSULTA_FAILURE = 'consultas/createFailure' as const
export const CRIAR_CONSULTA_RESET = 'consultas/createReset' as const
export const CANCELAR_CONSULTA_REQUEST = 'consultas/cancelRequest' as const
export const CANCELAR_CONSULTA_SUCCESS = 'consultas/cancelSuccess' as const
export const CANCELAR_CONSULTA_FAILURE = 'consultas/cancelFailure' as const
export const REMARCAR_CONSULTA_REQUEST = 'consultas/rescheduleRequest' as const
export const REMARCAR_CONSULTA_SUCCESS = 'consultas/rescheduleSuccess' as const
export const REMARCAR_CONSULTA_FAILURE = 'consultas/rescheduleFailure' as const
export const CONSULTA_MUTATION_RESET = 'consultas/mutationReset' as const

export interface ConsultasState {
  items: Consulta[]
  loading: boolean
  error: string | null
  creating: boolean
  createError: string | null
  created: CriarConsultaResponse | null
  cancelingId: number | null
  cancelError: string | null
  reschedulingId: number | null
  rescheduleError: string | null
  mutationSuccess: string | null
}

export type ConsultasAction =
  | { type: typeof CONSULTAS_REQUEST }
  | { type: typeof CONSULTAS_SUCCESS; payload: Consulta[] }
  | { type: typeof CONSULTAS_FAILURE; payload: string }
  | { type: typeof CRIAR_CONSULTA_REQUEST }
  | { type: typeof CRIAR_CONSULTA_SUCCESS; payload: CriarConsultaResponse }
  | { type: typeof CRIAR_CONSULTA_FAILURE; payload: string }
  | { type: typeof CRIAR_CONSULTA_RESET }
  | { type: typeof CANCELAR_CONSULTA_REQUEST; payload: number }
  | { type: typeof CANCELAR_CONSULTA_SUCCESS; payload: { id: number; message: string } }
  | { type: typeof CANCELAR_CONSULTA_FAILURE; payload: string }
  | { type: typeof REMARCAR_CONSULTA_REQUEST; payload: number }
  | { type: typeof REMARCAR_CONSULTA_SUCCESS; payload: string }
  | { type: typeof REMARCAR_CONSULTA_FAILURE; payload: string }
  | { type: typeof CONSULTA_MUTATION_RESET }
