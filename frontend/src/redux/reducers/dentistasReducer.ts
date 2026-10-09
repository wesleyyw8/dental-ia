import type { DentistasAction, DentistasState } from '../types/dentistasTypes'
import {
  CRIAR_DENTISTA_SUCCESS,
  DENTISTAS_CLEAR,
  DENTISTAS_FAILURE,
  DENTISTAS_REQUEST,
  DENTISTAS_SUCCESS,
  DENTISTA_MUTATION_RESET,
  DESATIVAR_DENTISTA_FAILURE,
  DESATIVAR_DENTISTA_REQUEST,
  DESATIVAR_DENTISTA_SUCCESS,
  EDITAR_DENTISTA_SUCCESS,
  SALVAR_DENTISTA_FAILURE,
  SALVAR_DENTISTA_REQUEST,
} from '../types/dentistasTypes'

const initialState: DentistasState = {
  items: [], loading: false, error: null, saving: false,
  deactivatingId: null, mutationError: null, mutationSuccess: null,
}

export function dentistasReducer(state = initialState, action: DentistasAction): DentistasState {
  switch (action.type) {
    case DENTISTAS_REQUEST: return { ...state, loading: true, error: null }
    case DENTISTAS_SUCCESS: return { ...state, loading: false, items: action.payload }
    case DENTISTAS_FAILURE: return { ...state, loading: false, error: action.payload }
    case DENTISTAS_CLEAR: return initialState
    case SALVAR_DENTISTA_REQUEST: return { ...state, saving: true, mutationError: null, mutationSuccess: null }
    case CRIAR_DENTISTA_SUCCESS: return {
      ...state, saving: false, items: [...state.items, action.payload], mutationSuccess: 'Profissional cadastrado com sucesso.',
    }
    case EDITAR_DENTISTA_SUCCESS: return {
      ...state, saving: false,
      items: state.items.map((item) => item.id === action.payload.id ? action.payload : item),
      mutationSuccess: 'Profissional atualizado com sucesso.',
    }
    case SALVAR_DENTISTA_FAILURE: return { ...state, saving: false, mutationError: action.payload }
    case DESATIVAR_DENTISTA_REQUEST: return { ...state, deactivatingId: action.payload, mutationError: null, mutationSuccess: null }
    case DESATIVAR_DENTISTA_SUCCESS: return {
      ...state, deactivatingId: null,
      items: state.items.filter((item) => item.id !== action.payload.id),
      mutationSuccess: action.payload.message,
    }
    case DESATIVAR_DENTISTA_FAILURE: return { ...state, deactivatingId: null, mutationError: action.payload }
    case DENTISTA_MUTATION_RESET: return { ...state, saving: false, deactivatingId: null, mutationError: null, mutationSuccess: null }
    default: return state
  }
}
