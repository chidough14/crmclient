import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { IconButton, Menu, Typography, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Snackbar, Alert } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import moment from 'moment';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import {  CopyAllOutlined, DeleteOutlined, EditOutlined, MoreVert, MoveUpOutlined, ViewListOutlined } from '@mui/icons-material';
import { useState } from 'react';
import ActivityModal from './ActivityModal';
import instance from '../../services/fetchApi';
import { addActivity, removeActivity } from '../../features/ActivitySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteEvent } from '../../features/EventSlice';
import ActivityTransferModal from './ActivityTransferModal';

const showIcon = (type) => {
  if (type === "Call") {
    return <PhoneIcon  fontSize='12'/>
  } else if (type === "Email") {
    return <EmailIcon  fontSize='12'/>
  } else if (type === "Meeting") {
    return <ChatIcon  fontSize='12' />
  }
}

// const ActivityCard = (activity) => (
//   <Card sx={{  width: "90%", }}>
//     <CardContent>
//       <div>
//         <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
//           {moment(activity.created_at).format("MMMM Do YYYY")}
//         </Typography>

//         <IconButton 
//           aria-label="settings"
//           id="basic-button"
//           aria-controls={open ? 'basic-menu' : undefined}
//           aria-haspopup="true"
//           aria-expanded={open ? 'true' : undefined}
//           onClick={handleClick}
//         >
//           <MoreVert />
//         </IconButton>

//         <Menu
//           id="basic-menu"
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleClose}
//           MenuListProps={{
//             'aria-labelledby': 'basic-button',
//           }}
//         >
//           <MenuItem onClick={showEditModal}>Edit</MenuItem>
//           <MenuItem onClick={handleClickOpen}>Delete</MenuItem>
//         </Menu>
//       </div>
     
//       <Typography sx={{ mb: 0.5 }} color="text.primary">
//         <b>{activity.label}</b>
//       </Typography>
//       <div style={{display: "flex", justifyContent: "space-between"}}>
//         <Typography variant="body2">
//           {activity.description}
//         </Typography>
//         {showIcon(activity.type)}
//       </div>
//       <Typography sx={{ fontSize: 14, mb: -2, color: "blue" }} >
//           ${activity.earningEstimate}
//       </Typography>
//     </CardContent>
//   </Card>
// )

const ActivityItem = ({activity, index}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [activityObj, setActivityObj] = useState();
  const handleOpen = () => setOpenModal(true);
  const user = useSelector(state => state.user)

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const showEditModal = (event) => {
    event.stopPropagation()
    handleOpen()
  };

  const handleClickOpen = (event) => {
    event.stopPropagation()
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false)
  };

  const deleteActivity = async (id, e) => {

    const res = await instance.delete(`activities/${id}`)

    if (res.data.status === "success"){
      setOpenAlert(true)
      handleCloseDialog()
      dispatch(removeActivity({activityId: id}))
      dispatch(deleteEvent({activityId: id}))
    }
  };

  const cloneActivity = async (value) => {

    const res = await instance.get(`activities/${value.id}/clone`)
    .then((res)=> {
      dispatch(addActivity({activity: res.data.clonedActivity}))
   })
  };

  const transferActivity =  (value) => {
    setOpenTransferModal(true)
    setActivityObj(value)
  };

  return (
    <>
      <Draggable draggableId={activity.id.toString()} index={index} key={activity.id.toString()}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >

            <Card sx={{  width: "90%", }}>
              <CardContent>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                    {moment(activity.created_at).format("MMMM Do YYYY")}
                  </Typography>

                  <IconButton 
                    aria-label="settings"
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    <MoreVert />
                  </IconButton>

                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={showEditModal}> <EditOutlined /> Edit</MenuItem>
                    <MenuItem onClick={()=>cloneActivity(activity)} disabled={(activity.user_id !== user.id) && (activity.status === "private") }><CopyAllOutlined /> Clone</MenuItem>
                    <MenuItem onClick={()=>transferActivity(activity)} ><MoveUpOutlined /> Transfer</MenuItem>
                    <MenuItem onClick={handleClickOpen}><DeleteOutlined /> Delete</MenuItem>
                    <MenuItem onClick={() => navigate(`/activities/${activity.id}`)}><ViewListOutlined /> View</MenuItem>
                  </Menu>
                </div>
              
                <Typography sx={{ mb: 0.5 }} color="text.primary">
                  <b>{activity.label}</b>
                </Typography>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <Typography variant="body2">
                    {activity.description}
                  </Typography>
                  {showIcon(activity.type)}
                </div>
                <Typography sx={{ fontSize: 14, mb: -2, color: "blue" }} >
                    ${activity.earningEstimate}
                </Typography>
              </CardContent>
            </Card>
            <br></br>
          </div>
        )}
      </Draggable>

      <ActivityModal
       open={openModal}
       setOpen={setOpenModal}
       editMode={true}
       activity={activity}
      />

      <ActivityTransferModal
        open={openTransferModal}
        setOpen={setOpenTransferModal}
        activity={activityObj}
      />

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
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
          <Button onClick={handleCloseDialog}>No</Button>
          <Button onClick={(e) => deleteActivity(activity.id, e)} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Activity deleted successfully
        </Alert>
      </Snackbar>
    </>
  )
}

export default ActivityItem