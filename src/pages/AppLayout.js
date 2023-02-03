import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, matchPath, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../services/LocalStorageService";
import { DashboardOutlined, DensitySmallOutlined, MeetingRoomOutlined, MessageOutlined, SettingsOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import ListIcon from '@mui/icons-material/List';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CalendarMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import BellNotification from '../components/BellNotification';
import UserAccountsCircle from '../components/UserAccountsCircle';
import SearchBar from '../components/SearchBar';
import instance from '../services/fetchApi';
import { setSearchResults } from '../features/companySlice';
import { setSelectedCompanyId } from '../features/listSlice';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


const sideBarItems = [
  {
    name: "Dashboard",
    icon: <DashboardOutlined />,
    link: "/dashboard"
  },
  {
    name: "Lists",
    icon: <ListIcon />,
    link: "/lists"
  },
  {
    name: "Activities",
    icon: <PointOfSaleIcon />,
    link: "/activities"
  },
  {
    name: "Calendar",
    icon: <CalendarMonthIcon />,
    link: "/events"
  },
  {
    name: "Orders",
    icon: <ShoppingCartOutlined />,
    link: "/orders"
  },
  {
    name: "Messages",
    icon: <MessageOutlined />,
    link: "/messages"
  },
  {
    name: "Meetings",
    icon: <MeetingRoomOutlined />,
    link: "/mymeetings"
  },
  {
    name: "Settings",
    icon: <SettingsOutlined />,
    link: "/settings"
  },
]


export default function AppLayout() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const token = getToken()
  const {name, allUsers, profile_pic} = useSelector(state => state.user)
  const {list, loadingCompanies} = useSelector(state => state.list)
  const [loggedIn, setLoggedIn] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("");
  const {searchResults} = useSelector(state=> state.company)
  const dispatch = useDispatch()
  const {pathname} = useLocation()
  const {selectedCompanyId} = useSelector(state => state.list)
  const [inboxData, setInboxData] = React.useState([])
  const [invitedMeetingsData, setInvitedMeetingsData] = React.useState([])
  const { invitedMeetings } = useSelector((state) => state.meeting) 
  const {fetchNotifications} = useSelector(state => state.message)
  const navigate = useNavigate()

  const isListPage = matchPath("/listsview/*", pathname)
  const isJoinPage = matchPath("/join/*", pathname)

  React.useEffect(() => {
    if (!token || name === "") {
      setLoggedIn(false)
    } else {
      setLoggedIn(true)
    }
  }, [token, name])

  React.useEffect(()=> {
    const getSearchResult = async () => {
      await instance({
        url: `companies/search?query=${searchQuery}`,
        method: "GET",
      }).then((res) => {

        dispatch(setSearchResults({companies: res.data.companies}))
      });
    }

    if (searchQuery.length === 3){
      getSearchResult()
    }
  }, [searchQuery])

  React.useEffect(()=> {
    if ( isListPage?.pathnameBase === "/listsview") {
      setOpen(true)
    }
  }, [isListPage?.pathnameBase])

  React.useEffect(()=> {
    const getNotifications = async () => {
      await instance.get(`notifications`)
      .then((res) => {
         setInboxData(res.data.inbox)
         setInvitedMeetingsData(res.data.invitedMeetings)
      })
    }

    getNotifications()
  }, [loggedIn, fetchNotifications])

  const handleDrawerOpen = () => {
    setOpen(prev => !prev)
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position='fixed'  open={open} color="secondary" sx={{ width: "100%" }}>
        <Toolbar>
          <Typography variant='h5' component="div" sx={{ flexGrow: 1 }} >
            <DensitySmallOutlined onClick={handleDrawerOpen} style={{cursor: "pointer"}} /> &nbsp;&nbsp;&nbsp;
            <Link to="/" style={{textDecoration: "none", color: "white"}}>
              <span>CRM</span>
            </Link>
          </Typography>

          {
            loggedIn && (
                <SearchBar  
                  data={searchResults} 
                  setSearchQuery={setSearchQuery} 
                  navigate={navigate}
                />
            )
          }&nbsp;&nbsp;&nbsp;&nbsp;

          {
              loggedIn && (
                <BellNotification inbox={inboxData} allUsers={allUsers} invitedMeetings={invitedMeetingsData} />
              )
          }&nbsp;&nbsp;&nbsp;&nbsp;
        
          
{/* 
          <Button component={NavLink} to='/' style={({ isActive }) => { return { backgroundColor: isActive ? '#6d1b7b' : '' } }} sx={{ color: 'white', textTransform: 'none' }}>About</Button>

          <Button component={NavLink} to='/contact' style={({ isActive }) => { return { backgroundColor: isActive ? '#6d1b7b' : '' } }} sx={{ color: 'white', textTransform: 'none' }}>Contact</Button> */}

          {
            loggedIn ? 
            <UserAccountsCircle name={name} profile_pic={profile_pic} /> : 
            <Button 
              component={NavLink} 
              to='/login' style={({ isActive }) => { return { backgroundColor: isActive ? '#6d1b7b' : '' } }} 
              sx={{ color: 'white', textTransform: 'none' }}
            >
                Login/Registration
            </Button>
          }

        </Toolbar>  
        
      </AppBar>
      {
          ( loggedIn && isJoinPage?.pathnameBase !== "/join" ) ? (
              <>
                <Drawer variant="permanent" open={open} backgroundColor="red">
                  <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                      {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                  </DrawerHeader>
                  <Divider />
                  <List>
                    {
                       isListPage?.pathnameBase === "/listsview" ? (
                         <>
                         {
                            loadingCompanies ? (
                              <Box sx={{ display: 'flex', marginLeft: "35%" }}>
                                <Typography variant='h6'>Loading...</Typography>
                              </Box>
                            ) : (
                              <>
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                  {
                                    list?.name.length > 10 ? (
                                       <Tooltip title={list?.name}>
                                          <Typography variant="h6" style={{marginLeft: "10px", opacity: open ? 1 : 0 }}>
                                            <b>{`${list?.name.substring(0,10)}...`}</b>
                                          </Typography>
                                       </Tooltip>
                                    ) : (
                                    
                                      <Typography variant="h6" style={{marginLeft: "10px", opacity: open ? 1 : 0 }}>
                                        <b>{list?.name}</b>
                                      </Typography>
                                    )
                                  }


                                  <ListIcon style={{cursor: "pointer", opacity: open ? 1 : 0 }} onClick={() => navigate("/lists")} />

                                </div>
                               
                                { 
                                  open &&
                                  list?.companies.map((a) => (
                                  <ListItem  
                                      disablePadding 
                                      sx={{ 
                                        display: 'block', 
                                        borderRadius: "30px", 
                                        backgroundColor: selectedCompanyId === a.id ? "#DDA0DD" : "" ,
                                        borderRadius: selectedCompanyId === a.id ? "15px" : "" 
                                      }}
                                      onClick={() => dispatch(setSelectedCompanyId({id: a.id}))}
                                    >
                                      <ListItemButton
                                        sx={{
                                          minHeight: 48,
                                          justifyContent: open ? 'initial' : 'center',
                                          px: 2.5,
                                        }}
                                      >
                                        <ListItemText 
                                          primary={a.name} 
                                          sx={{ opacity: open ? 1 : 0 }} 
                                        />
                                      </ListItemButton>
                                    </ListItem>
                                  ))
                                }
                              </>
                            )
                         }
                         
                         </>
                       ) : 
                      sideBarItems.map((a, i) => (
                        <Tooltip title={a.name}>
                          <ListItem 
                            key={i} 
                            disablePadding 
                            sx={{ 
                              display: 'block', 
                              backgroundColor: matchPath(`${a.link}/*`, pathname)?.pathnameBase === `${a.link}` ? "#DDA0DD" : null ,
                              borderRadius: matchPath(`${a.link}/*`, pathname)?.pathnameBase === `${a.link}` ? "15px" : "" 
                            }}
                            onClick={()=> navigate(`${a.link}`)}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 3 : 'auto',
                                  justifyContent: 'center',
                                }}
                              >
                                {a.icon}
                              </ListItemIcon>
                              <ListItemText primary={a.name} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                          </ListItem>
                        </Tooltip>
                      ))
                    }
                  
                  </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  <main style={{width: "100%", marginTop: "50px"}}>
                    <Outlet />
                  </main>
                </Box>
              </>
          ) : (
            <Box component="main" sx={{ flexGrow: 1, p:3 }}>
              <main style={{width: "100%", marginTop: "50px"}}>
                <Outlet />
              </main>
            </Box>
          )
      }
    
    </Box>
  );
}