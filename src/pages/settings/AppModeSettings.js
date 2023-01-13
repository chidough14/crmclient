import { InputLabel, Select, MenuItem, Button, Snackbar, Alert } from '@mui/material'
import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserSettings } from '../../features/userSlice'
import instance from '../../services/fetchApi'

const AppModeSettings = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  
  const initialState = {
    dashboard_mode: "",
    calendar_mode: "",
    openAlert: false
  };

  const [data, updateData] = useReducer(
    (state, updates) => ({ ...state, ...updates }),
    initialState
  );

  const handleCloseAlert = () => {
    updateData({openAlert: false})
  }

  useEffect(() => {
    if (user?.setting) {
      updateData({
        dashboard_mode: user?.setting?.dashboard_mode,
        calendar_mode: user?.setting?.calendar_mode
      })
    }
  }, [user?.setting])

  const updateSettings = async () => {
    let body = {
      user_id: user?.id,
      dashboard_mode: data.dashboard_mode,
      calendar_mode: data.calendar_mode
    }

    await instance.patch(`settings`, body)
    .then((res) => {
      dispatch(updateUserSettings({setting: res.data.setting}))
      updateData({openAlert: true})
    })
  }

  return (
    <div>
      <InputLabel id="demo-select-small">Dashboard Mode</InputLabel>
      <Select
        id='dashboard_mode'
        name="dashboard_mode"
        label="Dashboard Mode"
        size='small'
        style={{width: "50%"}}
        //fullWidth
        value={data.dashboard_mode}
        onChange={(e)=> updateData({dashboard_mode: e.target.value})}
      >
        <MenuItem value="show_graphs">Show All Graphs</MenuItem>
        <MenuItem value="show_bar_graph">Show Bar Graph</MenuItem>
        <MenuItem value="show_doughnut_graph">Show Doughnut Graph</MenuItem>
      </Select>
      <p></p>
      <InputLabel id="demo-select-small">Calendar Mode</InputLabel>
      <Select
        id='calendar_mode'
        name="calendar_mode"
        label="Calendar Mode"
        size='small'
        style={{width: "50%"}}
        //fullWidth
        value={data.calendar_mode}
        onChange={(e)=> updateData({calendar_mode: e.target.value})}
      >
        <MenuItem value="day">Day</MenuItem>
        <MenuItem value="week">Week</MenuItem>
        <MenuItem value="month">Month</MenuItem>
        <MenuItem value="agenda">Agenda</MenuItem>
      </Select>
      <p></p>

      <Button
        size='small' 
        color="primary" 
        variant="contained" 
        style={{borderRadius: "30px"}}
        onClick={updateSettings}
      >
          Save
      </Button>


      <Snackbar open={data.openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Settings updated
        </Alert>
      </Snackbar>
    </div>
  )
}

export default AppModeSettings