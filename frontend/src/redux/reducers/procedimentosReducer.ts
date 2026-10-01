import type { ProcedimentosAction, ProcedimentosState } from '../types/procedimentosTypes'
import {
  CRIAR_PROCEDIMENTO_SUCCESS,
  DESATIVAR_PROCEDIMENTO_FAILURE,
  DESATIVAR_PROCEDIMENTO_REQUEST,
  DESATIVAR_PROCEDIMENTO_SUCCESS,
  EDITAR_PROCEDIMENTO_SUCCESS,
  PROCEDIMENTO_MUTATION_RESET,
  PROCEDIMENTOS_FAILURE,
  PROCEDIMENTOS_REQUEST,
  PROCEDIMENTOS_SUCCESS,
  SALVAR_PROCEDIMENTO_FAILURE,
  SALVAR_PROCEDIMENTO_REQUEST,
} from '../types/procedimentosTypes'

const initialState: ProcedimentosState = {
  items: [], loading: false, error: null, saving: false,
  deactivatingId: null, mutationError: null, mutationSuccess: null,
}

export function procedimentosReducer(state = initialState, action: ProcedimentosAction): ProcedimentosState {
  switch (action.type) {
    case PROCEDIMENTOS_REQUEST: return { ...state, loading: true, error: null }
    case PROCEDIMENTOS_SUCCESS: return { ...state, loading: false, items: action.payload }
    case PROCEDIMENTOS_FAILURE: return { ...state, loading: false, error: action.payload }
    case SALVAR_PROCEDIMENTO_REQUEST: return { ...state, saving: true, mutationError: null, mutationSuccess: null }
    case CRIAR_PROCEDIMENTO_SUCCESS: return {
      ...state, saving: false, items: [...state.items, action.payload], mutationSuccess: 'Procedimento cadastrado com sucesso.',
    }
    case EDITAR_PROCEDIMENTO_SUCCESS: return {
      ...state, saving: false,
      items: state.items.map((item) => item.id === action.payload.id ? action.payload : item),
      mutationSuccess: 'Procedimento atualizado com sucesso.',
    }
    case SALVAR_PROCEDIMENTO_FAILURE: return { ...state, saving: false, mutationError: action.payload }
    case DESATIVAR_PROCEDIMENTO_REQUEST: return { ...state, deactivatingId: action.payload, mutationError: null, mutationSuccess: null }
    case DESATIVAR_PROCEDIMENTO_SUCCESS: return {
      ...state, deactivatingId: null,
      items: state.items.filter((item) => item.id !== action.payload.id),
      mutationSuccess: action.payload.message,
    }
    case DESATIVAR_PROCEDIMENTO_FAILURE: return { ...state, deactivatingId: null, mutationError: action.payload }
    case PROCEDIMENTO_MUTATION_RESET: return { ...state, saving: false, deactivatingId: null, mutationError: null, mutationSuccess: null }
    default: return state
  }
}
