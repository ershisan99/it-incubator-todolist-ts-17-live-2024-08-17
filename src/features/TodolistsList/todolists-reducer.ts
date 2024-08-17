import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { todolistsAPI, TodolistType } from 'api/todolists-api'
import { RequestStatusType, setAppStatus } from 'app/app-reducer'
import { AppThunk } from 'app/store'
import { handleServerNetworkError } from 'utils/error-utils'

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

const initialState: Array<TodolistDomainType> = []

const todolistsSlice = createSlice({
  name: 'todolists',
  initialState,
  reducers: {
    removeTodolist(state, action: PayloadAction<string>) {
      return state.filter((tl) => tl.id != action.payload)
    },
    addTodolist(state, action: PayloadAction<TodolistType>) {
      return [
        { ...action.payload, filter: 'all', entityStatus: 'idle' },
        ...state,
      ]
    },
    changeTodolistTitle(
      state,
      action: PayloadAction<{
        id: string
        title: string
      }>
    ) {
      return state.map((tl) =>
        tl.id === action.payload.id
          ? { ...tl, title: action.payload.title }
          : tl
      )
    },
    changeTodolistFilter(
      state,
      action: PayloadAction<{
        id: string
        filter: FilterValuesType
      }>
    ) {
      return state.map((tl) =>
        tl.id === action.payload.id
          ? { ...tl, filter: action.payload.filter }
          : tl
      )
    },
    changeTodolistEntityStatus(
      state,
      action: PayloadAction<{
        id: string
        status: RequestStatusType
      }>
    ) {
      return state.map((tl) =>
        tl.id === action.payload.id
          ? { ...tl, entityStatus: action.payload.status }
          : tl
      )
    },
    setTodolists(state, action: PayloadAction<Array<TodolistType>>) {
      return action.payload.map((tl) => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle',
      }))
    },
  },
})

export const {
  changeTodolistEntityStatus,
  changeTodolistFilter,
  changeTodolistTitle,
  addTodolist,
  removeTodolist,
  setTodolists,
} = todolistsSlice.actions

export const todolistsReducer = todolistsSlice.reducer

export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(setTodolists(res.data))
        dispatch(setAppStatus('succeeded'))
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
  return (dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatus('loading'))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatus({ id: todolistId, status: 'loading' }))
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(removeTodolist(todolistId))
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(setAppStatus('succeeded'))
    })
  }
}
export const addTodolistTC = (title: string): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(addTodolist(res.data.data.item))
      dispatch(setAppStatus('succeeded'))
    })
  }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
  return (dispatch) => {
    todolistsAPI.updateTodolist(id, title).then((res) => {
      dispatch(changeTodolistTitle({ id: id, title: title }))
    })
  }
}
