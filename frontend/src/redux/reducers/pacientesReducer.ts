import type { PacientesAction, PacientesState } from '../types/pacientesTypes'
import {
  PACIENTES_FAILURE, PACIENTES_REQUEST, PACIENTES_SUCCESS,
  CRIAR_PACIENTE_FAILURE, CRIAR_PACIENTE_REQUEST, CRIAR_PACIENTE_RESET, CRIAR_PACIENTE_SUCCESS,
  PACIENTE_SEARCH_CLEAR, PACIENTE_SEARCH_FAILURE, PACIENTE_SEARCH_REQUEST, PACIENTE_SEARCH_SUCCESS,
} from '../types/pacientesTypes'

const initialState: PacientesState = {
  items: [], searchResult: null, loading: false, searching: false,
  error: null, searchError: null, creating: false, createError: null, created: null,
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
    default: return state
  }
}
