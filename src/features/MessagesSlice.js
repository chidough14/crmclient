import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
  hide: true,
  chatMessages: [],
  inbox: [],
  outbox: [],
  singleMessage: undefined
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
      state.chatMessages = [...state.chatMessages, action.payload.data]
    },
    setInboxMessages: (state, action) => {
      state.inbox = action.payload.inbox
    },
    setOutboxMessages: (state, action) => {
      state.outbox = action.payload.outbox
    },
    setSingleMessage: (state, action) => {
      state.singleMessage = action.payload.message
    },
    addNewMessage: (state, action) => {
      state.outbox = [...state.outbox, action.payload.message]
    },
    removeMessage: (state, action) => {
      state.outbox = state.outbox.filter((a) => a.id !== action.payload.messageId)
    }
  },
})

export const { 
  setUsers, 
  setHide, 
  removeUser, 
  setChatMessages, 
  setUserMessages, 
  setInboxMessages, 
  setOutboxMessages,
  setSingleMessage,
  addNewMessage,
  removeMessage
} = MessageSlice.actions

export default MessageSlice.reducer