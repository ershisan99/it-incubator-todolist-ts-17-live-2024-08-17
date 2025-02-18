import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  addTodolistTC,
  changeTodolistFilter,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValues,
  removeTodolistTC,
  selectTodolists,
} from './todolists-reducer'
import {
  addTaskTC,
  removeTaskTC,
  selectTasks,
  updateTaskTC,
} from './tasks-reducer'
import { TaskStatuses } from 'api/todolists-api'
import { Grid, Paper } from '@mui/material'
import { AddItemForm } from 'components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { selectIsLoggedIn } from 'features/Login/auth-reducer'

type Props = {
  demo?: boolean
}

export const TodolistsList: React.FC<Props> = ({ demo = false }) => {
  const todolists = useSelector(selectTodolists)
  const tasks = useSelector(selectTasks)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    const thunk = fetchTodolistsTC()
    dispatch(thunk)
  }, [])

  const removeTask = useCallback(function (id: string, todolistId: string) {
    const thunk = removeTaskTC(id, todolistId)
    dispatch(thunk)
  }, [])

  const addTask = useCallback(function (title: string, todolistId: string) {
    const thunk = addTaskTC(title, todolistId)
    dispatch(thunk)
  }, [])

  const changeStatus = useCallback(function (
    id: string,
    status: TaskStatuses,
    todolistId: string
  ) {
    const thunk = updateTaskTC(id, { status }, todolistId)
    dispatch(thunk)
  }, [])

  const changeTaskTitle = useCallback(function (
    id: string,
    newTitle: string,
    todolistId: string
  ) {
    const thunk = updateTaskTC(id, { title: newTitle }, todolistId)
    dispatch(thunk)
  }, [])

  const changeFilter = useCallback(function (
    value: FilterValues,
    todolistId: string
  ) {
    const action = changeTodolistFilter({ id: todolistId, filter: value })
    dispatch(action)
  }, [])

  const removeTodolist = useCallback(function (id: string) {
    const thunk = removeTodolistTC(id)
    dispatch(thunk)
  }, [])

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    const thunk = changeTodolistTitleTC(id, title)
    dispatch(thunk)
  }, [])

  const addTodolist = useCallback(
    (title: string) => {
      const thunk = addTodolistTC(title)
      dispatch(thunk)
    },
    [dispatch]
  )

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  }

  return (
    <>
      <Grid
        container
        style={{ padding: '20px' }}
      >
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid
        container
        spacing={3}
      >
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid
              item
              key={tl.id}
            >
              <Paper style={{ padding: '10px' }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
