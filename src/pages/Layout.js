import { CssBaseline, Typography } from "@mui/material";
import { Link, matchPath, Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CalendarMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import { getToken } from "../services/LocalStorageService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCompanyId, setSingleList } from "../features/listSlice";
import { setSingleCompany } from "../features/companySlice";
import { MeetingRoomOutlined, MessageOutlined, SettingsOutlined } from "@mui/icons-material";


const Layout = () => {
  const { collapseSidebar } = useProSidebar();
  const token = getToken()
  const {name} = useSelector(state => state.user)
  const {list} = useSelector(state => state.list)
  const [loggedIn, setLoggedIn] = useState([])
  const dispatch = useDispatch()
  const {pathname} = useLocation()
  const {selectedCompanyId} = useSelector(state => state.list)
  const navigate = useNavigate()

  const isListPage = matchPath("/listsview/*", pathname)
  const isJoinPage = matchPath("/join/*", pathname)
  const isActivityPage = matchPath("/activities/*", pathname)
  const isMessagePage = matchPath("/messages/*", pathname)


 
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
     ( loggedIn && isJoinPage?.pathnameBase !== "/join" ) ? (
        <div style={{ display: 'flex', height: '100%', marginTop: "64px"}}>
          <Sidebar 
            backgroundColor="#E0E0E0"
            rootStyles={{
              height: "100vh",
              marginRight: "20px",
            }}
          >
            {
              isListPage?.pathnameBase === "/listsview" ? (
                  <Menu>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <Typography variant="h6" style={{marginLeft: "10px"}}><b>{list?.name}</b></Typography>


                      <ListIcon style={{cursor: "pointer"}} onClick={() => navigate("/lists")} />

                    </div>
                    {
                      list?.companies.map((a) => (
                        <MenuItem 
                          rootStyles={{
                            backgroundColor: selectedCompanyId === a.id ? "#DDA0DD" : ""
                          }}
                          onClick={() => dispatch(setSelectedCompanyId({id: a.id}))}
                        >
                          {a.name}
                        </MenuItem>
                      ))
                    }
                  </Menu>
              ) : (
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
                      backgroundColor: isActivityPage?.pathnameBase  === "/activities" ? "#DDA0DD" : ""
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

                  <MenuItem 
                    routerLink={<Link to="/messages" />}
                    rootStyles={{
                      backgroundColor:  isMessagePage?.pathnameBase === "/messages" ? "#DDA0DD" : ""
                    }}
                  >
                    <MessageOutlined />&nbsp;&nbsp;&nbsp; Messages
                  </MenuItem>

                  <MenuItem 
                    routerLink={<Link to="/mymeetings" />}
                    rootStyles={{
                      backgroundColor: pathname === "/mymeetings" ? "#DDA0DD" : ""
                    }}
                  >
                    <MeetingRoomOutlined />&nbsp;&nbsp;&nbsp; Meetings
                  </MenuItem>

                  <MenuItem 
                    routerLink={<Link to="/settings" />}
                    rootStyles={{
                      backgroundColor: pathname === "/settings" ? "#DDA0DD" : ""
                    }}
                  >
                    <SettingsOutlined />&nbsp;&nbsp;&nbsp; Settings
                  </MenuItem>
                </Menu>
              )
            }
           
          </Sidebar>
          
          <main style={{width: "100%"}}>
            <Outlet />
          </main>
        </div>
      ) : (
        <main style={{width: "100%"}}>
          <Outlet />
        </main>
      )
    }
   
  </>;
};

export default Layout;
