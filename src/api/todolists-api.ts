import axios from 'axios'

const settings = {
  withCredentials: true,
  headers: {
    'API-KEY': '1cdd9f77-c60e-4af5-b194-659e4ebd5d41',
  },
}
const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  ...settings,
})

// api
export const todolistsAPI = {
  getTodolists() {
    const promise = instance.get<Todolist[]>('todo-lists')
    return promise
  },
  createTodolist(title: string) {
    const promise = instance.post<Response<{ item: Todolist }>>('todo-lists', {
      title: title,
    })
    return promise
  },
  deleteTodolist(id: string) {
    const promise = instance.delete<Response>(`todo-lists/${id}`)
    return promise
  },
  updateTodolist(id: string, title: string) {
    const promise = instance.put<Response>(`todo-lists/${id}`, {
      title: title,
    })
    return promise
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<Response>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  createTask(todolistId: string, taskTitile: string) {
    return instance.post<Response<{ item: TaskEntity }>>(
      `todo-lists/${todolistId}/tasks`,
      { title: taskTitile }
    )
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModel) {
    return instance.put<Response<TaskEntity>>(
      `todo-lists/${todolistId}/tasks/${taskId}`,
      model
    )
  },
}

export type LoginParams = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}

export const authAPI = {
  login(data: LoginParams) {
    const promise = instance.post<Response<{ userId?: number }>>(
      'auth/login',
      data
    )
    return promise
  },
  logout() {
    const promise = instance.delete<Response<{ userId?: number }>>('auth/login')
    return promise
  },
  me() {
    const promise =
      instance.get<Response<{ id: number; email: string; login: string }>>(
        'auth/me'
      )
    return promise
  },
}

// types
export type Todolist = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type Response<D = {}> = {
  resultCode: number
  messages: Array<string>
  data: D
}

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export type TaskEntity = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
export type UpdateTaskModel = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskEntity[]
}
