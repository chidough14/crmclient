import { Button, Divider, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useMatch, useNavigate, useParams } from 'react-router-dom'
import ActivityModal from '../components/activities/ActivityModal'
import AddCompanyToListModal from '../components/company/AddCompanyToListModal'
import ComanyActivitiesTable from '../components/company/CompanyActivitiesTable'
import LineChart from '../components/company/LineChart'
import Map from '../components/company/Map'
import { setSingleCompany } from '../features/companySlice'
import instance from '../services/fetchApi'
import { getToken } from '../services/LocalStorageService'

const Company = ({companyObj}) => {
  const params = useParams()
  const dispatch = useDispatch()
  const {company} = useSelector(state => state.company)
  const [open, setOpen] = useState(false);
  const [openActivityModal, setOpenActivityModal] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenActivityModal = () => setOpenActivityModal(true);
  const {pathname} = useLocation()
  const {selectedCompanyId} = useSelector(state => state.list)
  const {list} = useSelector(state => state.list)

  const isListPage = useMatch("/listsview/*", pathname)
  
  useEffect(() => {
    const fetchCompany = async (id) => {
      await instance.get(`companies/${id}`)
      .then((res)=> {
        dispatch(setSingleCompany({company: res.data.company}))
      })
    }

    if (isListPage && selectedCompanyId) {
      console.log(selectedCompanyId);
      fetchCompany(selectedCompanyId)
    } else {
      fetchCompany(params.id)
    }
  }, [params.id, isListPage, selectedCompanyId])

  const token = getToken()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])

  return (
    <div>
      <Toolbar>
        {
          (isListPage && !list?.companies.length) ? (
            <Typography variant='h5'  component="div" sx={{ flexGrow: 2 }}>No companies in list</Typography>
          ) : (
            <Typography variant='h5'  component="div" sx={{ flexGrow: 2 }}>{`${company?.name}'s Details`}</Typography>
          )
        }

        <Button variant="contained" style={{borderRadius: "30px"}} size='small' onClick={handleOpen} disabled={isListPage && !list?.companies.length}>Add to list</Button>&nbsp;&nbsp;&nbsp;

        <Button variant="contained" style={{borderRadius: "30px"}} size='small' onClick={handleOpenActivityModal} disabled={isListPage && !list?.companies.length}>Start Activity</Button>
      </Toolbar>
     

      <div style={{display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
        <div>
          <Typography variant="h7" display="block"  gutterBottom>
            <b>Name</b> : {company?.name}
          </Typography>

          <Typography variant="h7" display="block"  gutterBottom>
            <b>Address</b> : {company?.address}
          </Typography>

          <Typography variant="h7" display="block"  gutterBottom>
            <b>Email</b> : {company?.email}
          </Typography>

          <Typography variant="h7" display="block"  gutterBottom>
            <b>Phone</b> : {company?.phone}
          </Typography>

          <Typography variant="h7" display="block"  gutterBottom>
            <b>Contact Person</b> : {company?.contactPerson}
          </Typography>
        </div>

        <div style={{margin: "auto", width: "50%"}}>
          <Map />
        </div>
      </div>
      <Divider>
        <Typography variant='h6'><b>Activities</b></Typography>
      </Divider>
      <div>
        <ComanyActivitiesTable rows={company?.activities} />
      </div>

      {/* <div style={{display: "flex", justifyContent: "space-between", marginTop: "20px"}}>
        <LineChart />
      </div> */}

      <AddCompanyToListModal
        open={open}
        setOpen={setOpen} 
        companyId={company?.id}
      />

      <ActivityModal
        openActivityModal={openActivityModal}
        setOpen={setOpenActivityModal}
        companyObject={company}
      />
    </div>
  )
}

export default Company