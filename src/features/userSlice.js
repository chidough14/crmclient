import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: undefined,
  email: "",
  name: ""
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
  },
})

export const { setUserInfo, unsetUserInfo } = userSlice.actions

export default userSlice.reducer