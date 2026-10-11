import type { Paciente } from '../../types'

export const PACIENTES_REQUEST = 'pacientes/request' as const
export const PACIENTES_SUCCESS = 'pacientes/success' as const
export const PACIENTES_FAILURE = 'pacientes/failure' as const
export const PACIENTE_SEARCH_REQUEST = 'pacientes/searchRequest' as const
export const PACIENTE_SEARCH_SUCCESS = 'pacientes/searchSuccess' as const
export const PACIENTE_SEARCH_FAILURE = 'pacientes/searchFailure' as const
export const PACIENTE_SEARCH_CLEAR = 'pacientes/searchClear' as const
export const CRIAR_PACIENTE_REQUEST = 'pacientes/createRequest' as const
export const CRIAR_PACIENTE_SUCCESS = 'pacientes/createSuccess' as const
export const CRIAR_PACIENTE_FAILURE = 'pacientes/createFailure' as const
export const CRIAR_PACIENTE_RESET = 'pacientes/createReset' as const
export const EDITAR_PACIENTE_REQUEST = 'pacientes/updateRequest' as const
export const EDITAR_PACIENTE_SUCCESS = 'pacientes/updateSuccess' as const
export const EDITAR_PACIENTE_FAILURE = 'pacientes/updateFailure' as const
export const EXCLUIR_PACIENTE_REQUEST = 'pacientes/deleteRequest' as const
export const EXCLUIR_PACIENTE_SUCCESS = 'pacientes/deleteSuccess' as const
export const EXCLUIR_PACIENTE_FAILURE = 'pacientes/deleteFailure' as const
export const PACIENTE_MUTATION_RESET = 'pacientes/mutationReset' as const

export interface PacientesState {
  items: Paciente[]
  searchResult: Paciente | null
  loading: boolean
  searching: boolean
  error: string | null
  searchError: string | null
  creating: boolean
  createError: string | null
  created: Paciente | null
  updatingId: number | null
  deletingId: number | null
  mutationError: string | null
  mutationSuccess: string | null
}

export type PacientesAction =
  | { type: typeof PACIENTES_REQUEST }
  | { type: typeof PACIENTES_SUCCESS; payload: Paciente[] }
  | { type: typeof PACIENTES_FAILURE; payload: string }
  | { type: typeof PACIENTE_SEARCH_REQUEST }
  | { type: typeof PACIENTE_SEARCH_SUCCESS; payload: Paciente }
  | { type: typeof PACIENTE_SEARCH_FAILURE; payload: string }
  | { type: typeof PACIENTE_SEARCH_CLEAR }
  | { type: typeof CRIAR_PACIENTE_REQUEST }
  | { type: typeof CRIAR_PACIENTE_SUCCESS; payload: Paciente }
  | { type: typeof CRIAR_PACIENTE_FAILURE; payload: string }
  | { type: typeof CRIAR_PACIENTE_RESET }
  | { type: typeof EDITAR_PACIENTE_REQUEST; payload: number }
  | { type: typeof EDITAR_PACIENTE_SUCCESS; payload: Paciente }
  | { type: typeof EDITAR_PACIENTE_FAILURE; payload: string }
  | { type: typeof EXCLUIR_PACIENTE_REQUEST; payload: number }
  | { type: typeof EXCLUIR_PACIENTE_SUCCESS; payload: { id: number; message: string } }
  | { type: typeof EXCLUIR_PACIENTE_FAILURE; payload: string }
  | { type: typeof PACIENTE_MUTATION_RESET }
