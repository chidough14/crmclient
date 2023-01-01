import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activities: []
}

export const ActivitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setActivities: (state, action) => {
      state.activities = action.payload.activities
    },
    addActivity: (state, action) => {
      state.activities = [...state.activities, action.payload.activity]
    },
    updateActivityProbability: (state, action) => {
      let idx
      idx = state.activities.findIndex((a) => a.id === action.payload.activity.id)
      state.activities[idx] = action.payload.activity
    },
  },
})

export const { 
  setActivities,
  addActivity,
  updateActivityProbability
} = ActivitySlice.actions

export default ActivitySlice.reducer