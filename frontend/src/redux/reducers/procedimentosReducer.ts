import type { ProcedimentosAction, ProcedimentosState } from '../types/procedimentosTypes'
import { PROCEDIMENTOS_FAILURE, PROCEDIMENTOS_REQUEST, PROCEDIMENTOS_SUCCESS } from '../types/procedimentosTypes'

const initialState: ProcedimentosState = { items: [], loading: false, error: null }

export function procedimentosReducer(state = initialState, action: ProcedimentosAction): ProcedimentosState {
  switch (action.type) {
    case PROCEDIMENTOS_REQUEST: return { ...state, loading: true, error: null }
    case PROCEDIMENTOS_SUCCESS: return { ...state, loading: false, items: action.payload }
    case PROCEDIMENTOS_FAILURE: return { ...state, loading: false, error: action.payload }
    default: return state
  }
}
