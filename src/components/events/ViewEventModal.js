import { Box, Button, InputLabel, Modal, Select, TextField, Typography, MenuItem, Snackbar, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { MuiPickersUtilsProvider, DateTimePicker, KeyboardDateTimePicker, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import instance from '../../services/fetchApi';
import { deleteEvent, updateEvent } from '../../features/EventSlice';
import { CloseOutlined, DeleteOutlined, EditOutlined } from '@mui/icons-material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 440,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const validationSchema = yup.object({
  title: yup
    .string('Enter your title')
    .required('Title is required'),
  description: yup
    .string('Enter your description')
    .required('Description is required'),
  start: yup
    .string('Enter your start time')
    .required('Start time is required'),
  end: yup
    .string('Enter your end time')
    .required('End time is required'),
});

const ViewEventModal = ({ open, setOpen, event, relatedActivity }) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showActivitySelect, setShowActivitySelect] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch()

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };
  useEffect(() => {
 
  }, [open])

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      start: "",
      end: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values, {resetForm}) => {
      console.log(values);
      let body = {
        ...values,
        start: moment(values.start).format(),
        end: moment(values.end).format()
      }

      await instance.patch(`events/${event.id}`, body)
      .then((res) => {
        setOpenAlert(true)
        setAlertMessage("Event updated successfully")
        dispatch(updateEvent({event: res.data.event}))
        handleClose()
        resetForm();
      });
    },
  });

  const handleClose = () => {
    setOpen(false)
    setShowEditForm(false)
  }

  const handleDateChange = (e) => {
    formik.setFieldValue('start', e)
  }

  const handleEndDateChange = (e) => {
    formik.setFieldValue('end', e)
  }

  const editEvent = (event) => {
    setShowEditForm(true)

    formik.setFieldValue('title', event.title)
    formik.setFieldValue('description', event.description)
    formik.setFieldValue('start', event.start)
    formik.setFieldValue('end', event.end)
  }

  const removeEvent = async (event) => {

    const res = await instance.delete(`events/${event.id}`)

    if (res.data.status === "success"){
      //dispatch(showAlert())
      setOpenAlert(true)
      setAlertMessage("Event deleted successfully")
      dispatch(deleteEvent({eventId: event.id}))
      setOpenDialog(false)
      handleClose()
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>

          {
            showEditForm ? (
              <form onSubmit={formik.handleSubmit}>
                <Typography variant='h6' style={{marginBottom: "10px"}}>
                Edit Event
                </Typography>
                <TextField
                  required
                  size='small'
                  fullWidth
                  id="title"
                  name="title"
                  label="Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
                <p></p>
                <TextField
                  required
                  size='small'
                  fullWidth
                  id="description"
                  name="description"
                  label="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
    
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DateTimePicker
                    value={formik.values.start}
                    onChange={handleDateChange}
                    TextFieldComponent={
                      (params) => (
                        <TextField
                          error={Boolean(formik.touched.start && formik.errors.start)}
                          helperText={formik.touched.start && formik.errors.start}
                          label="Start"
                          size='small'
                          margin="normal"
                          name="start"
                          variant="standard"
                          fullWidth
                          {...params}
                          />
                      )
                    }
                  />
    
                  <DateTimePicker
                    value={formik.values.end}
                    onChange={handleEndDateChange}
                    TextFieldComponent={
                      (params) => (
                        <TextField
                          error={Boolean(formik.touched.end && formik.errors.end)}
                          helperText={formik.touched.end && formik.errors.end}
                          label="End"
                          margin="normal"
                          size='small'
                          name="end"
                          variant="standard"
                          fullWidth
                          {...params}
                          />
                      )
                    }
                  />
                </MuiPickersUtilsProvider>
                
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <Button size='small' color="primary" variant="contained"  type="submit">
                  Save
                  </Button>
    
                  <Button 
                    size='small' 
                    color="error" 
                    variant="contained" 
                    onClick={() => {
                      handleClose()
                      formik.resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              
              </form>
            ) : (
              <>
              <div style={{display: "flex", float: "right"}}>
              <Tooltip title="Edit" placement="top">
                  <EditOutlined
                    onClick={() => editEvent(event)}
                    style={{cursor: "pointer"}}
                  />
                </Tooltip>

                <Tooltip title="Delete" placement="top">
                  <DeleteOutlined
                    onClick={() => setOpenDialog(true)}
                    style={{cursor: "pointer"}}
                  />
                </Tooltip>
              </div>
              <Typography variant="h7" display="block"  gutterBottom>
                <b>Title</b> : {event?.title}
              </Typography>

              <Typography variant="h7" display="block"  gutterBottom>
                <b>Description</b> : {event?.description}
              </Typography>

              <Typography variant="h7" display="block"  gutterBottom>
                <b>Start</b> : {moment(event?.start).format("dddd, MMMM Do YYYY, h:mm:ss a")}  
              </Typography>

              <Typography variant="h7" display="block"  gutterBottom>
                <b>End</b> : {moment(event?.end).format("dddd, MMMM Do YYYY, h:mm:ss a")}  
              </Typography>

              {
                relatedActivity && (
                  <Typography variant="h7" display="block"  gutterBottom>
                    <b>Related Activity</b> : {relatedActivity?.label}  
                  </Typography>
                )
              }

              <div style={{display: "flex", float: "right"}}>

                <Button 
                  size='small' 
                  color="error" 
                  variant="contained" 
                  onClick={() => {
                    handleClose()
                  }}
                >
                  Close
                </Button>
              </div>
              </>
            )

          }
         
         <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Delete Event
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this list ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>No</Button>
              <Button onClick={() => removeEvent(event)} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
         

         
        </Box>
      </Modal>

      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ViewEventModal