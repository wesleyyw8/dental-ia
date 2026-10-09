import type { Dentista, DentistaInput, DentistaMutationResponse } from '../../types'
import { api, getApiError } from '../../services/api'
import type { AppThunk } from '../store'
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

export const fetchDentistas = (procedimentoId?: number): AppThunk => async (dispatch) => {
  dispatch({ type: DENTISTAS_REQUEST })
  try {
    const { data } = await api.get<Dentista[]>('/dentistas', {
      params: procedimentoId ? { procedimento_id: procedimentoId } : undefined,
    })
    dispatch({ type: DENTISTAS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: DENTISTAS_FAILURE, payload: getApiError(error) })
  }
}

export const criarDentista = (dentista: DentistaInput): AppThunk<Promise<boolean>> => async (dispatch) => {
  dispatch({ type: SALVAR_DENTISTA_REQUEST })
  try {
    const { data } = await api.post<Dentista | { erro: string }>('/dentistas', dentista)
    if ('erro' in data) throw new Error(data.erro)
    dispatch({ type: CRIAR_DENTISTA_SUCCESS, payload: data })
    dispatch(fetchDentistas())
    return true
  } catch (error) {
    dispatch({ type: SALVAR_DENTISTA_FAILURE, payload: getApiError(error) })
    return false
  }
}

export const editarDentista = (dentistaId: number, dentista: DentistaInput): AppThunk<Promise<boolean>> => async (dispatch) => {
  dispatch({ type: SALVAR_DENTISTA_REQUEST })
  try {
    const { data } = await api.put<Dentista | { erro: string }>(`/dentistas/${dentistaId}`, dentista)
    if ('erro' in data) throw new Error(data.erro)
    dispatch({ type: EDITAR_DENTISTA_SUCCESS, payload: data })
    dispatch(fetchDentistas())
    return true
  } catch (error) {
    dispatch({ type: SALVAR_DENTISTA_FAILURE, payload: getApiError(error) })
    return false
  }
}

export const desativarDentista = (dentistaId: number): AppThunk<Promise<boolean>> => async (dispatch) => {
  dispatch({ type: DESATIVAR_DENTISTA_REQUEST, payload: dentistaId })
  try {
    const { data } = await api.patch<DentistaMutationResponse>(`/dentistas/${dentistaId}/desativar`)
    if (data.erro) throw new Error(data.erro)
    dispatch({
      type: DESATIVAR_DENTISTA_SUCCESS,
      payload: { id: dentistaId, message: data.mensagem ?? 'Profissional desativado com sucesso.' },
    })
    dispatch(fetchDentistas())
    return true
  } catch (error) {
    dispatch({ type: DESATIVAR_DENTISTA_FAILURE, payload: getApiError(error) })
    return false
  }
}

export const limparDentistas = () => ({ type: DENTISTAS_CLEAR } as const)
export const resetDentistaMutation = () => ({ type: DENTISTA_MUTATION_RESET } as const)
