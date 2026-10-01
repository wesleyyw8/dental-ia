import type { RootState } from '../store'

export const selectProcedimentos = (state: RootState) => state.procedimentos.items
export const selectProcedimentosLoading = (state: RootState) => state.procedimentos.loading
export const selectProcedimentosError = (state: RootState) => state.procedimentos.error
export const selectProcedimentoSaving = (state: RootState) => state.procedimentos.saving
export const selectProcedimentoDeactivatingId = (state: RootState) => state.procedimentos.deactivatingId
export const selectProcedimentoMutationError = (state: RootState) => state.procedimentos.mutationError
export const selectProcedimentoMutationSuccess = (state: RootState) => state.procedimentos.mutationSuccess
