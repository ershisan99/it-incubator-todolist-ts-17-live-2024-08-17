import {
  addTodolist,
  TodolistDomain,
  todolistsReducer,
} from './todolists-reducer'
import { tasksReducer, TasksState } from './tasks-reducer'
import { Todolist } from 'api/todolists-api'

test('ids should be equals', () => {
  const startTasksState: TasksState = {}
  const startTodolistsState: Array<TodolistDomain> = []

  let todolist: Todolist = {
    title: 'new todolist',
    id: 'any id',
    addedDate: '',
    order: 0,
  }

  const action = addTodolist(todolist)

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.id)
  expect(idFromTodolists).toBe(action.payload.id)
})
