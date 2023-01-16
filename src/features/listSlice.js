import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  lists: [],
  openAlert: false,
  list: undefined,
  selectedCompanyId: undefined,
  loadingCompanies: false
}

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setLists: (state, action) => {
      state.lists = action.payload.lists
    },
    addList: (state, action) => {
      state.lists = [...state.lists, action.payload.list]
    },
    getSingleList: (state, action) => {
      state.list = state.lists.find((a) => a.id === action.payload.id)
    },
    removeCompanyFromList: (state, action) => {
      state.list.companies = state.list.companies.filter((a)=> a.id !== action.payload.companyId)
      state.selectedCompanyId = state.list.companies[0].id
    },
    setSingleList: (state, action) => {
      state.list = action.payload.list
    },
    updateList: (state, action) => {
      let idx
      idx = state.lists.findIndex((a) => a.id === action.payload.list.id)
      state.lists[idx] = action.payload.list
    },
    removeList: (state, action) => {
      state.lists = state.lists.filter((a) => a.id !== action.payload.listId)
    },
    showAlert: (state, action) => {
      state.openAlert = true
    },
    closeAlert: (state, action) => {
      state.openAlert = false
    },
    setSelectedCompanyId: (state, action) => {
      state.selectedCompanyId = action.payload.id
    },
    setLoadingCompanies: (state, action) => {
      state.loadingCompanies = action.payload.value
    },
  },
})

export const { 
  setLists,
  addList, 
  updateList, 
  removeList, 
  showAlert, 
  closeAlert, 
  getSingleList, 
  setSingleList,
  setSelectedCompanyId ,
  removeCompanyFromList,
  setLoadingCompanies
} = listSlice.actions

export default listSlice.reducer