import { Button, Divider, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ActivityModal from '../components/activities/ActivityModal'
import AddCompanyToListModal from '../components/company/AddCompanyToListModal'
import ComanyActivitiesTable from '../components/company/CompanyActivitiesTable'
import LineChart from '../components/company/LineChart'
import Map from '../components/company/Map'
import { setSingleCompany } from '../features/companySlice'
import instance from '../services/fetchApi'

const Company = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const {company} = useSelector(state => state.company)
  const [open, setOpen] = useState(false);
  const [openActivityModal, setOpenActivityModal] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenActivityModal = () => setOpenActivityModal(true);
  
  useEffect(() => {
    const fetchCompany = async () => {
      await instance.get(`companies/${params.id}`)
      .then((res)=> {
        console.log(res);
        dispatch(setSingleCompany({company: res.data.company}))
      })
    }

    fetchCompany()
  }, [params.id])

  return (
    <div>
      <Toolbar>
        <Typography variant='h5'  component="div" sx={{ flexGrow: 2 }}>{`${company?.name}'s Details`}</Typography>

        <Button variant="contained" size='small' onClick={handleOpen}>Add to list</Button>&nbsp;&nbsp;&nbsp;

        <Button variant="contained" size='small' onClick={handleOpenActivityModal}>Start Activity</Button>
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
        {/* <Typography variant='h6'><b>Activities</b></Typography> */}
        <ComanyActivitiesTable rows={company?.activities} />
      </div>

      {/* <div style={{display: "flex", justifyContent: "space-between", marginTop: "20px"}}>
        <LineChart />
      </div> */}

      <AddCompanyToListModal
        open={open}
        setOpen={setOpen} 
        companyId={params.id}
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