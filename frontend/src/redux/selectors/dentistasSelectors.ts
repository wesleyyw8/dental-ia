import type { RootState } from '../store'

export const selectDentistas = (state: RootState) => state.dentistas.items
export const selectDentistasLoading = (state: RootState) => state.dentistas.loading
export const selectDentistasError = (state: RootState) => state.dentistas.error
export const selectDentistaSaving = (state: RootState) => state.dentistas.saving
export const selectDentistaDeactivatingId = (state: RootState) => state.dentistas.deactivatingId
export const selectDentistaMutationError = (state: RootState) => state.dentistas.mutationError
export const selectDentistaMutationSuccess = (state: RootState) => state.dentistas.mutationSuccess
