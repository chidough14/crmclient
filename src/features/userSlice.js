import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: undefined,
  email: "",
  name: "",
  created_at: "",
  profile_pic: "",
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
      state.created_at = action.payload.created_at
      state.profile_pic = action.payload.profile_pic
      state.setting = action.payload.setting
    },
    unsetUserInfo: (state, action) => {
      state.id = action.payload.id
      state.email = action.payload.email
      state.name = action.payload.name
      state.created_at = action.payload.created_at
      state.profile_pic = action.payload.profile_pic
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
    }, 
    updateAllUsers: (state, action) => {
      let idx = state.allUsers.findIndex((a) => a.id === action.payload.user.id)
      let arr = [...state.allUsers]
      arr[idx].profile_pic = action.payload.user.profile_pic
      state.allUsers = arr
    }
  },
})

export const { setUserInfo, unsetUserInfo, setAllUsersData, updateUserSettings, setLoadingDashboard, updateAllUsers } = userSlice.actions

export default userSlice.reducer