import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
  hide: true,
  chatMessages: []
}

export const MessageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload.users
    },
    setHide: (state, action) => {
      state.hide =action.payload.value
    },
    removeUser: (state, action) => {
      state.users = state.users.filter((a) => a.userName !== action.payload.userName)
    },
    setChatMessages: (state, action) => {
      console.log( action.payload.data);
      state.chatMessages = [...state.chatMessages, action.payload.data]
    }
  },
})

export const { 
  setUsers, setHide, removeUser, setChatMessages
} = MessageSlice.actions

export default MessageSlice.reducer