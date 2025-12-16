/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchProductAPI } from '~/apis/admin/product.api'
import { initialState } from '~/reducers/admin/productReducer'
import { productReducer } from '~/reducers/admin/productReducer'
import type { AllParams } from '~/types/helper.type'
import type { ProductActions, ProductAPIResponse, ProductStates } from '~/types/product.type'

interface ProductContextType {
  stateProduct: ProductStates
  fetchProduct: (params?: AllParams) => Promise<void>
  dispatchProduct: React.Dispatch<ProductActions>
}

const ProductContext = createContext<ProductContextType | null>(null)

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateProduct, dispatchProduct] = useReducer(productReducer, initialState)

  const fetchProduct = useCallback(
    async (params: AllParams = {}) => {
      dispatchProduct({ type: 'SET_LOADING', payload: true })
      try {
        const res: ProductAPIResponse = await fetchProductAPI(params)
        dispatchProduct({
          type: 'SET_DATA',
          payload: {
            products: res.products,
            allProducts: res.allProducts,
            accounts: res.accounts,
            pagination: res.pagination,
            filterStatus: res.filterStatus,
            keyword: res.keyword,
            sortKey: params.sortKey || '',
            sortValue: params.sortValue || ''
          }
        })
      } finally {
        dispatchProduct({ type: 'SET_LOADING', payload: false })
      }
    }, [])

  return (
    <ProductContext.Provider value={{ stateProduct, fetchProduct, dispatchProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProductContext = () => {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProductContext must be used inside ProductProvider')
  return context
}