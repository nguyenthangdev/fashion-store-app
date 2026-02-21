/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailOrderAPI, fetchEditEstimatedConfirmedDay, fetchEditEstimatedDeliveryDay } from '~/apis/admin/order.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { OrderInfoInterface } from '~/interfaces/order.interface'

export const useDetail = () => {
  const [orderDetail, setOrderDetail] = useState<OrderInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { role } = useAuth()
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const res = await fetchDetailOrderAPI(id)
        setOrderDetail(res.order)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi khi tải dữ liệu đơn hàng!', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dispatchAlert, id])

  const handleSubmitDeliveryDay = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!orderDetail || !id) return
    const estimatedDeliveryDay = e.currentTarget.estimatedDeliveryDay.value

    if (!estimatedDeliveryDay) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Vui lòng chọn ngày giao hàng', severity: 'error' } })
      return
    }
    const response = await fetchEditEstimatedDeliveryDay({ estimatedDeliveryDay, id })
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOrderDetail({ ...orderDetail, estimatedDeliveryDay: estimatedDeliveryDay })
    }
  }

  const handleSubmitConfirmedDay = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!orderDetail || !id) return
    const estimatedConfirmedDay = e.currentTarget.estimatedConfirmedDay.value

    if (!estimatedConfirmedDay) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Vui lòng chọn ngày nhận hàng', severity: 'error' } })
      return
    }

    const response = await fetchEditEstimatedConfirmedDay({ estimatedConfirmedDay, id })
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOrderDetail({ ...orderDetail, estimatedConfirmedDay: estimatedConfirmedDay })
    }
  }

  return {
    orderDetail,
    id,
    role,
    handleSubmitConfirmedDay,
    handleSubmitDeliveryDay,
    navigate,
    isLoading
  }
}