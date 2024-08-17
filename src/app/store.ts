import { tasksSlice } from 'features/TodolistsList/tasks-reducer'
import { todolistsSlice } from 'features/TodolistsList/todolists-reducer'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { appSlice } from './app-reducer'
import { authSlice } from 'features/Login/auth-reducer'
import { combineSlices, configureStore, UnknownAction } from '@reduxjs/toolkit'

const rootReducer = combineSlices(
  appSlice,
  authSlice,
  todolistsSlice,
  tasksSlice
)

// ❗старая запись, с новыми версиями не работает
//  const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({
  reducer: rootReducer,
})

export type AppRootState = ReturnType<typeof rootReducer>

// ❗ UnknownAction вместо AnyAction
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootState,
  unknown,
  UnknownAction
>

// export type AppDispatch = typeof store.dispatch
// ❗ UnknownAction вместо AnyAction
export type AppDispatch = ThunkDispatch<AppRootState, unknown, UnknownAction>
