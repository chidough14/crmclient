import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
}

export const ProductSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.products
    }
  },
})

export const { 
  setProducts
} = ProductSlice.actions

export default ProductSlice.reducer