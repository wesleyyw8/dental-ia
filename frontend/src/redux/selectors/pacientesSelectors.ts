import type { RootState } from '../store'

export const selectPacientes = (state: RootState) => state.pacientes.items
export const selectPacientesLoading = (state: RootState) => state.pacientes.loading
export const selectPacientesError = (state: RootState) => state.pacientes.error
export const selectPacienteSearchResult = (state: RootState) => state.pacientes.searchResult
export const selectPacienteSearching = (state: RootState) => state.pacientes.searching
export const selectPacienteSearchError = (state: RootState) => state.pacientes.searchError
