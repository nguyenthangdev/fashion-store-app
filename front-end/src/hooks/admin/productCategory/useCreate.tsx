import { useState, useEffect, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateProductCategoryAPI } from '~/apis/admin/productCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProductCategorySchema, type CreateProductCategoryFormData } from '~/validations/admin/productCategory.validation'
import { singleFileValidator } from '~/validations/validators/validators'

export const useCreate = () => {
  const { stateProductCategory } = useProductCategoryContext()
  const { dispatchAlert } = useAlertContext()
  const { allProductCategories } = stateProductCategory
  const { role } = useAuth()
  const navigate = useNavigate()

  // const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<CreateProductCategoryFormData>({
    resolver: zodResolver(createProductCategorySchema),
    defaultValues: {
      title: '',
      parent_id: '',
      description: '',
      status: 'ACTIVE',
      thumbnail: null
    }
  })

  // Cleanup blob URL khi unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

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
    setPreview(imageUrl)
    setValue('thumbnail', file)
  }

  const onSubmit = async (data: CreateProductCategoryFormData) => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('parent_id', data.parent_id || '')
    formData.append('description', data.description || '')
    formData.append('status', data.status)
    formData.append('thumbnail', data.thumbnail)

    const response = await fetchCreateProductCategoryAPI(formData)

    if (response.code === 201) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/products-category')
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
    allProductCategories,
    // uploadImageInputRef,
    preview,
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