import { Box, Button, InputLabel, Modal, Select, TextField, Typography, MenuItem, Snackbar, List, ListItem, ListItemButton, ListItemIcon, Paper } from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import instance from '../../services/fetchApi';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  width: "100%",
  lineHeight: '60px',
}));

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
});

const AddCompanyToListModal = ({ open, setOpen, companyId}) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [listId, setListId] = useState(undefined);
  const [listWithCompanies, setListWithCompanies] = useState([]);
  const {lists} = useSelector((state) => state.list)
  const user = useSelector((state) => state.user)

  const dispatch = useDispatch()

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const handleClose = () => {
    setOpen(false)
    setListId(undefined)
  }

  const selectList = (list) => {
    setListId(list.id)
    
  }

  const addToList = async () => {
    
   await instance.post(`companies/${companyId}/lists`, {listId: listId})
   .then((res) => {
    handleClose()
    setOpenAlert(true)
   })
  }

  useEffect(() => {
    const getUserLists = async () => {
      await instance.get(`userListsAndCompanies`)
      .then((res) => {
       setListWithCompanies(res.data.lists)
      })
    }


    if(open) {
      getUserLists();
    }
  }, [open])

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
          
            <Typography variant='h6' style={{marginBottom: "10px"}}>
              Add Company To List
            </Typography>
          
            <List>
              {
                listWithCompanies?.map((list, i) => {
                  let ids = list.companies.map((a) => a.id)
                
                  if (ids.includes(parseInt(companyId))){

                  } else {
                    return (
                      <ListItemButton 
                        key={i} 
                        disablepadding="true"
                        style={{marginBottom: "10px", cursor: "pointer"}}
                        onClick={() => selectList(list)}
                        disabled={list.id === listId}
                      >
                        <Item elevation={4} >
                          {list.name}
                        </Item>
                      </ListItemButton>
                    )
                  }
                 
                })
              }
            </List>
            <p></p>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <Button 
                size='small' 
                color="primary" 
                variant="contained"  
                type="submit"
                onClick={() => {
                  addToList()
                }}
              >
                Add
              </Button>

              <Button 
                size='small' 
                color="error" 
                variant="contained" 
                onClick={() => {
                  handleClose()
                }}
              >
                Cancel
              </Button>
            </div>

        </Box>
      </Modal>

      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Company added to list
        </Alert>
      </Snackbar>
    </>
  )
}

export default AddCompanyToListModal