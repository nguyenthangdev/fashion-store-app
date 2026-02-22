/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailUserAPI, fetchEditUserAPI } from '~/apis/admin/user.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { UserAPIResponse } from '~/interfaces/user.interface'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editUserSchema, type EditUserFormData } from '~/validations/admin/user.validation'
import { singleFileValidator } from '~/validations/validators/validators'

const useEdit = () => {
  // const [userInfo, setUserInfo] = useState<UserInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      status: 'ACTIVE'
    }
  })
  const watchedStatus = watch('status')
  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetchDetailUserAPI(id)
        const user = response.accountUser
        reset({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          status: user.status,
          password: ''
        })
        setPreview(user.avatar)

      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: {
            message: 'Không thể tải thông tin tài khoản. Vui lòng thử lại!',
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
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
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

    setValue('avatar', file)
    setPreview(imageUrl)
  }
  const onSubmit = async (data: EditUserFormData) => {
    if (!id) return

    try {
      const formData = new FormData()

      formData.append('fullName', data.fullName)
      formData.append('email', data.email)
      formData.append('status', data.status)
      if (data.address && data.address.trim() !== '') {
        formData.append('address', data.address)
      }
      if (data.phone && data.phone.trim() !== '') {
        formData.append('phone', data.phone)
      }

      if (data.password && data.password.trim() !== '') {
        formData.append('password', data.password)
      }

      if (data.avatar instanceof File) {
        formData.append('avatar', data.avatar)
      }

      const response = await fetchEditUserAPI(id, formData)

      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => navigate(`/admin/users/detail/${id}`), 1500)
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message || 'Cập nhật thất bại', severity: 'error' }
        })
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: {
          message: 'Đã có lỗi xảy ra. Vui lòng thử lại!',
          severity: 'error'
        }
      })
    }
  }

  return {
    role,
    isLoading,
    register,
    handleSubmit,
    errors,
    watchedStatus,
    handleImageChange,
    onSubmit,
    preview,
    isSubmitting,
    navigate
  }
}

export default useEdit