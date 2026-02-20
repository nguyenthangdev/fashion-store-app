/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailArticleAPI } from '~/apis/admin/article.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { ArticleInfoInterface } from '~/interfaces/article.interface'

export const useDetail = () => {
  const [articleDetail, setArticleDetail] = useState<ArticleInfoInterface | null>(null)
  const params = useParams()
  const { role } = useAuth()
  const id = params.id
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetchDetailArticleAPI(id)
        setArticleDetail(response.article)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi khi tải dữ liệu bài viết!', severity: 'error' }
        })
        setArticleDetail(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dispatchAlert, id])

  return {
    articleDetail,
    id,
    role,
    isLoading,
    navigate
  }
}