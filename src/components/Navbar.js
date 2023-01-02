import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getToken } from '../services/LocalStorageService';
import SearchBar from './SearchBar';
import instance from "../services/fetchApi";
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import { setCompany } from '../features/companySlice';
import UserAccountsCircle from './UserAccountsCircle';
import { styled } from '@mui/material/styles';

const Navbar = ({collapseSidebar}) => {

  const token = getToken('token')
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const company = useSelector(state=> state.company)
  const {name, email} = useSelector(state=> state.user)
  const navigate = useNavigate()
  //const {token} = useSelector(state=> state.auth)
  const dispatch = useDispatch()
  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

  useEffect(() => {
    if (!token || name === "") {
      setLoggedIn(false)
    } else {
      setLoggedIn(true)
    }
  }, [token, name])

  useEffect(()=> {
    const getSearchResult = async () => {
      await instance({
        url: `companies/search?query=${searchQuery}`,
        method: "GET",
      }).then((res) => {
        console.log(res);

        dispatch(setCompany({companies: res.data.companies}))
      });
    }

    if (searchQuery.length === 3){
      getSearchResult()
    }
  }, [searchQuery])

  return <>
    <Box sx={{ flexGrow: 1}}>
      <AppBar position='fixed' color="secondary">
        <Toolbar>
          <Typography variant='h5' component="div" sx={{ flexGrow: 1 }} >
            <DensitySmallIcon onClick={()=>collapseSidebar()} style={{cursor: "pointer"}} /> &nbsp;&nbsp;&nbsp;
            <Link to="/" style={{textDecoration: "none", color: "white"}}>
              <span>CRM</span>
            </Link>
          </Typography>

          {
            loggedIn && (
                <SearchBar  
                  data={company.companies} 
                  setSearchQuery={setSearchQuery} 
                  navigate={navigate}
                />
            )
          }

          <Button component={NavLink} to='/' style={({ isActive }) => { return { backgroundColor: isActive ? '#6d1b7b' : '' } }} sx={{ color: 'white', textTransform: 'none' }}>About</Button>

          <Button component={NavLink} to='/contact' style={({ isActive }) => { return { backgroundColor: isActive ? '#6d1b7b' : '' } }} sx={{ color: 'white', textTransform: 'none' }}>Contact</Button>

          {
            loggedIn ? 
            <UserAccountsCircle name={name} /> : 
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
    </Box>
  </>;
};

export default Navbar;
