import { CssBaseline } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CalendarMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import { getToken } from "../services/LocalStorageService";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const Layout = () => {
  const { collapseSidebar } = useProSidebar();
  const token = getToken()
  const {name} = useSelector(state => state.user)
  const [loggedIn, setLoggedIn] = useState([])
  const {pathname} = useLocation()


 
  useEffect(() => {
    if (!token || name === "") {
      setLoggedIn(false)
    } else {
      setLoggedIn(true)
    }
  }, [token, name])
  return <>
    <CssBaseline />
    <Navbar collapseSidebar={collapseSidebar} />

    {
      loggedIn ? (
        <div style={{ display: 'flex', height: '100%', marginTop: "64px"}}>
          <Sidebar 
            backgroundColor="#E0E0E0"
            rootStyles={{
              height: "100vh",
              marginRight: "20px",
            }}
          >
            <Menu>
              <MenuItem 
                routerLink={<Link to="/dashboard" />}
                rootStyles={{
                  backgroundColor: pathname === "/dashboard" ? "#DDA0DD" : ""
                }}
              >
                <DashboardIcon />&nbsp;&nbsp;&nbsp;Dashboard
              </MenuItem>

              <MenuItem 
                routerLink={<Link to="/lists" />}
                rootStyles={{
                  backgroundColor: pathname === "/lists" ? "#DDA0DD" : ""
                }}
              >
                  <ListIcon />&nbsp;&nbsp;&nbsp;Lists
              </MenuItem>

              <MenuItem 
                routerLink={<Link to="/activities" />}
                rootStyles={{
                  backgroundColor: pathname === "/activities" ? "#DDA0DD" : ""
                }}
              >
                <PointOfSaleIcon />&nbsp;&nbsp;&nbsp; Activities
              </MenuItem>

              <MenuItem 
                routerLink={<Link to="/events" />}
                rootStyles={{
                  backgroundColor: pathname === "/events" ? "#DDA0DD" : ""
                }}
              >
                <CalendarMonthIcon />&nbsp;&nbsp;&nbsp; Calendar
              </MenuItem>
            </Menu>
          </Sidebar>
          
          <main style={{width: "100%"}}>
            <Outlet />
          </main>
        </div>
      ) : (
        <Outlet />
      )
    }
   
  </>;
};

export default Layout;
