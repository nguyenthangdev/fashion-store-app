/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailProductCategoryAPI, fetchEditProductCategoryAPI } from '~/apis/admin/productCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editProductCategorySchema, type EditProductCategoryFormData } from '~/validations/admin/productCategory.validation'
import { singleFileValidator } from '~/validations/validators/validators'

export const useEdit = () => {
  const params = useParams()
  const id = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const { stateProductCategory } = useProductCategoryContext()
  const { allProductCategories } = stateProductCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()

  // const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<EditProductCategoryFormData>({
    resolver: zodResolver(editProductCategorySchema),
    defaultValues: {
      title: '',
      parent_id: '',
      description: '',
      status: 'ACTIVE',
      thumbnail: null
    }
  })

  // Load data từ API
  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetchDetailProductCategoryAPI(id)
        const category = response.productCategory

        reset({
          title: category.title,
          parent_id: category.parent_id || '',
          description: category.description || '',
          status: category.status,
          thumbnail: category.thumbnail
        })

        setThumbnailPreview(category.thumbnail)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: {
            message: 'Không thể tải thông tin danh mục sản phẩm. Vui lòng thử lại!',
            severity: 'error'
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, reset, dispatchAlert])

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview)
      }
    }
  }, [thumbnailPreview])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
  }

  const onSubmit = async (data: EditProductCategoryFormData) => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('parent_id', data.parent_id || '')
    formData.append('description', data.description || '')
    formData.append('status', data.status)

    // Nếu có file mới, gửi file. Nếu không, giữ URL cũ
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile)
    } else if (data.thumbnail) {
      // Giữ URL ảnh cũ
      formData.append('thumbnail', data.thumbnail)
    }

    const response = await fetchEditProductCategoryAPI(id, formData)

    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate(`/admin/products-category/detail/${id}`)
      }, 2000)
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message || 'Có lỗi xảy ra', severity: 'error' }
      })
    }
  }

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault()
  //   uploadImageInputRef.current?.click()
  // }

  return {
    isLoading,
    allProductCategories,
    // uploadImageInputRef,
    thumbnailPreview,
    handleChange,
    handleSubmit,
    onSubmit,
    // handleClick,
    role,
    register,
    errors,
    isSubmitting,
    setValue,
    watch,
    navigate
  }
}