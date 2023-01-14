import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AddOutlined, DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { Box, Button, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import instance from '../../services/fetchApi';
import { setInvitedMeetings, setMeetings } from '../../features/MeetingSlice';
import { useState } from 'react';
import { setProducts } from '../../features/ProductSlice';
import ProductsTable from './ProductsTable';
import CompaniesTable from './CompaniesTable';
import { setCompany } from '../../features/companySlice';
import AppModeSettings from './AppModeSettings';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../services/LocalStorageService';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Settings = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user) 
  const {products} = useSelector((state) => state.product) 
  const {companies} = useSelector((state) => state.company) 
  const [value, setValue] = useState(0)
  const token = getToken()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])

  React.useEffect(() => {
    const  fetchProducts = async () => {
      await instance.get(`products`)
      .then((res) => {
       dispatch(setProducts({products: res.data.products}))
      })
    }

    const  fetchCompanies = async () => {
      await instance.get(`companies`)
      .then((res) => {
       dispatch(setCompany({companies: res.data.companies}))
      })
    }

    fetchCompanies()
    fetchProducts()
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const showModal = (row) => {
  
  };


  return (
    <>
      <Typography variant='h6'>Settings</Typography>  
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Products" {...a11yProps(0)} />
          <Tab label="Companies" {...a11yProps(1)} />
          <Tab label="App Mode" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <ProductsTable rows={products} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <CompaniesTable rows={companies} />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <AppModeSettings />
      </TabPanel>
    </>
 
  );
}


export default Settings