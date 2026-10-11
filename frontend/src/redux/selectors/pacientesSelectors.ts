import type { RootState } from '../store'

export const selectPacientes = (state: RootState) => state.pacientes.items
export const selectPacientesLoading = (state: RootState) => state.pacientes.loading
export const selectPacientesError = (state: RootState) => state.pacientes.error
export const selectPacienteSearchResult = (state: RootState) => state.pacientes.searchResult
export const selectPacienteSearching = (state: RootState) => state.pacientes.searching
export const selectPacienteSearchError = (state: RootState) => state.pacientes.searchError
export const selectPacienteCreating = (state: RootState) => state.pacientes.creating
export const selectPacienteCreateError = (state: RootState) => state.pacientes.createError
export const selectPacienteCreated = (state: RootState) => state.pacientes.created
export const selectPacienteUpdatingId = (state: RootState) => state.pacientes.updatingId
export const selectPacienteDeletingId = (state: RootState) => state.pacientes.deletingId
export const selectPacienteMutationError = (state: RootState) => state.pacientes.mutationError
export const selectPacienteMutationSuccess = (state: RootState) => state.pacientes.mutationSuccess
