import type { HorariosResponse } from '../../types'
import { api, getApiError } from '../../services/api'
import type { AppThunk } from '../store'
import { HORARIOS_CLEAR, HORARIOS_FAILURE, HORARIOS_REQUEST, HORARIOS_SUCCESS } from '../types/horariosTypes'

export const fetchHorarios = (dentistaId: number, procedimentoId: number, data: string): AppThunk => async (dispatch) => {
  dispatch({ type: HORARIOS_REQUEST })
  try {
    const response = await api.get<HorariosResponse>('/horarios', {
      params: { dentista_id: dentistaId, procedimento_id: procedimentoId, data },
    })
    if (response.data.erro) throw new Error(response.data.erro)
    dispatch({ type: HORARIOS_SUCCESS, payload: response.data })
  } catch (error) {
    dispatch({ type: HORARIOS_FAILURE, payload: getApiError(error) })
  }
}

export const limparHorarios = () => ({ type: HORARIOS_CLEAR } as const)
