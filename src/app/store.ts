import { tasksSlice } from 'features/TodolistsList/tasks-reducer'
import { todolistsSlice } from 'features/TodolistsList/todolists-reducer'
import { combineReducers } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { appSlice } from './app-reducer'
import { authSlice } from 'features/Login/auth-reducer'
import { configureStore, UnknownAction } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  [appSlice.reducerPath]: appSlice.reducer,
  [tasksSlice.reducerPath]: tasksSlice.reducer,
  [todolistsSlice.reducerPath]: todolistsSlice.reducer,
  [authSlice.reducerPath]: authSlice.reducer,
})

// ❗старая запись, с новыми версиями не работает
//  const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({ reducer: rootReducer })

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
