import type { RootState } from '../store'

const WEEKEND_ERROR = 'A clínica não realiza atendimentos aos finais de semana'

export const selectHorariosData = (state: RootState) => state.horarios.data
export const selectHorariosDisponiveis = (state: RootState) => state.horarios.data?.horarios_disponiveis ?? []
export const selectHorariosLoading = (state: RootState) => state.horarios.loading
export const selectHorariosError = (state: RootState) => state.horarios.error
export const selectHorariosWeekendError = (state: RootState) => state.horarios.error === WEEKEND_ERROR
