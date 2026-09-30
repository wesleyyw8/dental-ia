import type { RootState } from '../store'

export const selectDentistas = (state: RootState) => state.dentistas.items
export const selectDentistasLoading = (state: RootState) => state.dentistas.loading
export const selectDentistasError = (state: RootState) => state.dentistas.error
