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
    }
  },
})

export const { setCompany, setSingleCompany } = companySlice.actions

export default companySlice.reducer