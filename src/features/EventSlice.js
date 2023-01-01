import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  events: []
}

export const EventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload.events
    },
    // addActivity: (state, action) => {
    //   state.activities = [...state.activities, action.payload.activity]
    // },
  },
})

export const { 
  setEvents
} = EventSlice.actions

export default EventSlice.reducer