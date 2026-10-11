import type { NovoPaciente, Paciente, PacienteMutationResponse } from '../../types'
import { api, getApiError } from '../../services/api'
import type { AppThunk } from '../store'
import {
  PACIENTES_FAILURE, PACIENTES_REQUEST, PACIENTES_SUCCESS,
  CRIAR_PACIENTE_FAILURE, CRIAR_PACIENTE_REQUEST, CRIAR_PACIENTE_RESET, CRIAR_PACIENTE_SUCCESS,
  EDITAR_PACIENTE_FAILURE, EDITAR_PACIENTE_REQUEST, EDITAR_PACIENTE_SUCCESS,
  EXCLUIR_PACIENTE_FAILURE, EXCLUIR_PACIENTE_REQUEST, EXCLUIR_PACIENTE_SUCCESS,
  PACIENTE_MUTATION_RESET,
  PACIENTE_SEARCH_CLEAR, PACIENTE_SEARCH_FAILURE, PACIENTE_SEARCH_REQUEST, PACIENTE_SEARCH_SUCCESS,
} from '../types/pacientesTypes'

export const fetchPacientes = (): AppThunk => async (dispatch) => {
  dispatch({ type: PACIENTES_REQUEST })
  try {
    const { data } = await api.get<Paciente[]>('/pacientes')
    dispatch({ type: PACIENTES_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: PACIENTES_FAILURE, payload: getApiError(error) })
  }
}

export const buscarPacientePorTelefone = (telefone: string): AppThunk => async (dispatch) => {
  dispatch({ type: PACIENTE_SEARCH_REQUEST })
  try {
    const { data } = await api.get<Paciente | null>('/pacientes', { params: { telefone } })
    if (!data) throw new Error('Nenhum paciente foi encontrado com esse telefone.')
    dispatch({ type: PACIENTE_SEARCH_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: PACIENTE_SEARCH_FAILURE, payload: getApiError(error) })
  }
}

export const limparBuscaPaciente = () => ({ type: PACIENTE_SEARCH_CLEAR } as const)

export const criarPaciente = (paciente: NovoPaciente): AppThunk<Promise<boolean>> => async (dispatch) => {
  dispatch({ type: CRIAR_PACIENTE_REQUEST })
  try {
    const { data } = await api.post<Paciente & { erro?: string }>('/pacientes', paciente)
    if (data.erro) throw new Error(data.erro)
    dispatch({ type: CRIAR_PACIENTE_SUCCESS, payload: data })
    dispatch(fetchPacientes())
    return true
  } catch (error) {
    dispatch({ type: CRIAR_PACIENTE_FAILURE, payload: getApiError(error) })
    return false
  }
}

export const resetCriarPaciente = () => ({ type: CRIAR_PACIENTE_RESET } as const)

export const editarPaciente = (pacienteId: number, paciente: NovoPaciente): AppThunk<Promise<boolean>> => async (dispatch) => {
  dispatch({ type: EDITAR_PACIENTE_REQUEST, payload: pacienteId })
  try {
    const { data } = await api.put<Paciente & { erro?: string }>(`/pacientes/${pacienteId}`, paciente)
    if (data.erro) throw new Error(data.erro)
    dispatch({ type: EDITAR_PACIENTE_SUCCESS, payload: data })
    dispatch(fetchPacientes())
    return true
  } catch (error) {
    dispatch({ type: EDITAR_PACIENTE_FAILURE, payload: getApiError(error) })
    return false
  }
}

export const excluirPaciente = (pacienteId: number, excluirConsultas = false): AppThunk<Promise<boolean>> => async (dispatch) => {
  dispatch({ type: EXCLUIR_PACIENTE_REQUEST, payload: pacienteId })
  try {
    const { data } = await api.delete<PacienteMutationResponse>(`/pacientes/${pacienteId}`, {
      params: { excluir_consultas: excluirConsultas },
    })
    if (data.erro) throw new Error(data.erro)
    dispatch({
      type: EXCLUIR_PACIENTE_SUCCESS,
      payload: { id: pacienteId, message: data.mensagem ?? 'Paciente excluído com sucesso.' },
    })
    dispatch(fetchPacientes())
    return true
  } catch (error) {
    dispatch({ type: EXCLUIR_PACIENTE_FAILURE, payload: getApiError(error) })
    return false
  }
}

export const resetPacienteMutation = () => ({ type: PACIENTE_MUTATION_RESET } as const)
