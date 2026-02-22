/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchEditSettingGeneralAPI, fetchSettingGeneralAPI } from '~/apis/admin/settingGeneral.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { SettingGeneralAPIResponse } from '~/interfaces/setting.interface'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editSettingsGeneralSchema, type EditSettingGeneralFormData } from '~/validations/admin/setting.validation'
import { useAuth } from '~/contexts/admin/AuthContext'
import { singleFileValidator } from '~/validations/validators/validators'

const useEditSettingsGeneral = () => {
  const { dispatchAlert } = useAlertContext()
  const [isLoading, setIsLoading] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)
  const { role } = useAuth()

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<EditSettingGeneralFormData>({
    resolver: zodResolver(editSettingsGeneralSchema)
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res: SettingGeneralAPIResponse = await fetchSettingGeneralAPI()
        const settingGeneralData = res.settingGeneral[0]
        reset({
          websiteName: settingGeneralData.websiteName,
          email: settingGeneralData.email,
          phone: settingGeneralData.phone,
          address: settingGeneralData.address,
          copyright: settingGeneralData.copyright
        })
        setPreview(settingGeneralData.logo)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Lỗi khi tải thông tin cài đặt chung!', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [reset, dispatchAlert])

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
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

    setValue('logo', file)
    setPreview(imageUrl)
  }
  const onSubmit = async (data: EditSettingGeneralFormData) => {
    try {
      const formData = new FormData()

      formData.append('websiteName', data.websiteName)
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('address', data.address)
      formData.append('copyright', data.copyright)

      if (data.logo instanceof File) {
        formData.append('logo', data.logo)
      }

      const response = await fetchEditSettingGeneralAPI(formData)
      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => {
          navigate('/admin/settings/general')
        }, 2000)
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'error' }
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
    isLoading,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleImageChange,
    onSubmit,
    preview,
    navigate,
    role
  }
}

export default useEditSettingsGeneral