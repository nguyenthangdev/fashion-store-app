/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchRolesAPI, fetchCreateAccountAPI } from '~/apis/admin/account.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { RoleInfoInterface } from '~/interfaces/role.interface'
import { accountSchema, type AccountFormData } from '~/validations/admin/account.validation'
import { singleFileValidator } from '~/validations/validators/validators'

const useCreate = () => {
  const [roles, setRoles] = useState<RoleInfoInterface[]>([])
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  // const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { role } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      role_id: '',
      status: 'ACTIVE',
      avatar: null
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchRolesAPI()
        setRoles(res.roles)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã có lỗi xảy ra', severity: 'error' }
        })
      }
    }
    fetchData()
  }, [dispatchAlert])

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const onSubmit = async (data: AccountFormData) => {
    try {
      const formData = new FormData()
      formData.append('fullName', data.fullName)
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('phone', data.phone)
      formData.append('role_id', data.role_id)
      formData.append('status', data.status)
      if (data.avatar) {
        formData.append('avatar', data.avatar)
      }
      // const file = uploadImageInputRef.current?.files?.[0]
      // console.log('file of uploadImageInputRef: ', file)
      // if (file) {
      //   formData.append('avatar', file)
      // }
      const response = await fetchCreateAccountAPI(formData)

      if (response.code === 201) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => navigate('/admin/accounts'), 2000)
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'error' }
        })
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Đã có lỗi xảy ra', severity: 'error' }
      })
    }
  }

  // const handleClickUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault()
  //   uploadImageInputRef.current?.click()
  // }

  return {
    roles,
    preview,
    role,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleImageChange,
    onSubmit,
    navigate
  }
}

export default useCreate