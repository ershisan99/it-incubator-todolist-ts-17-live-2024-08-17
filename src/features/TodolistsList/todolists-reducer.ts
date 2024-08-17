import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { todolistsAPI, Todolist } from 'api/todolists-api'
import { RequestStatus, setAppStatus } from 'app/app-reducer'
import { AppThunk } from 'app/store'
import { handleServerNetworkError } from 'utils/error-utils'

export type FilterValues = 'all' | 'active' | 'completed'
export type TodolistDomain = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

const initialState: Array<TodolistDomain> = []

const todolistsSlice = createSlice({
  name: 'todolists',
  initialState,
  reducers: {
    removeTodolist(state, action: PayloadAction<string>) {
      const index = state.findIndex((todo) => todo.id === action.payload)
      if (index !== -1) state.splice(index, 1)
    },
    addTodolist(state, action: PayloadAction<Todolist>) {
      state.unshift({ ...action.payload, filter: 'all', entityStatus: 'idle' })
    },
    changeTodolistTitle(
      state,
      action: PayloadAction<{
        id: string
        title: string
      }>
    ) {
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state[index].title = action.payload.title
    },
    changeTodolistFilter(
      state,
      action: PayloadAction<{
        id: string
        filter: FilterValues
      }>
    ) {
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus(
      state,
      action: PayloadAction<{
        id: string
        status: RequestStatus
      }>
    ) {
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) state[index].entityStatus = action.payload.status
    },
    setTodolists(_state, action: PayloadAction<Array<Todolist>>) {
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
