import { Box, Button, InputLabel, Modal, Select, TextField, Typography, MenuItem, Snackbar } from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { MuiPickersUtilsProvider, DateTimePicker, KeyboardDateTimePicker, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import instance from '../../services/fetchApi';
import { addEvent } from '../../features/EventSlice';
import { CloseOutlined } from '@mui/icons-material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

const EventModal = ({ open, setOpen, startTime, endTime, activities, user}) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Event created successfully");
  const [showActivitySelect, setShowActivitySelect] = useState(false);

  const handleClose = () => setOpen(false);
  const dispatch = useDispatch()

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };
  useEffect(() => {
   if (startTime) {
    formik.setFieldValue('start', startTime)
    formik.setFieldValue('end', endTime)
   }
  }, [open,startTime, endTime])

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      start: "",
      end: "",
      activity: undefined
    },
    validationSchema: validationSchema,
    onSubmit: async (values, {resetForm}) => {
      console.log(moment(values.start).format(), moment(values.end).format());
      let body = {
        ...values,
        user_id: user.id,
        activity_id: values.activity ? values.activity : null,
        start: moment(values.start).format(),
        end: moment(values.end).format()
      }

      await instance.post(`events`, body)
      .then((res) => {
        setOpenAlert(true);
        dispatch(addEvent({event: res.data.event}))
        handleClose()
        resetForm();
      });
    },
  });

  const handleDateChange = (e) => {
    formik.setFieldValue('start', e)
  }

  const handleEndDateChange = (e) => {
    formik.setFieldValue('end', e)
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
            Add Event
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


            {
              showActivitySelect ? (
                <Button variant="text" onClick={() => setShowActivitySelect(false)}>Hide</Button>
              ) : (
                <Button variant="text" onClick={() => setShowActivitySelect(true)}>Link to Activity</Button>
              )
            }

            {
              showActivitySelect && (
                <>
                  <InputLabel id="demo-select-small">Related Activity</InputLabel>
                  <Select
                    id='activity'
                    name="activity"
                    label="Related Activity"
                    size='small'
                    fullWidth
                    value={formik.values.activity}
                    onChange={formik.handleChange}
                  >
                    {
                      activities.map((a, i) => (
                        <MenuItem value={a.id} key={i}>{a.label}</MenuItem>
                      ))
                    }
                  </Select>
                  <p></p>
                </>
              )
            }
            
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <Button size='small' color="primary" variant="contained"  type="submit">
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

export default EventModal