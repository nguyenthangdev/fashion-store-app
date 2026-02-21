/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchBrandDetailAPI, updateBrandAPI } from '~/apis/admin/brand.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { Brand } from '~/interfaces/brand.interface'
import { singleFileValidator } from '~/validations/validators/validators'
import { useAuth } from '~/contexts/admin/AuthContext'

const useEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { role } = useAuth()

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchBrandDetailAPI(id)
        setBrand(res.brand)
        setPreview(res.brand.thumbnail) // Set preview ban đầu là ảnh cũ
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Lỗi khi tải thông tin thương hiệu', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, dispatchAlert])

  // Cleanup blob URL to prevent memory leak
  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string, value: string }
    setBrand(prev => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !brand) return

    const formData = new FormData()
    formData.append('title', brand.title)
    formData.append('status', brand.status)
    if (brand.brand_category_id) {
      formData.append('brand_category_id', brand.brand_category_id)
    }
    if (file) {
      formData.append('thumbnail', file) // Gửi file mới
    }

    try {
      const res = await updateBrandAPI(id, formData)
      if (res.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: res.message, severity: 'success' }
        })
        navigate('/admin/brands')
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Cập nhật thất bại', severity: 'error' }
      })
    }
  }
  return {
    isLoading,
    preview,
    handleImageChange,
    handleChange,
    handleSubmit,
    brand,
    navigate,
    role
  }
}

export default useEdit