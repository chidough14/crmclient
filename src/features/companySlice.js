import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  companies: [],
  company: undefined
}

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompany: (state, action) => {
      state.companies = action.payload.companies
    },
    setSingleCompany: (state, action) => {
      state.company = action.payload.company
    },
    addActivityToCompany: (state, action) => {
      state.company.activities = [...state.company.activities, action.payload.activity]
    },
    emptyCompanyObject: (state, action) => {
      state.company = undefined
    },
  },
})

export const { setCompany, setSingleCompany, addActivityToCompany, emptyCompanyObject } = companySlice.actions

export default companySlice.reducer