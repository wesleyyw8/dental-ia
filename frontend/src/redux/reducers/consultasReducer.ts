import type { ConsultasAction, ConsultasState } from '../types/consultasTypes'
import {
  CONSULTAS_FAILURE, CONSULTAS_REQUEST, CONSULTAS_SUCCESS,
  CANCELAR_CONSULTA_FAILURE, CANCELAR_CONSULTA_REQUEST, CANCELAR_CONSULTA_SUCCESS,
  CONSULTA_MUTATION_RESET,
  CRIAR_CONSULTA_FAILURE, CRIAR_CONSULTA_REQUEST, CRIAR_CONSULTA_RESET, CRIAR_CONSULTA_SUCCESS,
  REMARCAR_CONSULTA_FAILURE, REMARCAR_CONSULTA_REQUEST, REMARCAR_CONSULTA_SUCCESS,
} from '../types/consultasTypes'

const initialState: ConsultasState = {
  items: [], loading: false, error: null, creating: false, createError: null, created: null,
  cancelingId: null, cancelError: null, reschedulingId: null, rescheduleError: null, mutationSuccess: null,
}

export function consultasReducer(state = initialState, action: ConsultasAction): ConsultasState {
  switch (action.type) {
    case CONSULTAS_REQUEST: return { ...state, loading: true, error: null }
    case CONSULTAS_SUCCESS: return { ...state, loading: false, items: action.payload }
    case CONSULTAS_FAILURE: return { ...state, loading: false, error: action.payload }
    case CRIAR_CONSULTA_REQUEST: return { ...state, creating: true, createError: null, created: null }
    case CRIAR_CONSULTA_SUCCESS: return { ...state, creating: false, created: action.payload }
    case CRIAR_CONSULTA_FAILURE: return { ...state, creating: false, createError: action.payload }
    case CRIAR_CONSULTA_RESET: return { ...state, creating: false, createError: null, created: null }
    case CANCELAR_CONSULTA_REQUEST: return { ...state, cancelingId: action.payload, cancelError: null, mutationSuccess: null }
    case CANCELAR_CONSULTA_SUCCESS: return {
      ...state,
      cancelingId: null,
      mutationSuccess: action.payload.message,
      items: state.items.map((item) => item.id === action.payload.id ? { ...item, status: 'cancelada' } : item),
    }
    case CANCELAR_CONSULTA_FAILURE: return { ...state, cancelingId: null, cancelError: action.payload }
    case REMARCAR_CONSULTA_REQUEST: return { ...state, reschedulingId: action.payload, rescheduleError: null, mutationSuccess: null }
    case REMARCAR_CONSULTA_SUCCESS: return { ...state, reschedulingId: null, mutationSuccess: action.payload }
    case REMARCAR_CONSULTA_FAILURE: return { ...state, reschedulingId: null, rescheduleError: action.payload }
    case CONSULTA_MUTATION_RESET: return {
      ...state, cancelingId: null, cancelError: null, reschedulingId: null, rescheduleError: null, mutationSuccess: null,
    }
    default: return state
  }
}
