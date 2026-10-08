import type { Dentista, Procedimento, ProcedimentoInput, ProcedimentoMutationResponse } from '../../types'
import { api, getApiError } from '../../services/api'
import type { AppThunk } from '../store'
import {
  CRIAR_PROCEDIMENTO_SUCCESS,
  DESATIVAR_PROCEDIMENTO_FAILURE,
  DESATIVAR_PROCEDIMENTO_REQUEST,
  DESATIVAR_PROCEDIMENTO_SUCCESS,
  EDITAR_PROCEDIMENTO_SUCCESS,
  PROFISSIONAIS_PROCEDIMENTOS_FAILURE,
  PROFISSIONAIS_PROCEDIMENTOS_REQUEST,
  PROFISSIONAIS_PROCEDIMENTOS_SUCCESS,
  PROCEDIMENTO_MUTATION_RESET,
  PROCEDIMENTOS_FAILURE,
  PROCEDIMENTOS_REQUEST,
  PROCEDIMENTOS_SUCCESS,
  SALVAR_PROCEDIMENTO_FAILURE,
  SALVAR_PROCEDIMENTO_REQUEST,
} from '../types/procedimentosTypes'

export const fetchProcedimentos = (): AppThunk => async (dispatch) => {
  dispatch({ type: PROCEDIMENTOS_REQUEST })
  try {
    const { data } = await api.get<Procedimento[]>('/procedimentos')
    dispatch({ type: PROCEDIMENTOS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: PROCEDIMENTOS_FAILURE, payload: getApiError(error) })
  }
}

export const fetchProfissionaisPorProcedimento = (procedimentoIds: number[]): AppThunk => async (dispatch) => {
  dispatch({ type: PROFISSIONAIS_PROCEDIMENTOS_REQUEST })
  try {
    const profissionais = await Promise.all(procedimentoIds.map(async (procedimentoId) => {
      const { data } = await api.get<Dentista[]>('/dentistas', {
        params: { procedimento_id: procedimentoId },
      })
      return [procedimentoId, data] as const
    }))
    dispatch({
      type: PROFISSIONAIS_PROCEDIMENTOS_SUCCESS,
      payload: Object.fromEntries(profissionais),
    })
  } catch (error) {
    dispatch({ type: PROFISSIONAIS_PROCEDIMENTOS_FAILURE, payload: getApiError(error) })
  }
}

export const criarProcedimento = (procedimento: ProcedimentoInput): AppThunk<Promise<boolean>> => async (dispatch) => {
  dispatch({ type: SALVAR_PROCEDIMENTO_REQUEST })
  try {
    const { data } = await api.post<Procedimento | { erro: string }>('/procedimentos', procedimento)
    if ('erro' in data) throw new Error(data.erro)
    dispatch({ type: CRIAR_PROCEDIMENTO_SUCCESS, payload: data })
    dispatch(fetchProcedimentos())
    return true
  } catch (error) {
    dispatch({ type: SALVAR_PROCEDIMENTO_FAILURE, payload: getApiError(error) })
    return false
  }
}

export const editarProcedimento = (procedimentoId: number, procedimento: ProcedimentoInput): AppThunk<Promise<boolean>> => async (dispatch) => {
  dispatch({ type: SALVAR_PROCEDIMENTO_REQUEST })
  try {
    const { data } = await api.put<Procedimento | { erro: string }>(`/procedimentos/${procedimentoId}`, procedimento)
    if ('erro' in data) throw new Error(data.erro)
    dispatch({ type: EDITAR_PROCEDIMENTO_SUCCESS, payload: data })
    dispatch(fetchProcedimentos())
    return true
  } catch (error) {
    dispatch({ type: SALVAR_PROCEDIMENTO_FAILURE, payload: getApiError(error) })
    return false
  }
}

export const desativarProcedimento = (procedimentoId: number): AppThunk<Promise<boolean>> => async (dispatch) => {
  dispatch({ type: DESATIVAR_PROCEDIMENTO_REQUEST, payload: procedimentoId })
  try {
    const { data } = await api.patch<ProcedimentoMutationResponse>(`/procedimentos/${procedimentoId}/desativar`)
    if (data.erro) throw new Error(data.erro)
    dispatch({
      type: DESATIVAR_PROCEDIMENTO_SUCCESS,
      payload: { id: procedimentoId, message: data.mensagem ?? 'Procedimento desativado com sucesso.' },
    })
    dispatch(fetchProcedimentos())
    return true
  } catch (error) {
    dispatch({ type: DESATIVAR_PROCEDIMENTO_FAILURE, payload: getApiError(error) })
    return false
  }
}

export const resetProcedimentoMutation = () => ({ type: PROCEDIMENTO_MUTATION_RESET } as const)
