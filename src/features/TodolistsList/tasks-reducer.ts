import {
  TaskPriorities,
  TaskStatuses,
  TaskEntity,
  todolistsAPI,
  UpdateTaskModel,
} from 'api/todolists-api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  addTodolist,
  removeTodolist,
  setTodolists,
} from 'features/TodolistsList/todolists-reducer'
import { AppRootState, AppThunk } from 'app/store'
import { setAppStatus } from 'app/app-reducer'
import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/error-utils'

export type UpdateDomainTaskModel = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

export type TasksState = {
  [key: string]: Array<TaskEntity>
}

const initialState: TasksState = {}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    removeTask(
      state,
      action: PayloadAction<{
        taskId: string
        todolistId: string
      }>
    ) {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter(
          (t) => t.id != action.payload.taskId
        ),
      }
    },
    addTask(state, action: PayloadAction<TaskEntity>) {
      return {
        ...state,
        [action.payload.todoListId]: [
          action.payload,
          ...state[action.payload.todoListId],
        ],
      }
    },
    updateTask(
      state,
      action: PayloadAction<{
        taskId: string
        model: UpdateDomainTaskModel
        todolistId: string
      }>
    ) {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map(
          (t) =>
            t.id === action.payload.taskId
              ? { ...t, ...action.payload.model }
              : t
        ),
      }
    },
    setTasks(
      state,
      action: PayloadAction<{
        tasks: Array<TaskEntity>
        todolistId: string
      }>
    ) {
      return { ...state, [action.payload.todolistId]: action.payload.tasks }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addTodolist, (state, action) => {
        return { ...state, [action.payload.id]: [] }
      })
      .addCase(removeTodolist, (state, action) => {
        const copyState = { ...state }
        delete copyState[action.payload]
        return copyState
      })
      .addCase(setTodolists, (state, action) => {
        const copyState = { ...state }
        action.payload.forEach((tl) => {
          copyState[tl.id] = []
        })
        return copyState
      })
  },
})

export const tasksReducer = tasksSlice.reducer

export const { removeTask, setTasks, updateTask, addTask } = tasksSlice.actions

export const fetchTasksTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistsAPI.getTasks(todolistId).then((res) => {
      const tasks = res.data.items
      dispatch(setTasks({ tasks: tasks, todolistId: todolistId }))
      dispatch(setAppStatus('succeeded'))
    })
  }

export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
  (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
      const action = removeTask({ taskId: taskId, todolistId: todolistId })
      dispatch(action)
    })
  }

export const addTaskTC =
  (title: string, todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistsAPI
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const task = res.data.data.item
          const action = addTask(task)
          dispatch(action)
          dispatch(setAppStatus('succeeded'))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }

export const updateTaskTC =
  (
    taskId: string,
    domainModel: UpdateDomainTaskModel,
    todolistId: string
  ): AppThunk =>
  (dispatch, getState: () => AppRootState) => {
    const state = getState()
    const task = state.tasks[todolistId].find((t) => t.id === taskId)
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn('task not found in the state')
      return
    }

    const apiModel: UpdateTaskModel = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    }

    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const action = updateTask({
            taskId: taskId,
            model: domainModel,
            todolistId: todolistId,
          })
          dispatch(action)
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
