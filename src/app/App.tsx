import React, { useCallback, useEffect } from 'react'
import './App.css'
import { TodolistsList } from 'features/TodolistsList/TodolistsList'
import { ErrorSnackbar } from 'components/ErrorSnackbar/ErrorSnackbar'
import { useDispatch, useSelector } from 'react-redux'
import {
  initializeAppTC,
  selectAppInitialized,
  selectAppStatus,
} from './app-reducer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from 'features/Login/Login'
import { logoutTC, selectIsLoggedIn } from 'features/Login/auth-reducer'
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from '@mui/material'
import { Menu } from '@mui/icons-material'

type Props = {
  demo?: boolean
}

function App({ demo = false }: Props) {
  const status = useSelector(selectAppStatus)
  const isInitialized = useSelector(selectAppInitialized)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const dispatch = useDispatch<any>()

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [])

  const logoutHandler = useCallback(() => {
    dispatch(logoutTC())
  }, [])

  if (!isInitialized) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '30%',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <CircularProgress />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className='App'>
        <ErrorSnackbar />
        <AppBar position='static'>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='menu'
            >
              <Menu />
            </IconButton>
            <Typography variant='h6'>News</Typography>
            {isLoggedIn && (
              <Button
                color='inherit'
                onClick={logoutHandler}
              >
                Log out
              </Button>
            )}
          </Toolbar>
          {status === 'loading' && <LinearProgress />}
        </AppBar>
        <Container fixed>
          <Routes>
            <Route
              path={'/'}
              element={<TodolistsList demo={demo} />}
            />
            <Route
              path={'/login'}
              element={<Login />}
            />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  )
}

export default App
