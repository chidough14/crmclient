import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activities: [],
  activity: undefined,
  openPrompt: false
}

export const ActivitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setActivities: (state, action) => {
      state.activities = action.payload.activities
    },
    addActivity: (state, action) => {
      state.activities = [...state.activities, action.payload.activity]
    },
    editActivity: (state, action) => {
      let idx
      idx = state.activities.findIndex((a) => a.id === action.payload.activity.id)
      state.activities[idx] = action.payload.activity
    },
    removeActivity: (state, action) => {
      state.activities = state.activities.filter((a) => a.id !== action.payload.activityId)
    },
    setSingleActivity: (state, action) => {
      state.activity = action.payload.activity
    },
    addEventToActivity: (state, action) => {
      state.activity.events = [...state.activity.events, action.payload.event]
    },
    updateActivityEvent: (state, action) => {
      let idx = state.activity.events.findIndex((a) => a.id === action.payload.event.id)
      state.activity.events[idx] = action.payload.event
    },
    deleteActivityEvent: (state, action) => {
      state.activity.events = state.activity.events.filter((a) => a.id !== action.payload.id)
    },
    addProductItemToActivity: (state, action) => {
      state.activity.products = [...state.activity.products, action.payload.product]
    },
    updateProductItem: (state, action) => {
      let idx = state.activity.products.findIndex((a) => a.id === action.payload.product.id)
      state.activity.products[idx] = action.payload.product
    },
    removeProductItem: (state, action) => {
      state.activity.products = state.activity.products.filter((a) => a.id !== action.payload.id)
    },
    setOpenPrompt: (state, action) => {
      state.openPrompt = action.payload.value
    },
    setClosePrompt: (state, action) => {
      state.openPrompt = action.payload.value
    },
    addInvoiceToActivity: (state, action) => {
      state.activity.invoices = [...state.activity.invoices, action.payload.invoice]
    },
    removeInvoiceFromActivity: (state, action) => {
      state.activity.invoices = state.activity.invoices.filter((a) => a.id !== action.payload.invoiceId)
    },
  },
})

export const { 
  setActivities,
  addActivity,
  editActivity,
  removeActivity,
  setSingleActivity,
  addProductItemToActivity,
  updateProductItem,
  removeProductItem,
  addEventToActivity,
  updateActivityEvent,
  deleteActivityEvent,
  setOpenPrompt,
  setClosePrompt,
  addInvoiceToActivity,
  removeInvoiceFromActivity
} = ActivitySlice.actions

export default ActivitySlice.reducer