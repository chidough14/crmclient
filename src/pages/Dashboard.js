import { Button, CircularProgress, CssBaseline, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChangePassword from './auth/ChangePassword';
import { useLogoutUserMutation, useGetLoggedUserQuery } from '../services/userAuthApi';
import { getToken, removeToken } from '../services/LocalStorageService';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, unsetUserInfo } from '../features/userSlice';
import { unsetUserToken } from '../features/authSlice';
import DashboardCard from '../components/dashboard/DashboardCard';
import { BarChart } from '../components/dashboard/BarChart';
import { DoughnutChart } from '../components/dashboard/DoughnutChart';
import moment from 'moment';
import { Box } from '@mui/system';


const Dashboard = () => {
  const [userData, setUserData] = useState({
    email: "",
    name: ""
  })
 
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = getToken()
  const [logoutUser] = useLogoutUserMutation()
  const { events } = useSelector(state => state.event)
  const { lists } = useSelector(state => state.list)
  const [eventsToday, setEventsToday] = useState([])
  const { setting, loadingDashboard } = useSelector(state => state.user)

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])

  // Store User Data in Local State
  // useEffect(() => {
  //   if (data && isSuccess) {
  //     setUserData({
  //       email: data.user.email,
  //       name: data.user.name,
  //     })
  //   }
  // }, [data, isSuccess])

  useEffect(() => {
    

    let ev = events.filter((ev) => moment().isSame(ev.start, 'day') && moment().isBefore(ev.end))
    .map((a) => {
      return {
        ...a,
        start : moment(a.start).toDate(),
        end : moment(a.end).toDate()
      }
    })
    .sort((a, b)=> new Date(a.start) - new Date(b.start))

    setEventsToday(ev)
  }, [events])



  return (
    <>
      {
        loadingDashboard ? (
          <Box sx={{ display: 'flex', marginLeft: "50%" }}>
            <CircularProgress />
          </Box>
        ) : (
          <div>
            <Typography variant='h6'><b>Dashboard</b></Typography>
            <div style={{display: "flex", justifyContent: "space-between", columnGap: "30px", marginBottom: "30px"}}>
              <div style={{width: "90%"}}>
                <DashboardCard type="list" lists={lists}  />
              </div>
              <div style={{width: "90%"}}>
                <DashboardCard type="event" events={eventsToday}/>
              </div>
              <div style={{width: "90%"}}>
                <DashboardCard type="activity" />
              </div>
            </div>
      
            <div style={{display: "flex", justifyContent: "space-between",  columnGap: "10px", }}>
              {
                setting?.dashboard_mode === "show_graphs" && (
                  <>
                  <div style={{width: "50%"}}>
                    <BarChart />
                  </div>
                  <div style={{width: "30%"}}>
                    <DoughnutChart />
                  </div>
                  </>
                )
              }
      
              {
                setting?.dashboard_mode === "show_bar_graph" && (
                  <>
                  <div style={{width: "50%"}}>
                    <BarChart />
                  </div>
                  <div style={{width: "30%"}}>
                    
                  </div>
                  </>
                )
              }
      
              {
                setting?.dashboard_mode === "show_doughnut_graph" && (
                  <>
                  <div style={{width: "40%"}}>
                    <DoughnutChart />
                  </div>
                  <div style={{width: "30%"}}>
                  
                  </div>
                  </>
                )
              }
            
            </div>
          </div>
        )
      }
    </>
   
  )
};

export default Dashboard;
