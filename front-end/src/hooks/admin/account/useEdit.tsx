/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailAccountAPI, fetchEditAccountAPI, fetchRolesAPI } from '~/apis/admin/account.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { RoleInfoInterface } from '~/interfaces/role.interface'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editAccountSchema, type EditAccountFormData } from '~/validations/admin/account.validation'
import { singleFileValidator } from '~/validations/validators/validators'

const useEdit = () => {
  const [roles, setRoles] = useState<RoleInfoInterface[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [preview, setPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<EditAccountFormData>({ // Initialize the form with Zod validation
    resolver: zodResolver(editAccountSchema), // Apply Zod validation schema
    defaultValues: { // Set default values for the form fields
      fullName: '',
      email: '',
      phone: '',
      role_id: '',
      avatar: null,
      status: 'ACTIVE'
    }
  })

  const watchedStatus = watch('status')

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [resAccount, resRoles] = await Promise.all([
          fetchDetailAccountAPI(id),
          fetchRolesAPI()
        ])
        setRoles(resRoles.roles)

        const account = resAccount.account

        reset({
          fullName: account.fullName,
          email: account.email,
          phone: account.phone,
          role_id: account.role_id._id,
          status: account.status,
          avatar: account.avatar,
          password: ''
        })

        setPreview(account.avatar)
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
      if (preview?.startsWith('blob:')) {
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
    setPreview(imageUrl)
    setValue('avatar', file)
  }

  const onSubmit = async (data: EditAccountFormData) => {
    if (!id) return

    try {
      const formData = new FormData()
      formData.append('fullName', data.fullName)
      formData.append('email', data.email)
      formData.append('role_id', data.role_id)
      formData.append('status', data.status)
      formData.append('phone', data.phone)

      if (data.password && data.password.trim() !== '') {
        formData.append('password', data.password)
      }

      if (data.avatar instanceof File) {
        formData.append('avatar', data.avatar)
      }

      const response = await fetchEditAccountAPI(id, formData)

      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => navigate(`/admin/accounts/detail/${id}`), 1500)
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
    roles,
    isLoading,
    role,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    watchedStatus,
    handleImageChange,
    onSubmit,
    preview,
    navigate,
    id
  }
}

export default useEdit