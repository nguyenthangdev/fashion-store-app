/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailProductCategoryAPI } from '~/apis/admin/productCategory.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { ProductCategoryInfoInterface } from '~/interfaces/productCategory.interface'

export const useDetail = () => {
  const [productCategoryDetail, setProductCategoryDetail] = useState<ProductCategoryInfoInterface | null>(null)
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
        const res = await fetchDetailProductCategoryAPI(id)
        setProductCategoryDetail(res.productCategory)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi khi tải dữ liệu danh mục sản phẩm!', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dispatchAlert, id])

  return {
    productCategoryDetail,
    id,
    role,
    navigate,
    isLoading
  }
}