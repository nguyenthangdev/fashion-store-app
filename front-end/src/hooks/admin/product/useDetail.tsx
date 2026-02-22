/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailProductAPI } from '~/apis/admin/product.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { ProductInfoInterface } from '~/interfaces/product.interface'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { useAlertContext } from '~/contexts/alert/AlertContext'

export const useDetail = () => {
  const [productDetail, setProductDetail] = useState<ProductInfoInterface | null>(null)
  const params = useParams()
  const id = params.id
  const { role } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchDetailProductAPI(id)
        setProductDetail(res.product)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi khi tải dữ liệu sản phẩm!', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dispatchAlert, id])

  const renderStars = (average: number) => {
    const fullStars = Math.floor(average)
    const emptyStars = 5 - fullStars
    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => <FaStar key={`star-${i}`} />)}
        {Array.from({ length: emptyStars }, (_, i) => <FaRegStar key={`reg-star-${i}`} />)}
      </>
    )
  }

  return {
    productDetail,
    id,
    role,
    renderStars,
    navigate,
    isLoading
  }
}