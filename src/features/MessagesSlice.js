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
    readInboxMessages: (state, action) => {
      state.inbox.data = state.inbox.data.filter((a) => a.id !== action.payload.messageId)
    },
    setOutboxMessages: (state, action) => {
      state.outbox = action.payload.outbox
    },
    setSingleMessage: (state, action) => {
      state.singleMessage = action.payload.message
    },
    addNewMessage: (state, action) => {
      state.outbox.data = [...state.outbox.data, action.payload.message]
    },
    removeMessage: (state, action) => {
      state.outbox.data = state.outbox.data.filter((a) => a.id !== action.payload.messageId)
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
  removeMessage,
  readInboxMessages
} = MessageSlice.actions

export default MessageSlice.reducer