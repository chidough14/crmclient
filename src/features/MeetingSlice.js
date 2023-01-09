import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  meetings: [],
  meeting: undefined,
  invitedMeetings: [],
}

export const MeetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    setMeetings: (state, action) => {
      state.meetings = action.payload.meetings
    },
    addMeeting: (state, action) => {
      state.meeting = action.payload.meeting
    },
    setUpdateMeeting: (state, action) => {
      let idx = state.meetings.findIndex((a) => a.id === action.payload.meeting.id)
      state.meetings[idx] = action.payload.meeting
    },
    setInvitedMeetings: (state, action) => {
      state.invitedMeetings = action.payload.invitedMeetings
    },
  },
})

export const { 
  setMeetings, addMeeting, setUpdateMeeting, setInvitedMeetings
} = MeetingSlice.actions

export default MeetingSlice.reducer