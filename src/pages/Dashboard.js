import {  CircularProgress,  Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/LocalStorageService';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCard from '../components/dashboard/DashboardCard';
import { BarChart } from '../components/dashboard/BarChart';
import { DoughnutChart } from '../components/dashboard/DoughnutChart';
import moment from 'moment';
import instance from '../services/fetchApi';
import { setLoadingDashboard } from '../features/userSlice';


// let arr = [
//   { "January": 4976097 },
//   { "December": 520000 },
//   { "March": 520000 },
//   { "April": 520000 }
// ];

// arr.sort(function(a, b) {
// var monthA = Object.keys(a)[0];
// var monthB = Object.keys(b)[0];
// if (monthA < monthB) {
//   return -1;
// }
// if (monthA > monthB) {
//   return 1;
// }
// return 0;
// });

// console.log(arr)


const Dashboard = () => {
  const navigate = useNavigate()
  const token = getToken()
  //const { events } = useSelector(state => state.event)
  const { lists } = useSelector(state => state.list)
  const [eventsToday, setEventsToday] = useState([])
  const { setting, loadingDashboard } = useSelector(state => state.user)
  const [events, setEvents] = useState([])
  const [list, setList] = useState()
  const [results, setResults] = useState([])
  const [owner, setOwner] = useState(setting?.product_sales_mode)
  const [doughnutResults, setDoughnutResults] = useState([])
  //const [activitySummary, setActivitySummary] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])

  useEffect(() => {
    setOwner(setting?.product_sales_mode)
  }, [setting?.product_sales_mode])

  // Store User Data in Local State
  // useEffect(() => {
  //   if (data && isSuccess) {
  //     setUserData({
  //       email: data.user.email,
  //       name: data.user.name,
  //     })
  //   }
  // }, [data, isSuccess])
  const getTotalProductsSales = async (url) => {
    await  instance.get(`${url}`)
    .then((res) => {
      setResults(res.data.results)
    })
  }

  useEffect(() => {
    if (owner === 'allusers') {
      getTotalProductsSales('dashboard-total-products/allusers')
    } else {
      getTotalProductsSales('dashboard-total-products/mine')
    }
  }, [owner])

  useEffect(() => {

    let requests = []
    requests.push(
      instance.get(`dashboardevents`)
      .then((res) => {
        setEvents(res.data.events)
      }),
      instance.get(`mylists-dashboard`)
      .then((res) => {
        setList(res.data.list)
      }),
      instance.get(`dashboard-total-sales-users`)
      .then((res) => {
        setDoughnutResults(res.data.results)
      }),
      // instance.get(`activities-summary`)
      // .then((res) => {
      //   setActivitySummary(res.data)
      // })
    )

    const  runAll = async () => {
      dispatch(setLoadingDashboard({value: true}))
      await Promise.all(requests).then((results)=>{
      
        dispatch(setLoadingDashboard({value: false}))
      })
      .catch((err)=> {
        console.log(err);
      })
    }

    runAll()
  }, [])

  useEffect(() => {
    

    let ev = events.filter((ev) =>  moment().isBefore(ev.end))
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
                <DashboardCard type="list" list={list}  />
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
                    <BarChart results={results} owner={owner} setOwner={setOwner} />
                  </div>
                  <div style={{width: "30%"}}>
                    <DoughnutChart results={doughnutResults} />
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
