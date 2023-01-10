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
    },
    addProduct: (state, action) => {
      state.products = [...state.products, action.payload.product]
    },
    updateProduct: (state, action) => {
      let idx = state.products.findIndex((a) => a.id === action.payload.product.id)
      state.products[idx] = action.payload.product
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter((a) => a.id !== action.payload.productId)
    },
  },
})

export const { 
  setProducts,
  addProduct,
  updateProduct,
  removeProduct
} = ProductSlice.actions

export default ProductSlice.reducer