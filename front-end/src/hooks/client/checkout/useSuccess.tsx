/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchSuccessAPI } from '~/apis/client/checkout.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { OrderInfoInterface } from '~/interfaces/order.interface'

const useSuccess = () => {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<OrderInfoInterface | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    if (!orderId) return

    setIsLoading(true)
    const fetchData = async () => {
      try {
        const res = await fetchSuccessAPI(orderId)
        setOrder(res.order)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi đơn hàng!', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dispatchAlert, orderId])

  return {
    order,
    isLoading
  }
}

export default useSuccess