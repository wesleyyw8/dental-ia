import type { PacientesAction, PacientesState } from '../types/pacientesTypes'
import {
  PACIENTES_FAILURE, PACIENTES_REQUEST, PACIENTES_SUCCESS,
  PACIENTE_SEARCH_CLEAR, PACIENTE_SEARCH_FAILURE, PACIENTE_SEARCH_REQUEST, PACIENTE_SEARCH_SUCCESS,
} from '../types/pacientesTypes'

const initialState: PacientesState = { items: [], searchResult: null, loading: false, searching: false, error: null, searchError: null }

export function pacientesReducer(state = initialState, action: PacientesAction): PacientesState {
  switch (action.type) {
    case PACIENTES_REQUEST: return { ...state, loading: true, error: null }
    case PACIENTES_SUCCESS: return { ...state, loading: false, items: action.payload }
    case PACIENTES_FAILURE: return { ...state, loading: false, error: action.payload }
    case PACIENTE_SEARCH_REQUEST: return { ...state, searching: true, searchResult: null, searchError: null }
    case PACIENTE_SEARCH_SUCCESS: return { ...state, searching: false, searchResult: action.payload }
    case PACIENTE_SEARCH_FAILURE: return { ...state, searching: false, searchError: action.payload }
    case PACIENTE_SEARCH_CLEAR: return { ...state, searchResult: null, searchError: null }
    default: return state
  }
}
