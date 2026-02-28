/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react'
import { fetchCartAPI, fetchAddProductToCartAPI } from '~/apis/client/cart.api'
import type { CartInfoInterface } from '~/interfaces/cart.interface'
import { useAlertContext } from '~/contexts/alert/AlertContext'

interface CartContextType {
 cartDetail: CartInfoInterface | null
 addToCart: (
    productId: string,
    quantity: number,
    color?: string | null,
    size?: string | null
  ) => Promise<void>
 refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartClientProvider = ({ children }: { children: ReactNode }) => {
  const [cartDetail, setCartDetail] = useState<CartInfoInterface | null>(null)
  const { dispatchAlert } = useAlertContext()

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetchCartAPI()
      setCartDetail(res.cartDetail)
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Lỗi khi fetch giỏ hàng', severity: 'error' }
      })
      setCartDetail(null)
    }
  }, [dispatchAlert])

  const addToCart = async (
    productId: string,
    quantity: number,
    color?: string | null,
    size?: string | null
  ) => {
    await fetchAddProductToCartAPI(productId, quantity, color, size)
    await refreshCart() // Cập nhật lại giỏ hàng để hiển thị thay đổi
  }

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  return (
    <CartContext.Provider value={{ cartDetail, addToCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart phải dùng trong CartProvider')
  return context
}