import { Box, Button, InputLabel, Modal, Select, TextField, Typography, MenuItem, Snackbar, Autocomplete } from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { addActivity, editActivity } from '../../features/ActivitySlice';
import { addActivityToCompany, setCompany } from '../../features/companySlice';
import { setProducts } from '../../features/ProductSlice';
import instance from '../../services/fetchApi';
import SearchBar from '../SearchBar';

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


const AddProductToActivityModal = ({open, setOpen, setProductId, quantity, setQuantity, addProductToActivity, editMode, setEditMode}) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [companyId, setCompanyId] = useState();
  const [data, setData] = useState([]);
  const {products} = useSelector((state) => state.product)
  const dispatch = useDispatch()

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const handleClose = () => {
    setOpen(false)
    setProductId(undefined)
    setQuantity(0)
    setEditMode(false)
  }

  useEffect(() => {
  
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      await instance.get(`products`)
      .then((res) => {
        dispatch(setProducts({products: res.data.products}))
      })
    }

    if(open){
      fetchProducts()
    }
  }, [open])

  useEffect(()=> {
   
  }, [])

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
            !editMode &&
            <Autocomplete
              size='small'
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              options={data}
              getOptionLabel={(option) => option.name || ""}
              renderInput={(params) => (
                <TextField
                  size="small"
                  fullWidth
                  {...params}
                  label="Search And Select Product"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                  // style={{
                  //   backgroundColor: "white",
                  //   borderRadius: "20px",
                  //   width: "300px",
                  //   //height: "30px"
                  // }}
                />
              )}
              onInputChange={(e)=> {
                if(e.target.value.length === 3){
                  let dt = products.filter((a) => a.name.includes(e.target.value))
                  setData(dt)
                }
              }}
              onChange={(e, f)=> {
                console.log(f);
                setProductId(f.id)
              }}
              style={{
                display: "flex",
                alignSelf: "center",
                justifyContent: "center",
                flexDirection: "column",
                marginBottom: "30px"
                //padding: 10,
              }}
            />
          }
         

          <TextField
            required
            size='small'
            fullWidth
            id="quantity"
            name="quantity"
            label="Quantity"
            value={quantity}
            onChange={(e)=> setQuantity(e.target.value)}
          />
        

          <p></p>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <Button size='small' color="primary" variant="contained"  onClick={() => addProductToActivity()}>
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

      {/* <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar> */}
    </>
  )
}

export default AddProductToActivityModal