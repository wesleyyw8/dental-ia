import type { HorariosAction, HorariosState } from '../types/horariosTypes'
import { HORARIOS_CLEAR, HORARIOS_FAILURE, HORARIOS_REQUEST, HORARIOS_SUCCESS } from '../types/horariosTypes'

const initialState: HorariosState = { data: null, loading: false, error: null }

export function horariosReducer(state = initialState, action: HorariosAction): HorariosState {
  switch (action.type) {
    case HORARIOS_REQUEST: return { data: null, loading: true, error: null }
    case HORARIOS_SUCCESS: return { data: action.payload, loading: false, error: null }
    case HORARIOS_FAILURE: return { data: null, loading: false, error: action.payload }
    case HORARIOS_CLEAR: return initialState
    default: return state
  }
}
