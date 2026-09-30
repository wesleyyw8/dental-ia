import type { ConsultasAction, ConsultasState } from '../types/consultasTypes'
import {
  CONSULTAS_FAILURE, CONSULTAS_REQUEST, CONSULTAS_SUCCESS,
  CRIAR_CONSULTA_FAILURE, CRIAR_CONSULTA_REQUEST, CRIAR_CONSULTA_RESET, CRIAR_CONSULTA_SUCCESS,
} from '../types/consultasTypes'

const initialState: ConsultasState = { items: [], loading: false, error: null, creating: false, createError: null, created: null }

export function consultasReducer(state = initialState, action: ConsultasAction): ConsultasState {
  switch (action.type) {
    case CONSULTAS_REQUEST: return { ...state, loading: true, error: null }
    case CONSULTAS_SUCCESS: return { ...state, loading: false, items: action.payload }
    case CONSULTAS_FAILURE: return { ...state, loading: false, error: action.payload }
    case CRIAR_CONSULTA_REQUEST: return { ...state, creating: true, createError: null, created: null }
    case CRIAR_CONSULTA_SUCCESS: return { ...state, creating: false, created: action.payload }
    case CRIAR_CONSULTA_FAILURE: return { ...state, creating: false, createError: action.payload }
    case CRIAR_CONSULTA_RESET: return { ...state, creating: false, createError: null, created: null }
    default: return state
  }
}
