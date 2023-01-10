import { Box, Button, InputLabel, Modal, Select, TextField, Typography, MenuItem, Snackbar, OutlinedInput, Switch, FormControlLabel, Chip } from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { MuiPickersUtilsProvider, DateTimePicker, KeyboardDateTimePicker, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import instance from '../../services/fetchApi';
import { addEvent, updateEvent } from '../../features/EventSlice';
import { CloseOutlined } from '@mui/icons-material';
import { addEventToActivity } from '../../features/ActivitySlice';
import { addMeeting, setUpdateMeeting } from '../../features/MeetingSlice';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const validationSchema = yup.object({
  meetingName: yup
    .string('Enter your meeting name')
    .required('Meeting name is required'),
  meetingType: yup
    .string('Enter your type')
    .required('Type is required'),
  maxUsers: yup
    .number('Enter your max users')
    .required('Max is required'),
  // start: yup
  //   .string('Enter your start time')
  //   .required('Start time is required'),
  // end: yup
  //   .string('Enter your end time')
  //   .required('End time is required'),
});

const generateMeetingId = () => {
  let meetingID = "";
  const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  const maxPos = chars.length;

  for (let i = 0; i < 8; i++) {
    meetingID += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return meetingID;
}

const EditMeetingModal = ({ open, setOpen, meeting, user }) => {
  
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Event created successfully");
  const [showActivitySelect, setShowActivitySelect] = useState(false);

  const [oneOnOne, setOneOnOne] = useState(false);
  const [conference, setConference] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [usersValue, setUsersValue] = useState([]);
  const [usersValueSingle, setUsersValueSingle] = useState("");
  const [size, setSize] = useState(1);
  const [anyoneCanJoin, setAnyoneCanJoin] = useState(false);
  const [status, setStatus] = useState(false);

  const handleClose = () => {
    //closeModal()
    setOpen(false);
    setOneOnOne(false)
    setConference(false)
    setUsersValue([])
    setUsersValueSingle("")
    setSize(1)
    setStatus(false)
  }
  const dispatch = useDispatch()

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  useEffect(() => {
    if (meeting) {
      formik.setFieldValue('meetingName', meeting.meetingName)
      formik.setFieldValue('meetingDate', meeting.event.start)
     
      if ( meeting.meetingType === 'Anyone-can-join') {
        setConference(true)
        setAnyoneCanJoin(true)
        setSize(meeting.maxUsers)
      }
      if  ( meeting.meetingType === '1-on-1') {
        setOneOnOne(true)
        setUsersValueSingle(meeting.invitedUsers[0])
      }
      if ( meeting.meetingType === 'Conference') {
        setConference(true)
        setUsersValue(meeting.invitedUsers)
      }

      setStatus(meeting.status)

      fetchUsers()
    }
   }, [open, meeting])

   const editMeeting = async (body, id) => {
    let response 
     await instance.patch(`meetings/${id}`, body)
     .then((res) => {
       console.log(res);
      //  dispatch(addMeeting({meeting: res.data.meeting}))
      //response = res.data.meeting
      setOpenAlert(true);
      dispatch(setUpdateMeeting({meeting: res.data.meeting}))
      dispatch(updateEvent({event: res.data.meeting.event}))
      handleClose()
      formik.resetForm();
     })

     //return response
   }

  const formik = useFormik({
    initialValues: {
      meetingName: '',
      maxUsers: 1,
      meetingDate: ""
    },
    //validationSchema: validationSchema,
    onSubmit:  (values, {resetForm}) => {
     
      if (oneOnOne){
        let meetingBody = {
          meetingName: values.meetingName,
          meetingType: '1-on-1',
          invitedUsers: [usersValueSingle],
          meetingDate: moment(values.meetingDate).format("L"),
          eventStartDate: moment(values.meetingDate).format(),
          status: status,
        }

        editMeeting(meetingBody, meeting.id)
        //let res = editMeeting(meetingBody, meeting.id)

        // setOpenAlert(true);
        // dispatch(setUpdateMeeting({meeting: res.data.meeting}))
        // handleClose()
        // resetForm();
      } else if (conference) {
         let meetingBody = {
          meetingName: values.meetingName,
          meetingType: anyoneCanJoin ? 'Anyone-can-join' : 'Conference',
          invitedUsers: anyoneCanJoin ? [] : usersValue,
          meetingDate: moment(values.meetingDate).format("L"),
          eventStartDate: moment(values.meetingDate).format(),
          maxUsers: anyoneCanJoin ? size : usersValue.length,
          status: status,
        }

        editMeeting(meetingBody, meeting.id)

        // let res = editMeeting(meetingBody, meeting.id)
        // setOpenAlert(true);
        // dispatch(setUpdateMeeting({meeting: res.data.meeting}))
        // //dispatch(addEvent({event: res.data.event}))
        // handleClose()
        // resetForm();
      }
        

      // if (oneOnOne) {

      //   let meetingBody = {
      //     meetingName: values.meetingName,
      //     meetingType: '1-on-1',
      //     invitedUsers: [usersValueSingle],
      //     meetingDate: moment(values.meetingDate).format("L"),
      //     //status: true,
      //   }

      //   createMeeting(meetingBody)

      //   setOpenAlert(true);
      //   //dispatch(addEvent({event: res.data.event}))
      //   handleClose()
      //   resetForm();
      // } else if (conference) {
      //   let meetingBody = {
      //     meetingName: values.meetingName,
      //     meetingType: anyoneCanJoin ? 'Anyone-can-join' : 'Conference',
      //     invitedUsers: anyoneCanJoin ? [] : usersValue,
      //     meetingDate: moment(values.meetingDate).format("L"),
      //     maxUsers: anyoneCanJoin ? size : usersValue.length,
      //     //status: true,
      //   }

      //   createMeeting(meetingBody)

      //   setOpenAlert(true);
      //   //dispatch(addEvent({event: res.data.event}))
      //   handleClose()
      //   resetForm();

      // }
    },
  });

  const handleDateChange = (e) => {
    formik.setFieldValue('meetingDate', e)
  }

  const fetchUsers = async () => {
    //e.preventDefault()
    await instance.get(`users`)
    .then((res) => {
      console.log(res);
      setAllUsers(res.data.users)
    })
  }

  const handleChangeValueSingle =  (event) => {
   
    setUsersValueSingle(event.target.value)
  }

  const handleChangeValue =  (event) => {
    const {
      target: { value },
    } = event;
   
    setUsersValue(typeof value === 'string' ? value.split(',') : value)
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <Typography variant='h6' style={{marginBottom: "10px"}}>
          Edit Meeting
            </Typography>

            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                value={formik.values.meetingDate}
                onChange={handleDateChange}
                TextFieldComponent={
                  (params) => (
                    <TextField
                      // error={Boolean(formik.touched.meetingDate && formik.errors.meetingDate)}
                      // helperText={formik.touched.meetingDate && formik.errors.meetingDate}
                      label="Date"
                      size='small'
                      margin="normal"
                      name="meetingDate"
                      variant="standard"
                      fullWidth
                      {...params}
                      />
                  )
                }
              />
            </MuiPickersUtilsProvider>

            <div style={{display: "flex", justifyContent: "space-between"}}>
              <Button 
                size='small' 
                style={{border: oneOnOne ? "4px solid #EE82EE" : null }}
                onClick={(e) => {
                  setOneOnOne(true);
                  setConference(false)
                }}
              >
                1 On-1Meeting
              </Button>

              <Button 
                style={{border: conference ? "4px solid #EE82EE" : null }}
                size='small' 
                onClick={(e)=>{
                  setConference(true)
                  setOneOnOne(false);
                }}
              >
                Conference
              </Button>
            </div>

            <FormControlLabel
              control={ 
                <Switch
                  checked={status}
                  onChange={(event) => setStatus(event.target.checked)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              } 
              label="Status" 
            />
            <p></p>

            {
              oneOnOne &&
              <>
                <TextField
                  size='small'
                  fullWidth
                  id="meetingName"
                  name="meetingName"
                  label="meetingName"
                  value={formik.values.meetingName}
                  onChange={formik.handleChange}
                  error={formik.touched.meetingName && Boolean(formik.errors.meetingName)}
                  helperText={formik.touched.meetingName && formik.errors.meetingName}
                />
                <p></p>

                
                <InputLabel id="demo-select-small">Select User</InputLabel>
                <Select
                  name="user"
                  label="User"
                  size='small'
                  fullWidth
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={usersValueSingle}
                  onChange={handleChangeValueSingle}
                  input={<OutlinedInput label="Name" />}
                  //MenuProps={MenuProps}
                >
                  {
                    allUsers?.filter((a) => a.id !== user.id).map((a, i) => (
                      <MenuItem value={a.email} key={i}>{a.name}</MenuItem>
                    ))
                  }
                </Select>
                <p></p>
                

              </>
            }

            {
              conference && 
              <>
                <FormControlLabel
                  control={ 
                    <Switch
                      checked={anyoneCanJoin}
                      onChange={(event) => setAnyoneCanJoin(event.target.checked)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  } 
                  label="Anyone can join" 
                />
                <p></p>

                <TextField
                  size='small'
                  fullWidth
                  id="meetingName"
                  name="meetingName"
                  label="Meeting Name"
                  value={formik.values.meetingName}
                  onChange={formik.handleChange}
                  error={formik.touched.meetingName && Boolean(formik.errors.meetingName)}
                  helperText={formik.touched.meetingName && formik.errors.meetingName}
                />
                <p></p>

                {
                  anyoneCanJoin ?
                  <>
                    <TextField 
                      type="number"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}   
                      label="Size"
                      size='small'
                      fullWidth
                      value={size}
                      onChange={(e)=> setSize(parseInt(e.target.value))}
                    />
                    <p></p>
                  </> :
                  <>
                    <InputLabel id="demo-select-small">Select User</InputLabel>
                    <Select
                      name="user"
                      label="User"
                      size='small'
                      fullWidth
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      multiple
                      value={usersValue}
                      onChange={handleChangeValue}
                      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {
                        allUsers?.filter((a) => a.id !== user.id).map((a, i) => (
                          <MenuItem value={a.email} key={i}>{a.name}</MenuItem>
                        ))
                      }
                    </Select>
                    <p></p>
                  </>
                }
                

              </>
            }


              <p></p>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <Button size='small' color="primary" variant="contained"  type="submit" style={{borderRadius: "30px"}} >
               Add
              </Button>

              <Button 
                size='small' 
                color="error" 
                variant="contained" 
                onClick={() => {
                  handleClose()
                  formik.resetForm()
                }}
                style={{borderRadius: "30px"}}
              >
                Cancel
              </Button>
            </div>
          
          </form>
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

export default EditMeetingModal