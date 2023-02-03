import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  openViewInvoiceModal: false,
  singleInvoice: undefined,
  invoices: undefined,
  sortOption: "all"
}

export const InvoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setOpenViewInvoiceModal: (state, action) => {
      state.openViewInvoiceModal = action.payload.value
    },
    setInvoice: (state, action) => {
      state.singleInvoice = action.payload.invoice
    },
    addProductItemToInvoice: (state, action) => {
      state.singleInvoice.products = [... state.singleInvoice.products, action.payload.product]
    },
    updateInvoiceProduct: (state, action) => {
      let idx = state.singleInvoice.products.findIndex((a) => a.id === action.payload.product.id)
      state.singleInvoice.products[idx] = action.payload.product
    },
    removeInvoiceProductItem: (state, action) => {
      state.singleInvoice.products = state.singleInvoice.products.filter((a) => a.id !== action.payload.id)
    },
    setAllInvoices: (state, action) => {
      state.invoices = action.payload.invoices
    },
    setSortOptionValue: (state, action) => {
      state.sortOption = action.payload.option
    },
    updateInvoice: (state, action) => {
      let idx = state.invoices.data.findIndex((a) => a.id === action.payload.invoice.id)
      state.invoices.data[idx] = action.payload.invoice
    },
  },
})

export const { 
  setOpenViewInvoiceModal,
  setInvoice,
  addProductItemToInvoice,
  updateInvoiceProduct,
  removeInvoiceProductItem,
  setAllInvoices,
  setSortOptionValue,
  updateInvoice
} = InvoiceSlice.actions

export default InvoiceSlice.reducer