import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  companies: [],
  company: undefined,
  searchResults: []
}

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload.companies
    },
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
    addCompany: (state, action) => {
      state.companies = [...state.companies, action.payload.company]
    },
    updateCompany: (state, action) => {
      let idx = state.companies.findIndex((a) => a.id === action.payload.company.id)
      state.companies[idx] = action.payload.company
    },
    removeCompany: (state, action) => {
      state.companies = state.companies.filter((a) => a.id !== action.payload.companyId)
    },
  },
})

export const { 
  setCompany, 
  setSingleCompany, 
  addActivityToCompany, 
  emptyCompanyObject,
  addCompany,
  updateCompany ,
  removeCompany,
  setSearchResults
} = companySlice.actions

export default companySlice.reducer