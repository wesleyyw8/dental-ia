import type { Dentista, Procedimento } from '../../types'

export const PROCEDIMENTOS_REQUEST = 'procedimentos/request' as const
export const PROCEDIMENTOS_SUCCESS = 'procedimentos/success' as const
export const PROCEDIMENTOS_FAILURE = 'procedimentos/failure' as const
export const PROFISSIONAIS_PROCEDIMENTOS_REQUEST = 'procedimentos/professionalsRequest' as const
export const PROFISSIONAIS_PROCEDIMENTOS_SUCCESS = 'procedimentos/professionalsSuccess' as const
export const PROFISSIONAIS_PROCEDIMENTOS_FAILURE = 'procedimentos/professionalsFailure' as const
export const SALVAR_PROCEDIMENTO_REQUEST = 'procedimentos/saveRequest' as const
export const CRIAR_PROCEDIMENTO_SUCCESS = 'procedimentos/createSuccess' as const
export const EDITAR_PROCEDIMENTO_SUCCESS = 'procedimentos/updateSuccess' as const
export const SALVAR_PROCEDIMENTO_FAILURE = 'procedimentos/saveFailure' as const
export const DESATIVAR_PROCEDIMENTO_REQUEST = 'procedimentos/deactivateRequest' as const
export const DESATIVAR_PROCEDIMENTO_SUCCESS = 'procedimentos/deactivateSuccess' as const
export const DESATIVAR_PROCEDIMENTO_FAILURE = 'procedimentos/deactivateFailure' as const
export const PROCEDIMENTO_MUTATION_RESET = 'procedimentos/mutationReset' as const

export interface ProcedimentosState {
  items: Procedimento[]
  loading: boolean
  error: string | null
  profissionaisPorProcedimento: Record<number, Dentista[]>
  profissionaisLoading: boolean
  profissionaisError: string | null
  saving: boolean
  deactivatingId: number | null
  mutationError: string | null
  mutationSuccess: string | null
}

export type ProcedimentosAction =
  | { type: typeof PROCEDIMENTOS_REQUEST }
  | { type: typeof PROCEDIMENTOS_SUCCESS; payload: Procedimento[] }
  | { type: typeof PROCEDIMENTOS_FAILURE; payload: string }
  | { type: typeof PROFISSIONAIS_PROCEDIMENTOS_REQUEST }
  | { type: typeof PROFISSIONAIS_PROCEDIMENTOS_SUCCESS; payload: Record<number, Dentista[]> }
  | { type: typeof PROFISSIONAIS_PROCEDIMENTOS_FAILURE; payload: string }
  | { type: typeof SALVAR_PROCEDIMENTO_REQUEST }
  | { type: typeof CRIAR_PROCEDIMENTO_SUCCESS; payload: Procedimento }
  | { type: typeof EDITAR_PROCEDIMENTO_SUCCESS; payload: Procedimento }
  | { type: typeof SALVAR_PROCEDIMENTO_FAILURE; payload: string }
  | { type: typeof DESATIVAR_PROCEDIMENTO_REQUEST; payload: number }
  | { type: typeof DESATIVAR_PROCEDIMENTO_SUCCESS; payload: { id: number; message: string } }
  | { type: typeof DESATIVAR_PROCEDIMENTO_FAILURE; payload: string }
  | { type: typeof PROCEDIMENTO_MUTATION_RESET }
