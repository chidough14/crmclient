import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: undefined,
  email: "",
  name: "",
  setting: undefined,
  allUsers: [],
  loadingDashboard: false
}

export const userSlice = createSlice({
  name: 'user_info',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.id = action.payload.id
      state.email = action.payload.email
      state.name = action.payload.name
      state.setting = action.payload.setting
    },
    unsetUserInfo: (state, action) => {
      state.id = action.payload.id
      state.email = action.payload.email
      state.name = action.payload.name
      state.setting = action.payload.setting
    },
    setAllUsersData : (state, action) => {
      state.allUsers = action.payload.users
    },
    updateUserSettings : (state, action) => {
      state.setting = action.payload.setting
    },
    setLoadingDashboard: (state, action) => {
      state.loadingDashboard = action.payload.value
    }
  },
})

export const { setUserInfo, unsetUserInfo, setAllUsersData, updateUserSettings, setLoadingDashboard } = userSlice.actions

export default userSlice.reducer