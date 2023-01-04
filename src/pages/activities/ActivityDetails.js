import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom'
import { addProductItemToActivity, deleteActivityEvent, removeActivity, removeProductItem, setSingleActivity, updateProductItem } from '../../features/ActivitySlice'
import instance from '../../services/fetchApi'
import { AddOutlined, DeleteOutlined, EditOutlined } from '@mui/icons-material';
import ActivityProductsTable from './ActivityProductsTable';
import AddProductToActivityModal from '../../components/activities/AddProductToActivityModal';
import ActivityModal from '../../components/activities/ActivityModal';
import ActivityEventsTable from './ActivityEventsTable';
import EventModal from '../../components/events/EventModal';
import ViewEventModal from '../../components/events/ViewEventModal';
import { deleteEvent } from '../../features/EventSlice';

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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ActivityDetails = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const {activity} = useSelector((state) => state.activity)
  const user = useSelector((state) => state.user)
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [productId, setProductId] = React.useState();
  const [quantity, setQuantity] =  React.useState(0);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openDialogDeleteActivity, setOpenDialogDeleteActivity] = React.useState(false);
  const [openAddeventModal, setOpenAddEventModal] = React.useState(false);
  const [openViewEventModal, setOpenViewEventModal] = React.useState(false);
  const [eventObj, setEventObj] = React.useState();
  const navigate = useNavigate()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(()=> {

    const getActivityDetails = async () => {
      await instance.get(`activities/${params.id}`)
      .then((res) => {
        console.log(res);
        dispatch(setSingleActivity({activity: res.data.activity}))
      })
    }

    getActivityDetails()

  }, [params.id])

  const addProductToActivity = async () => {
    let body = {
      productId: productId,
      quantity: quantity
    }
    await instance.post(`activities/${params.id}/addUpdateProduct`, body)
    .then((res) => {
      if (editMode) {
        dispatch(updateProductItem({product: res.data.product}))
      } else {
        dispatch(addProductItemToActivity({product: res.data.product}))
      }

      setOpenAddModal(false)
      setEditMode(false)
      setQuantity(0)
      setProductId(undefined)
    
    })
  }

  const editItem = (value) => {
    setOpenAddModal(true)
    setEditMode(true)
    setQuantity(value.pivot.quantity)
    setProductId(value.id)
  }

  const deleteItem = (value) => {
    setOpen(true)
    setProductId(value.id)
  }

  const removeItem = async () => {
    if (eventObj) {
      await instance.delete(`events/${eventObj.id}`)
      .then((res) => {
     
        dispatch(deleteActivityEvent({id: eventObj.id}))
        dispatch(deleteEvent({eventId: eventObj.id}))
        setOpen(false)
        setEventObj()
      
      })

    } else {
      await instance.delete(`activities/${params.id}/deleteProduct`, { data: {productId: productId}})
      .then((res) => {
     
        dispatch(removeProductItem({id: productId}))
        setOpen(false)
        setProductId(undefined)
      
      })
    }
  
  }

  const deleteRecord = async () => {
    await instance.delete(`activities/${params.id}`)
    .then((res) => {
      dispatch(removeActivity({activityId: parseInt(params.id)}))
      navigate("/activities")
      setOpenDialogDeleteActivity(false)
    
    })
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setEventObj()
  }

  
  const editEvent = (event) => {
    setOpenViewEventModal(true)
    setEventObj(event)
  }

  
  const removeEvent = (event) => {
    setOpen(true)
    setEventObj(event)
  }

  return (
    <div>
      <Toolbar>
        <Typography variant='h5'  component="div" sx={{ flexGrow: 2 }}>{`${activity?.label}`}</Typography>
      </Toolbar>
    
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Details" {...a11yProps(0)} />
            <Tab label="Products" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <div style={{display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
            <div>
              <Typography variant="h7" display="block"  gutterBottom>
                <b>Label</b> : {activity?.label}
              </Typography>

              <Typography variant="h7" display="block"  gutterBottom>
                <b>Description</b> : {activity?.description}
              </Typography>

              <Typography variant="h7" display="block"  gutterBottom>
                <b>Assignee</b> : {activity?.assignedTo}
              </Typography>

              <Typography variant="h7" display="block"  gutterBottom>
                <b>Type</b> : {activity?.type}
              </Typography>

              <Typography variant="h7" display="block"  gutterBottom>
                <b>Estimate</b> : {activity?.earningEstimate}
              </Typography>

              <Typography variant="h7" display="block"  gutterBottom>
                <b>Probability</b> : {activity?.probability}
              </Typography>

              <Button variant="contained" size='small' onClick={() => setOpenEditModal(true)}><EditOutlined /> Edit</Button>&nbsp;&nbsp;&nbsp;

              <Button variant="contained" size='small' onClick={()=> setOpenDialogDeleteActivity(true)}><DeleteOutlined /> Delete</Button>
            </div>

            <div style={{margin: "auto", width: "60%"}}>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant='h6'  component="div" sx={{ flexGrow: 2 }}><b>Upcoming Events</b></Typography>
                <Button variant="contained" size='small' onClick={() => setOpenAddEventModal(true)}>
                  <AddOutlined />
                </Button>
              </div>

              <ActivityEventsTable
                events={activity?.events}
                editEvent={editEvent}
                deleteEvent={removeEvent}
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <Typography variant='h6'><b>Products</b></Typography>

            <Button variant="contained" size='small' onClick={() => setOpenAddModal(true)}>Add Product</Button>
          </div>
         
          <div>
            <ActivityProductsTable 
              products={activity?.products} 
              editItem={editItem} 
              deleteItem={deleteItem}
            />
          </div>
        </TabPanel>
      </Box>

      <AddProductToActivityModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        setProductId={setProductId}
        quantity={quantity}
        setQuantity={setQuantity}
        addProductToActivity={addProductToActivity}
        editMode={editMode}
        setEditMode={setEditMode}
      />

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {eventObj ? "Delete Event" : "Delete Product"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this {eventObj ? "event" : "product"} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>No</Button>
          <Button onClick={removeItem} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogDeleteActivity}
        onClose={() => setOpenDialogDeleteActivity(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Activity
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this activity ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogDeleteActivity(false)}>No</Button>
          <Button onClick={deleteRecord} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <ActivityModal
       open={openEditModal}
       setOpen={setOpenEditModal}
       editMode={true}
       activity={activity && activity}
      />

      <EventModal
        open={openAddeventModal}
        setOpen={setOpenAddEventModal}
        activityId={activity?.id}
        user={user}
      />

      <ViewEventModal
        open={openViewEventModal}
        setOpen={setOpenViewEventModal}
        event={eventObj}
        showForm={true}
        //relatedActivity={activities.find((a) => a.id === eventObj?.activity_id)}
      />
    </div>
  )
}

export default ActivityDetails