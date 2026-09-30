import type { Dentista } from '../../types'
import { api, getApiError } from '../../services/api'
import type { AppThunk } from '../store'
import { DENTISTAS_CLEAR, DENTISTAS_FAILURE, DENTISTAS_REQUEST, DENTISTAS_SUCCESS } from '../types/dentistasTypes'

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

export const limparDentistas = () => ({ type: DENTISTAS_CLEAR } as const)
