import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { addProductItemToInvoice, removeInvoiceProductItem, setInvoice, setOpenViewInvoiceModal, updateInvoiceProduct } from '../../features/InvoiceSlice';
import { DeleteOutlined, EditOutlined, PrintOutlined } from '@mui/icons-material';
import "./index.css"
import moment from 'moment';
import { useEffect, useState } from 'react';
import instance from '../../services/fetchApi';
import InvoiceForm from '../../pages/activities/InvoiceForm';
import InvoiceProductsTable from './InvoiceProductsTable';
import AddProductToInvoiceModal from './AddProductToInvoiceModal';
import { DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViewInvoiceModal = ({invoice, companyName}) => {
  const {openViewInvoiceModal} = useSelector((state) => state.invoice)
  const {singleInvoice} = useSelector((state) => state.invoice)
  const dispatch = useDispatch()
  const [total, setTotal] = useState(0)
  const [showEditForm, setShowEditForm] = useState(false)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [productId, setProductId] = useState(undefined)
  const [quantity, setQuantity] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [open, setOpen] = useState(false)
  // const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      await instance.get(`invoices/${invoice?.id}`)
      .then((res) => {
       
        let arr = []
        res.data.invoice?.products?.map((a) => {
           let tot = a.price * a.pivot.quantity
           arr.push(tot)
        })
        dispatch(setInvoice({invoice: res.data.invoice}))
        setTotal(arr.reduce((a, b) => a + b, 0))
      })
    }

   
    if(invoice?.id){
      fetchInvoiceDetails()
    }
  }, [invoice])

  const handleClose = () => {
    setShowEditForm(false)
    dispatch(setOpenViewInvoiceModal({value: false}))
  };

  const openForm = () => {
    setShowEditForm(true)
  };

  const handleCloseDialog = () => {
    setOpen(false)
  }
  
  const editItem = (value) => {
    setOpenAddModal(true)
    setEditMode(true)
    setQuantity(value.pivot.quantity)
    setProductId(value.id)
  };

  
  const deleteItem = (value) => {
    setOpen(true)
    setProductId(value.id)
  };

  const removeItem = async () => {
    await instance.delete(`invoices/${invoice?.id}/deleteProduct`, { data: {productId: productId}})
    .then((res) => {
   
      dispatch(removeInvoiceProductItem({id: productId}))
      setOpen(false)
      setProductId(undefined)
    
    })
  };

  const addProductToInvoice = async () => {
    
    let body = {
      productId: productId,
      quantity: parseInt(quantity)
    }
    await instance.post(`invoices/${invoice?.id}/addUpdateProduct`, body)
    .then((res) => {
      if (editMode) {
        dispatch(updateInvoiceProduct({product: res.data.product}))
      } else {
        dispatch(addProductItemToInvoice({product: res.data.product}))
      }

      setOpenAddModal(false)
      setEditMode(false)
      setQuantity(0)
      setProductId(undefined)
    
    })
  };

  return (
      <Dialog
        fullScreen
        open={openViewInvoiceModal}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <div style={{display: "flex", justifyContent: "space-between",margin: "30px"}}>
          <Typography variant='h6'></Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>

        {
          showEditForm ? (
            <div className="invoice-box" style={{width: "80%", marginTop: "-30px"}}>
              <Button size='small' color="secondary" variant="contained"   style={{borderRadius: "30px"}} onClick={()=> setShowEditForm(false)}>Close Form</Button>
              <InvoiceForm editMode={true} invoice={singleInvoice}/>
              
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant='h6'><b>Products</b></Typography>

                <Button variant="contained" size='small' style={{borderRadius: "30px"}} onClick={() => setOpenAddModal(true)}>Add Product</Button>
              </div>

              <InvoiceProductsTable
                products={singleInvoice?.products}
                editItem={editItem}
                deleteItem={deleteItem}
              />
             
            </div>
          ): (
          <div className="invoice-box" style={{width: "80%", marginTop: "-30px"}}>
            <table cellpadding="0" cellspacing="0">
              <tr className="top">
                <td colspan="4">
                  <table>
                    <tr>
                      <td className="title">
                        <img src="https://www.sparksuite.com/images/logo.png"  style={{width: "100%", maxWidth: "300px"}}/>
                      </td>

                      <td>
                        Invoice #: {singleInvoice?.invoice_no}<br />
                        Created: {moment(singleInvoice?.created_at).format('MMMM Do YYYY')}<br />
                        Due: February 5, 2023
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr className="information">
                <td colspan="4">
                  <table>
                    <tr>
                      <td>
                        Sparksuite, Inc.<br />
                        12345 Sunny Road<br />
                        Sunnyville, CA 12345
                      </td>

                      <td>
                        {companyName}<br />
                        {singleInvoice?.reference}<br />
                        john@example.com
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr className="heading">
                <td>Payment Method</td>
                <td></td>
                <td></td>

                <td style={{textAlign: "right"}}>Check #</td>
              </tr>

              <tr className="details">
                <td>{singleInvoice?.payment_method}</td>

                {/* <td>1000</td> */}
              </tr>

              <tr className="heading">
                <td>Item</td>

                <td>Price</td>

                <td style={{textAlign: "right"}}>Quantity</td>

                <td style={{textAlign: "right"}}>Amount</td>
              </tr>


              {
                singleInvoice?.products?.map((a, i) => (
                  <tr className="item" key={i}>
                    <td>{a.name}</td>
        
                    <td>${a.price}</td>
        
                    <td style={{textAlign: "right"}}>{a.pivot.quantity}</td>
                    <td style={{textAlign: "right"}}>{a.price * a.pivot.quantity}</td>
                  </tr>
                ))
              }

              <tr className="total">
                <td></td>
                <td></td>
                <td></td>

                <td style={{textAlign: "right"}}><b>Total:</b> ${total}</td>
              </tr>
            </table>

            <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "30px"}}>
              <Button 
                size='small' 
                color="primary" 
                variant="contained"   
                style={{borderRadius: "30px"}}
                onClick={()=> openForm()}
              >
                <EditOutlined />
              </Button>


              <Button size='small' color="secondary" variant="contained"   style={{borderRadius: "30px"}}>
                <PrintOutlined />
              </Button>
            </div>
          </div>
          )
        }

        <AddProductToInvoiceModal
          open={openAddModal}
          setOpen={setOpenAddModal}
          setProductId={setProductId}
          quantity={quantity}
          setQuantity={setQuantity}
          addProductToInvoice={addProductToInvoice}
          editMode={editMode}
          setEditMode={setEditMode}
          productsinInvoice={singleInvoice?.products}
        />

        <Dialog
          open={open}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
           Delete Product
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this product ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>No</Button>
            <Button onClick={removeItem} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
       
     
      </Dialog>
  );
}


export default ViewInvoiceModal