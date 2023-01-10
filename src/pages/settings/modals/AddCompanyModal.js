import { Box, Button, InputLabel, Modal, Select, TextField, Typography, MenuItem, Snackbar } from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

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
  name: yup
    .string('Enter your name')
    .required('Name is required'),
  description: yup
    .string('Enter your description')
    .required('Description is required'),
});

const AddCompanyModal = ({open, setOpen}) => {
  const handleClose = () => setOpen(false);
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      type: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, {resetForm}) => {

      
    },
  });

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
               Add Company
              </Typography>
              <TextField
                required
                size='small'
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
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
              <p></p>
              <InputLabel id="demo-select-small">Type</InputLabel>
              <Select
                id='type'
                name="type"
                label="Type"
                size='small'
                fullWidth
                value={formik.values.type}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="public">Public</MenuItem>
              </Select>
              <p></p>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <Button size='small' color="primary" variant="contained"  type="submit" style={{borderRadius: "30px"}}>
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

    </>
  )
}

export default AddCompanyModal