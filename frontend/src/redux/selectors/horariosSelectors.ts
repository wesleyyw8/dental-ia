import type { RootState } from '../store'

export const selectHorariosData = (state: RootState) => state.horarios.data
export const selectHorariosDisponiveis = (state: RootState) => state.horarios.data?.horarios_disponiveis ?? []
export const selectHorariosLoading = (state: RootState) => state.horarios.loading
export const selectHorariosError = (state: RootState) => state.horarios.error
