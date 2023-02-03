import {  SortOutlined } from '@mui/icons-material'
import {  Button, Snackbar, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ViewInvoiceModal from '../../components/invoice/ViewInvoiceModal'
import { setAllInvoices, setOpenViewInvoiceModal, setSortOptionValue } from '../../features/InvoiceSlice'
import instance from '../../services/fetchApi'
import OrdersTable from './OrdersTable'
import SortButton from './SortButton'
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Orders = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [invoiceDetails, setInvoiceDetails] = useState(false)
  const { invoices, sortOption } = useSelector(state => state.invoice)
  const user = useSelector(state => state.user)
  const [company, setCompany] = useState()
  const [openAlert, setOpenAlert] = useState(false)
  const [severity, setSeverity] = useState("")
  const [text, setText] = useState("")

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  const showAlert = (txt) => {
    setOpenAlert(true)
    setSeverity("error")
    setText(txt)
  }

  const getInvoices = async (page = 1) => {
    setLoading(true)
    await instance.get(`invoices?page=${page}`)
    .then((res) => {
      dispatch(setAllInvoices({invoices: res.data.invoices}))
      setLoading(false)
    })
    .catch(()=> {
      showAlert("Ooops an error was encountered")
    })
  }

  const getSortedInvoices = async (option, page = 1) => {
    setLoading(true)
    await instance.get(`filter-invoices/${option}?page=${page}`)
    .then((res) => {
      dispatch(setAllInvoices({invoices: res.data.invoices}))
      setLoading(false)
    })
    .catch(()=> {
      showAlert("Ooops an error was encountered")
    })
  }

  const viewInvoice = async (value) => {
    setInvoiceDetails(value)
    dispatch(setOpenViewInvoiceModal({value: true}))

    await instance.get(`companies/${value.activity.company_id}`)
    .then((res) => {
      setCompany(res.data.company)
    })
    .catch(()=> {
      showAlert("Ooops an error was encountered")
    })
  }

  useEffect(() => {
    if (sortOption === "all") {
      getInvoices()
    } else {
      getSortedInvoices(sortOption)
    }
  }, [sortOption])

  const setSortOption =  (value) => {
    dispatch(setSortOptionValue({option: value}))
  }

  return (
    <div>
      <Toolbar>
        <Typography variant='h5'  component="div" sx={{ flexGrow: 2 }} >My Orders</Typography>

        <SortButton setSortOption={setSortOption} sortOption={sortOption} title="Sort Invoices" />
    
      </Toolbar>

      <OrdersTable 
        invoices={invoices} 
        getInvoices={getInvoices}
        viewInvoice={viewInvoice}
        getSortedInvoices={getSortedInvoices}
        sortOption={sortOption}
        loading={loading}
      />
    


      <ViewInvoiceModal
        invoice={invoiceDetails}
        companyName={company?.name}
        activity={invoiceDetails?.activity}
        user={user}
      />


      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
          { text }
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Orders