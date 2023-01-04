import { Button, CssBaseline, Grid, Typography } from '@mui/material';
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


const Dashboard = () => {
  const [userData, setUserData] = useState({
    email: "",
    name: ""
  })
 
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = getToken()
  const [logoutUser] = useLogoutUserMutation()
  const { data, isSuccess } = useGetLoggedUserQuery(token)
  const { events } = useSelector(state => state.event)
  const { lists } = useSelector(state => state.list)
  const { activities } = useSelector(state => state.activity)
  const [eventsToday, setEventsToday] = useState([])


  const handleLogout = async () => {
    const res = await logoutUser({ token })
    if (res.data.status === "success") {
      dispatch(unsetUserToken({ token: null }))
      dispatch(unsetUserInfo({ email: "", name: "" }))
      removeToken('token')
      navigate('/login')
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])

  // Store User Data in Local State
  useEffect(() => {
    if (data && isSuccess) {
      setUserData({
        email: data.user.email,
        name: data.user.name,
      })
    }
  }, [data, isSuccess])

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
        <div style={{width: "50%"}}>
          <BarChart />
        </div>
        <div style={{width: "30%"}}>
          <DoughnutChart />
        </div>
      </div>
    </div>
  )
};

export default Dashboard;
