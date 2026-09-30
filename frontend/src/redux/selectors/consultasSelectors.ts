import type { RootState } from '../store'

export const selectConsultas = (state: RootState) => state.consultas.items
export const selectConsultasLoading = (state: RootState) => state.consultas.loading
export const selectConsultasError = (state: RootState) => state.consultas.error
export const selectConsultaCreating = (state: RootState) => state.consultas.creating
export const selectConsultaCreateError = (state: RootState) => state.consultas.createError
export const selectConsultaCreated = (state: RootState) => state.consultas.created
