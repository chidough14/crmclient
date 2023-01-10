import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: undefined,
  email: "",
  name: "",
  allUsers: []
}

export const userSlice = createSlice({
  name: 'user_info',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.id = action.payload.id
      state.email = action.payload.email
      state.name = action.payload.name
    },
    unsetUserInfo: (state, action) => {
      state.id = action.payload.id
      state.email = action.payload.email
      state.name = action.payload.name
    },
    setAllUsersData : (state, action) => {
      state.allUsers = action.payload.users
    },
  },
})

export const { setUserInfo, unsetUserInfo, setAllUsersData } = userSlice.actions

export default userSlice.reducer