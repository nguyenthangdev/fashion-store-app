/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBrandAPI } from '~/apis/admin/brand.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { singleFileValidator } from '~/validations/validators/validators'
import type { SelectChangeEvent } from '@mui/material/Select'

const useCreate = () => {
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] as File
    if (!selectedFile) return

    const newFile = {
      name: selectedFile?.name || '',
      size: selectedFile?.size || 0,
      type: selectedFile?.type || ''
    }

    const error = singleFileValidator(newFile)

    if (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: error, severity: 'error' }
      })
      return
    }

    const imageUrl = URL.createObjectURL(selectedFile)
    setFile(selectedFile)
    setPreview(imageUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn logo', severity: 'error' }
      })
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('status', status)
    formData.append('thumbnail', file)

    try {
      const res = await createBrandAPI(formData)
      if (res.code === 201) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: res.message, severity: 'success' }
        })
        navigate('/admin/brands')
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Tạo mới thất bại', severity: 'error' }
      })
    }
  }
  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value)
  }

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  return {
    handleChangeTitle,
    preview,
    handleFileChange,
    handleSubmit,
    title,
    navigate,
    handleChangeStatus,
    status
  }
}

export default useCreate