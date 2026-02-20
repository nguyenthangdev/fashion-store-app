/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailArticleCategoryAPI } from '~/apis/admin/articleCategory.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { ArticleCategoryInfoInterface } from '~/interfaces/articleCategory.interface'

export const useDetail = () => {
  const [articleCategoryDetail, setArticleCategoryDetail] = useState<ArticleCategoryInfoInterface | null>(null)
  const params = useParams()
  const id = params.id
  const { role } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchDetailArticleCategoryAPI(id)
        setArticleCategoryDetail(res.articleCategory)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi khi tải dữ liệu danh mục bài viết!', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dispatchAlert, id])

  return {
    articleCategoryDetail,
    id,
    role,
    isLoading,
    navigate
  }
}