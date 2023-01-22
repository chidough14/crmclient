import {  SortOutlined } from '@mui/icons-material'
import {  Button, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ViewInvoiceModal from '../../components/invoice/ViewInvoiceModal'
import { setAllInvoices, setOpenViewInvoiceModal, setSortOptionValue } from '../../features/InvoiceSlice'
import instance from '../../services/fetchApi'
import OrdersTable from './OrdersTable'
import SortButton from './SortButton'

const Orders = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [invoiceDetails, setInvoiceDetails] = useState(false)
  const { invoices, sortOption } = useSelector(state => state.invoice)
  const user = useSelector(state => state.user)
  const [company, setCompany] = useState()

  const getInvoices = async (page = 1) => {
    setLoading(true)
    await instance.get(`invoices?page=${page}`)
    .then((res) => {
      dispatch(setAllInvoices({invoices: res.data.invoices}))
      setLoading(false)
    })
  }

  const getSortedInvoices = async (option, page = 1) => {
    setLoading(true)
    await instance.get(`filter-invoices/${option}?page=${page}`)
    .then((res) => {
      dispatch(setAllInvoices({invoices: res.data.invoices}))
      setLoading(false)
    })
  }

  const viewInvoice = async (value) => {
    setInvoiceDetails(value)
    dispatch(setOpenViewInvoiceModal({value: true}))

    await instance.get(`companies/${value.activity.company_id}`)
    .then((res) => {
      setCompany(res.data.company)
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
    </div>
  )
}

export default Orders