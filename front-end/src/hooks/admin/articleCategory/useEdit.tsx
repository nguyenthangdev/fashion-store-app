/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchDetailArticleCategoryAPI, fetchEditArticleCategoryAPI } from '~/apis/admin/articleCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategoryContext'
import type { ArticleCategoryDetailInterface } from '~/interfaces/articleCategory.interface'
import { useAuth } from '~/contexts/admin/AuthContext'
import { editArticleCategorySchema, type EditArticleCategoryFormData } from '~/validations/admin/articleCategory.validation'
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

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    trigger
  } = useForm<EditArticleCategoryFormData>({
    resolver: zodResolver(editArticleCategorySchema),
    defaultValues: {
      title: '',
      parent_id: '',
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
        const res = await fetchDetailArticleCategoryAPI(id)
        const articleCategory = res.articleCategory

        reset({
          title: articleCategory.title,
          parent_id: String(articleCategory.parent_id),
          descriptionShort: articleCategory.descriptionShort,
          descriptionDetail: articleCategory.descriptionDetail,
          status: articleCategory.status,
          thumbnail: articleCategory.thumbnail
        })

        setThumbnailPreview(articleCategory.thumbnail || null)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: {
            message: 'Không thể tải thông tin danh mục. Vui lòng thử lại!',
            severity: 'error'
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, reset, dispatchAlert])

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

  const onSubmit = async (data: EditArticleCategoryFormData): Promise<void> => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('parent_id', data.parent_id || '')
    formData.append('descriptionShort', data.descriptionShort || '')
    formData.append('descriptionDetail', data.descriptionDetail || '')
    formData.append('status', data.status)

    // Chỉ append file nếu có upload mới
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile)
    } else if (data.thumbnail) {
      // Giữ URL ảnh cũ
      formData.append('thumbnail', data.thumbnail)
    }

    const response = await fetchEditArticleCategoryAPI(id, formData)

    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate(`/admin/articles-category/detail/${id}`)
      }, 2000)
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }

  return {
    isLoading,
    allArticleCategories,
    uploadImageInputRef,
    thumbnailPreview,
    handleThumbnailChange,
    handleClick,
    handleSubmit,
    onSubmit,
    role,
    // React Hook Form
    register,
    errors,
    isSubmitting,
    setValue,
    watch,
    navigate
  }
}