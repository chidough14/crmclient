import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userAuthApi } from '../services/userAuthApi'
import userReducer from '../features/userSlice'
import authReducer from '../features/authSlice'
import companyReducer from '../features/companySlice'
import listReducer from '../features/listSlice'
import activityReducer from '../features/ActivitySlice'
import eventReducer from '../features/EventSlice'

export const store = configureStore({
  reducer: {
    [userAuthApi.reducerPath]: userAuthApi.reducer,
    user: userReducer,
    auth: authReducer,
    company: companyReducer,
    list: listReducer,
    activity: activityReducer,
    event: eventReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAuthApi.middleware),
})
setupListeners(store.dispatch)