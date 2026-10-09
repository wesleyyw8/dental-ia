import type { Dentista } from '../../types'

export const DENTISTAS_REQUEST = 'dentistas/request' as const
export const DENTISTAS_SUCCESS = 'dentistas/success' as const
export const DENTISTAS_FAILURE = 'dentistas/failure' as const
export const DENTISTAS_CLEAR = 'dentistas/clear' as const
export const SALVAR_DENTISTA_REQUEST = 'dentistas/saveRequest' as const
export const CRIAR_DENTISTA_SUCCESS = 'dentistas/createSuccess' as const
export const EDITAR_DENTISTA_SUCCESS = 'dentistas/updateSuccess' as const
export const SALVAR_DENTISTA_FAILURE = 'dentistas/saveFailure' as const
export const DESATIVAR_DENTISTA_REQUEST = 'dentistas/deactivateRequest' as const
export const DESATIVAR_DENTISTA_SUCCESS = 'dentistas/deactivateSuccess' as const
export const DESATIVAR_DENTISTA_FAILURE = 'dentistas/deactivateFailure' as const
export const DENTISTA_MUTATION_RESET = 'dentistas/mutationReset' as const

export interface DentistasState {
  items: Dentista[]
  loading: boolean
  error: string | null
  saving: boolean
  deactivatingId: number | null
  mutationError: string | null
  mutationSuccess: string | null
}

export type DentistasAction =
  | { type: typeof DENTISTAS_REQUEST }
  | { type: typeof DENTISTAS_SUCCESS; payload: Dentista[] }
  | { type: typeof DENTISTAS_FAILURE; payload: string }
  | { type: typeof DENTISTAS_CLEAR }
  | { type: typeof SALVAR_DENTISTA_REQUEST }
  | { type: typeof CRIAR_DENTISTA_SUCCESS; payload: Dentista }
  | { type: typeof EDITAR_DENTISTA_SUCCESS; payload: Dentista }
  | { type: typeof SALVAR_DENTISTA_FAILURE; payload: string }
  | { type: typeof DESATIVAR_DENTISTA_REQUEST; payload: number }
  | { type: typeof DESATIVAR_DENTISTA_SUCCESS; payload: { id: number; message: string } }
  | { type: typeof DESATIVAR_DENTISTA_FAILURE; payload: string }
  | { type: typeof DENTISTA_MUTATION_RESET }
