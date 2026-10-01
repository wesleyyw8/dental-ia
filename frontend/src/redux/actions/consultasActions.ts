import type { Consulta, ConsultaMutationResponse, CriarConsultaResponse, NovaConsulta } from '../../types'
import { api, getApiError } from '../../services/api'
import type { AppThunk } from '../store'
import {
  CONSULTAS_FAILURE, CONSULTAS_REQUEST, CONSULTAS_SUCCESS,
  CANCELAR_CONSULTA_FAILURE, CANCELAR_CONSULTA_REQUEST, CANCELAR_CONSULTA_SUCCESS,
  CONSULTA_MUTATION_RESET,
  CRIAR_CONSULTA_FAILURE, CRIAR_CONSULTA_REQUEST, CRIAR_CONSULTA_RESET, CRIAR_CONSULTA_SUCCESS,
  REMARCAR_CONSULTA_FAILURE, REMARCAR_CONSULTA_REQUEST, REMARCAR_CONSULTA_SUCCESS,
} from '../types/consultasTypes'

export const fetchConsultas = (): AppThunk => async (dispatch) => {
  dispatch({ type: CONSULTAS_REQUEST })
  try {
    const { data } = await api.get<Consulta[]>('/consultas')
    dispatch({ type: CONSULTAS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: CONSULTAS_FAILURE, payload: getApiError(error) })
  }
}

export const criarConsulta = (consulta: NovaConsulta): AppThunk<Promise<boolean>> => async (dispatch) => {
  dispatch({ type: CRIAR_CONSULTA_REQUEST })
  try {
    const { data } = await api.post<CriarConsultaResponse>('/consultas', consulta)
    if (data.erro) throw new Error(data.erro)
    dispatch({ type: CRIAR_CONSULTA_SUCCESS, payload: data })
    dispatch(fetchConsultas())
    return true
  } catch (error) {
    dispatch({ type: CRIAR_CONSULTA_FAILURE, payload: getApiError(error) })
    return false
  }
}

export const resetCriarConsulta = () => ({ type: CRIAR_CONSULTA_RESET } as const)

export const cancelarConsulta = (consultaId: number): AppThunk<Promise<boolean>> => async (dispatch) => {
  dispatch({ type: CANCELAR_CONSULTA_REQUEST, payload: consultaId })
  try {
    const { data } = await api.patch<ConsultaMutationResponse>(`/consultas/${consultaId}/cancelar`)
    if (data.erro) throw new Error(data.erro)
    dispatch({
      type: CANCELAR_CONSULTA_SUCCESS,
      payload: { id: consultaId, message: data.mensagem ?? 'Consulta cancelada com sucesso.' },
    })
    dispatch(fetchConsultas())
    return true
  } catch (error) {
    dispatch({ type: CANCELAR_CONSULTA_FAILURE, payload: getApiError(error) })
    return false
  }
}

export const remarcarConsulta = (consultaId: number, data: string, horario: string): AppThunk<Promise<boolean>> => async (dispatch) => {
  dispatch({ type: REMARCAR_CONSULTA_REQUEST, payload: consultaId })
  try {
    const response = await api.patch<ConsultaMutationResponse>(`/consultas/${consultaId}/remarcar`, undefined, {
      params: { data, horario },
    })
    if (response.data.erro) throw new Error(response.data.erro)
    dispatch({ type: REMARCAR_CONSULTA_SUCCESS, payload: 'Consulta remarcada com sucesso.' })
    dispatch(fetchConsultas())
    return true
  } catch (error) {
    dispatch({ type: REMARCAR_CONSULTA_FAILURE, payload: getApiError(error) })
    return false
  }
}

export const resetConsultaMutation = () => ({ type: CONSULTA_MUTATION_RESET } as const)
