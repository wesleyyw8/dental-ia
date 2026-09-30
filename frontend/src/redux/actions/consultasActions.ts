import type { Consulta, CriarConsultaResponse, NovaConsulta } from '../../types'
import { api, getApiError } from '../../services/api'
import type { AppThunk } from '../store'
import {
  CONSULTAS_FAILURE, CONSULTAS_REQUEST, CONSULTAS_SUCCESS,
  CRIAR_CONSULTA_FAILURE, CRIAR_CONSULTA_REQUEST, CRIAR_CONSULTA_RESET, CRIAR_CONSULTA_SUCCESS,
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
