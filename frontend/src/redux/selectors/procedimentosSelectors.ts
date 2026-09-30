import type { RootState } from '../store'

export const selectProcedimentos = (state: RootState) => state.procedimentos.items
export const selectProcedimentosLoading = (state: RootState) => state.procedimentos.loading
export const selectProcedimentosError = (state: RootState) => state.procedimentos.error
