/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailRoleAPI, fetchEditRoleAPI } from '~/apis/admin/role.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editRoleSchema, type EditRoleFormData } from '~/validations/admin/role.validation'

const useEdit = () => {
  const params = useParams()
  const id = params.id as string
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<EditRoleFormData>({
    resolver: zodResolver(editRoleSchema)
  })

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchDetailRoleAPI(id)
        const role = res.role
        reset({
          title: role.title,
          titleId: role.titleId,
          description: role.description
        })
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: {
            message: 'Không thể tải thông tin nhóm quyền. Vui lòng thử lại!',
            severity: 'error'
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dispatchAlert, id, reset])

  const watchedDescription = watch('description')

  const onSubmit = async (data: EditRoleFormData) => {
    try {
      const response = await fetchEditRoleAPI(id, data)

      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => {
          navigate(`/admin/roles/detail/${id}`)
        }, 2000)
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message || 'Cập nhật thất bại', severity: 'error' }
        })
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Cập nhật thất bại', severity: 'error' }
      })
    }
  }

  return {
    handleSubmit,
    onSubmit,
    register,
    errors,
    isSubmitting,
    role,
    setValue,
    watch,
    isLoading,
    watchedDescription,
    navigate
  }
}

export default useEdit