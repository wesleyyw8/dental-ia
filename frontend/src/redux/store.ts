import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { consultasReducer } from './reducers/consultasReducer'
import { dentistasReducer } from './reducers/dentistasReducer'
import { horariosReducer } from './reducers/horariosReducer'
import { pacientesReducer } from './reducers/pacientesReducer'
import { procedimentosReducer } from './reducers/procedimentosReducer'

const rootReducer = combineReducers({
  pacientes: pacientesReducer,
  procedimentos: procedimentosReducer,
  dentistas: dentistasReducer,
  horarios: horariosReducer,
  consultas: consultasReducer,
})

export const store = configureStore({ reducer: rootReducer })

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>
