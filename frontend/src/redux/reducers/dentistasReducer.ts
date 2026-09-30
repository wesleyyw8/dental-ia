import type { DentistasAction, DentistasState } from '../types/dentistasTypes'
import { DENTISTAS_CLEAR, DENTISTAS_FAILURE, DENTISTAS_REQUEST, DENTISTAS_SUCCESS } from '../types/dentistasTypes'

const initialState: DentistasState = { items: [], loading: false, error: null }

export function dentistasReducer(state = initialState, action: DentistasAction): DentistasState {
  switch (action.type) {
    case DENTISTAS_REQUEST: return { ...state, loading: true, error: null }
    case DENTISTAS_SUCCESS: return { ...state, loading: false, items: action.payload }
    case DENTISTAS_FAILURE: return { ...state, loading: false, error: action.payload }
    case DENTISTAS_CLEAR: return initialState
    default: return state
  }
}
