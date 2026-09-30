import type { Procedimento } from '../../types'
import { api, getApiError } from '../../services/api'
import type { AppThunk } from '../store'
import { PROCEDIMENTOS_FAILURE, PROCEDIMENTOS_REQUEST, PROCEDIMENTOS_SUCCESS } from '../types/procedimentosTypes'

export const fetchProcedimentos = (): AppThunk => async (dispatch) => {
  dispatch({ type: PROCEDIMENTOS_REQUEST })
  try {
    const { data } = await api.get<Procedimento[]>('/procedimentos')
    dispatch({ type: PROCEDIMENTOS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: PROCEDIMENTOS_FAILURE, payload: getApiError(error) })
  }
}
