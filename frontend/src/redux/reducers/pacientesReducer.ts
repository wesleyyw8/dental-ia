import type { PacientesAction, PacientesState } from '../types/pacientesTypes'
import {
  PACIENTES_FAILURE, PACIENTES_REQUEST, PACIENTES_SUCCESS,
  CRIAR_PACIENTE_FAILURE, CRIAR_PACIENTE_REQUEST, CRIAR_PACIENTE_RESET, CRIAR_PACIENTE_SUCCESS,
  EDITAR_PACIENTE_FAILURE, EDITAR_PACIENTE_REQUEST, EDITAR_PACIENTE_SUCCESS,
  EXCLUIR_PACIENTE_FAILURE, EXCLUIR_PACIENTE_REQUEST, EXCLUIR_PACIENTE_SUCCESS,
  PACIENTE_MUTATION_RESET,
  PACIENTE_SEARCH_CLEAR, PACIENTE_SEARCH_FAILURE, PACIENTE_SEARCH_REQUEST, PACIENTE_SEARCH_SUCCESS,
} from '../types/pacientesTypes'

const initialState: PacientesState = {
  items: [], searchResult: null, loading: false, searching: false,
  error: null, searchError: null, creating: false, createError: null, created: null,
  updatingId: null, deletingId: null, mutationError: null, mutationSuccess: null,
}

export function pacientesReducer(state = initialState, action: PacientesAction): PacientesState {
  switch (action.type) {
    case PACIENTES_REQUEST: return { ...state, loading: true, error: null }
    case PACIENTES_SUCCESS: return { ...state, loading: false, items: action.payload }
    case PACIENTES_FAILURE: return { ...state, loading: false, error: action.payload }
    case PACIENTE_SEARCH_REQUEST: return { ...state, searching: true, searchResult: null, searchError: null }
    case PACIENTE_SEARCH_SUCCESS: return { ...state, searching: false, searchResult: action.payload }
    case PACIENTE_SEARCH_FAILURE: return { ...state, searching: false, searchError: action.payload }
    case PACIENTE_SEARCH_CLEAR: return { ...state, searchResult: null, searchError: null }
    case CRIAR_PACIENTE_REQUEST: return { ...state, creating: true, createError: null, created: null }
    case CRIAR_PACIENTE_SUCCESS: return { ...state, creating: false, created: action.payload }
    case CRIAR_PACIENTE_FAILURE: return { ...state, creating: false, createError: action.payload }
    case CRIAR_PACIENTE_RESET: return { ...state, creating: false, createError: null, created: null }
    case EDITAR_PACIENTE_REQUEST: return { ...state, updatingId: action.payload, mutationError: null, mutationSuccess: null }
    case EDITAR_PACIENTE_SUCCESS: return {
      ...state, updatingId: null,
      items: state.items.map((item) => item.id === action.payload.id ? action.payload : item),
      searchResult: state.searchResult?.id === action.payload.id ? action.payload : state.searchResult,
      mutationSuccess: 'Paciente atualizado com sucesso.',
    }
    case EDITAR_PACIENTE_FAILURE: return { ...state, updatingId: null, mutationError: action.payload }
    case EXCLUIR_PACIENTE_REQUEST: return { ...state, deletingId: action.payload, mutationError: null, mutationSuccess: null }
    case EXCLUIR_PACIENTE_SUCCESS: return {
      ...state, deletingId: null,
      items: state.items.filter((item) => item.id !== action.payload.id),
      searchResult: state.searchResult?.id === action.payload.id ? null : state.searchResult,
      mutationSuccess: action.payload.message,
    }
    case EXCLUIR_PACIENTE_FAILURE: return { ...state, deletingId: null, mutationError: action.payload }
    case PACIENTE_MUTATION_RESET: return { ...state, updatingId: null, deletingId: null, mutationError: null, mutationSuccess: null }
    default: return state
  }
}
