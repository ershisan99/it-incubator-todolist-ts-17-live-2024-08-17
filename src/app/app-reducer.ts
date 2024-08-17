import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authAPI } from 'api/todolists-api'
import { setIsLoggedIn } from 'features/Login/auth-reducer'
import { AppThunk } from 'app/store'

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialState = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatus
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null
  // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
  isInitialized: boolean
}

const initialState: InitialState = {
  status: 'idle',
  error: null,
  isInitialized: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setAppStatus(state, action: PayloadAction<RequestStatus>) {
      state.status = action.payload
    },
    setAppInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload
    },
  },
})

export const appReducer = appSlice.reducer

export const { setAppInitialized, setAppStatus, setAppError } = appSlice.actions

export const initializeAppTC = (): AppThunk => (dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn(true))
    } else {
    }

    dispatch(setAppInitialized(true))
  })
}
