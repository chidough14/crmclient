import * as React from 'react';
import { Box, CircularProgress, Tab, Tabs, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import instance from '../../services/fetchApi';
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
  const {products} = useSelector((state) => state.product) 
  const {companies} = useSelector((state) => state.company) 
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const token = getToken()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])

  const getProducts = (page = 1) => {
    instance.get(`products?page=${page}`)
    .then((res) => {
      dispatch(setProducts({products: res.data.products}))
      return Promise.resolve(true);
    })
    .catch((e)=>{
      return Promise.resolve(false);
    })
  }

  const getCompanies = (page = 1) => {
    instance.get(`companies?page=${page}`)
    .then((res) => {
      dispatch(setCompany({companies: res.data.companies}))
      return Promise.resolve(true);
    })
    .catch((e)=>{
      return Promise.resolve(false);
    })
  }

  React.useEffect(() => {

    let requests = []
    requests.push(
      getProducts(), getCompanies()
    )

   

    const  runAll = async () => {
      setLoading(true)
      await Promise.all(requests).then((results)=>{
        
        setLoading(false)
      })
      .catch((err)=> {
        console.log(err);
      })
    }

     runAll()
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
        {
          loading ? (
            <Box sx={{ display: 'flex', marginLeft: "50%" }}>
              <CircularProgress />
            </Box>
          ) : (
            <ProductsTable rows={products} getProducts={getProducts}/>
          )
        }
      
      </TabPanel>

      <TabPanel value={value} index={1}>
       {
          loading ? (
            <Box sx={{ display: 'flex', marginLeft: "50%" }}>
              <CircularProgress />
            </Box>
          ) : (
            <CompaniesTable rows={companies} getCompanies={getCompanies}/>
          )
        }
      
      </TabPanel>

      <TabPanel value={value} index={2}>
        <AppModeSettings />
      </TabPanel>
    </>
 
  );
}


export default Settings