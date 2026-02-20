/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchDetailArticleAPI, fetchEditArticleAPI } from '~/apis/admin/article.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { editArticleSchema, type EditArticleFormData } from '~/validations/admin/article.validation'
import { singleFileValidator } from '~/validations/validators/validators'

export const useEdit = () => {
  const params = useParams()
  const id = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const { stateArticleCategory } = useArticleCategoryContext()
  const { allArticleCategories } = stateArticleCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()
  // const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
    // trigger
  } = useForm<EditArticleFormData>({
    resolver: zodResolver(editArticleSchema),
    defaultValues: {
      title: '',
      article_category_id: '',
      featured: '1',
      descriptionShort: '',
      descriptionDetail: '',
      status: 'ACTIVE',
      thumbnail: null
    }
  })

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchDetailArticleAPI(id)
        const article = res.article

        reset({
          title: article.title,
          article_category_id: String(article.article_category_id),
          featured: article.featured,
          descriptionShort: article.descriptionShort,
          descriptionDetail: article.descriptionDetail,
          status: article.status,
          thumbnail: article.thumbnail
        })

        setThumbnailPreview(article.thumbnail || null)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: {
            message: 'Không thể tải thông tin bài viết. Vui lòng thử lại!',
            severity: 'error'
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, reset, dispatchAlert])

  // Cleanup blob URL to prevent memory leak
  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview)
      }
    }
  }, [thumbnailPreview])

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] as File
    if (!file) return

    const newFile = {
      name: file?.name || '',
      size: file?.size || 0,
      type: file?.type || ''
    }
    const error = singleFileValidator(newFile)

    if (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: error, severity: 'error' }
      })
      return
    }

    const imageUrl = URL.createObjectURL(file)
    setThumbnailFile(file)
    setThumbnailPreview(imageUrl)
    setValue('thumbnail', file)
    // trigger('thumbnail')
  }

  const onSubmit = async (data: EditArticleFormData): Promise<void> => {
    if (!id) return
    try {
      const formData = new FormData()

      formData.append('title', data.title)
      formData.append('article_category_id', data.article_category_id)
      formData.append('featured', data.featured)
      formData.append('descriptionShort', data.descriptionShort || '')
      formData.append('descriptionDetail', data.descriptionDetail || '')
      formData.append('status', data.status)
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile)
      } else if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail)
      }

      const response = await fetchEditArticleAPI(id, formData)
      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => navigate(`/admin/articles/detail/${id}`), 2000)
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message || 'Cập nhật thất bại', severity: 'error' }
        })
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Đã có lỗi xảy ra. Vui lòng thử lại!', severity: 'error' }
      })
    }
  }

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault()
  //   uploadImageInputRef.current?.click()
  // }

  return {
    isLoading,
    allArticleCategories,
    thumbnailPreview,
    handleThumbnailChange,
    handleSubmit,
    role,
    register,
    errors,
    isSubmitting,
    setValue,
    watch,
    navigate,
    onSubmit
  }
}