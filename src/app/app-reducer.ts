import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authAPI } from 'api/todolists-api'
import { setIsLoggedIn } from 'features/Login/auth-reducer'
import { AppThunk } from 'app/store'

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type AppInitialState = {
  /**
   * происходит ли сейчас взаимодействие с сервером
   */
  status: RequestStatus
  /**
   * если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
   */
  error: string | null
  /**
   * true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
   */
  isInitialized: boolean
}

const initialState: AppInitialState = {
  status: 'idle',
  error: null,
  isInitialized: false,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: (builder) => ({
    // setAppError(state, action: PayloadAction<AppInitialState['error']>) {
    //   state.error = action.payload
    // },
    setAppError: builder.reducer<AppInitialState['error']>((state, action) => {
      state.error = action.payload
    }),
    setAppStatus(state, action: PayloadAction<RequestStatus>) {
      state.status = action.payload
    },
    setAppInitialized(
      state,
      action: PayloadAction<AppInitialState['isInitialized']>
    ) {
      state.isInitialized = action.payload
    },
  }),
  selectors: {
    selectAppError: (state) => state.error,
    selectAppStatus: (state) => state.status,
    selectAppInitialized: (state) => state.isInitialized,
  },
})

export const { setAppInitialized, setAppStatus, setAppError } = appSlice.actions
export const { selectAppStatus, selectAppInitialized, selectAppError } =
  appSlice.selectors

export const initializeAppTC = (): AppThunk => (dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn(true))
    } else {
    }

    dispatch(setAppInitialized(true))
  })
}
