/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailArticleAPI } from '~/apis/client/article.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { ArticleInfoInterface } from '~/interfaces/article.interface'

const useDetail = () => {
  const [articleDetail, setArticleDetail] = useState<ArticleInfoInterface | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const slugArticle = params.slugArticle as string
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    if (!slugArticle) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchDetailArticleAPI(slugArticle)
        setArticleDetail(res.article)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi khi tải dữ liệu bài viết!', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dispatchAlert, slugArticle])

  return {
    articleDetail,
    isLoading
  }
}

export default useDetail