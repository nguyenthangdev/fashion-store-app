import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateProductAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { availableColors, availableSizes } from '~/utils/constants'
import { createProductSchema, type CreateProductFormData } from '~/validations/admin/product.validation'
import { singleFileValidator } from '~/validations/validators/validators'

export const useCreate = () => {
  const { stateProductCategory } = useProductCategoryContext()
  const { allProductCategories } = stateProductCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()

  const [showPopupSize, setShowPopupSize] = useState(false)
  const [showPopupColor, setShowPopupColor] = useState(false)

  // State tạm thời để lưu màu được chọn trong popup trước khi xác nhận
  const [tempSelectedColors, setTempSelectedColors] = useState<{
    name: string
    code: string
    images: (File | string)[]}[]>([])

  // State tạm thời để lưu size được chọn trong popup trước khi xác nhận
  const [tempSelectedSizes, setTempSelectedSizes] = useState<string[]>([])

  // Ref cho thumbnail
  // const uploadImageInputRef = useRef<HTMLInputElement | null>(null)

  // Tạo một mảng ref để quản lý các input file của từng màu
  const colorFileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // State chỉ để lưu file và URL preview, không lưu trực tiếp vào productInfo
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: '',
      product_category_id: '',
      featured: '1',
      description: '',
      price: 0,
      discountPercentage: 0,
      stock: 1,
      colors: [],
      sizes: [],
      status: 'ACTIVE',
      thumbnail: null
    }
  })

  // Màu đã được chọn rồi
  const watchedColors = watch('colors')
  // Size đã được chọn rồi
  const watchedSizes = watch('sizes')

  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview)
      }
    }
  }, [thumbnailPreview])

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
    trigger('thumbnail') // Trigger validation
  }

  // Phần xử lý màu sắc
  // Mở popup
  const handleOpenPopupColor = () => {
    setShowPopupColor(true)
    setTempSelectedColors([...watchedColors])
  }

  // Đóng popup mà không lưu
  const handleClosePopupColor = () => {
    setShowPopupColor(false)
    setTempSelectedColors([])
  }

  // Toggle chọn/bỏ màu trong popup
  const handleToggleColor = (color: { code: string, name: string }) => {
    const isSelected = tempSelectedColors.some(c => c.code === color.code)

    if (isSelected) {
      // Bỏ chọn, bỏ color vừa tick ra khỏi tempSelectedColors
      setTempSelectedColors(tempSelectedColors.filter(c => c.code !== color.code))
    } else {
      // Chọn, thêm color vừa tick vào tempSelectedColors
      setTempSelectedColors([...tempSelectedColors, { ...color, images: [] }])
    }
  }

  // Chọn tất cả màu
  const handleSelectAllColors = () => {
    const allColors = availableColors.map(color => ({ ...color, images: [] }))
    setTempSelectedColors(allColors)
  }

  // Bỏ chọn tất cả màu
  const handleDeselectAllColors = () => {
    setTempSelectedColors([])
  }

  // Lưu màu đã chọn khi ấn nút "Xong"
  const handleConfirmSelectionColors = () => {
    // Giữ lại các màu đã có trước đó rồi, nếu chưa có thì thêm mới vào
    const updatedColors = tempSelectedColors.map(tempColor => {
      const existingColor = watchedColors.find(c => c.code === tempColor.code)
      return existingColor ? existingColor : tempColor
    })

    setValue('colors', updatedColors)
    trigger('colors') // Trigger validation
    setShowPopupColor(false)
    setTempSelectedColors([])
  }

  // Hàm xử lý thêm ảnh cho một màu cụ thể
  const handleAddImagesToColor = (colorIndex: number, event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles = Array.from(files) // Chuyển về mảng để dùng đc nhiều hàm có sẵn trong Array, ban đầu có dạng FileList (ít hỗ trợ các hàm phụ trợ)
    // Validate each file
    for (const file of files) {
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
    }

    const newColors = [...watchedColors]
    // Lưu trữ File object trực tiếp vào mảng images của màu đó
    const updatedImages = (newColors[colorIndex].images || []).concat(newFiles)
    newColors[colorIndex] = { ...newColors[colorIndex], images: updatedImages }
    setValue('colors', newColors)
  }

  // xóa 1 ảnh của 1 màu đc chỉ định
  const handleRemoveImageFromColor = (colorIndex: number, imageIndex: number) => {
    const newColors = [...watchedColors]
    const imageToRemove = newColors[colorIndex].images[imageIndex]

    if (imageToRemove instanceof File) {
      URL.revokeObjectURL(URL.createObjectURL(imageToRemove))
    }

    const newImages = newColors[colorIndex].images.filter((_, idx) => idx !== imageIndex)
    newColors[colorIndex] = { ...newColors[colorIndex], images: newImages }
    setValue('colors', newColors)
  }

  // Xóa màu
  const handleRemoveColor = (indexToRemove: number) => {
    const newColors = watchedColors.filter((_, index) => index !== indexToRemove)
    setValue('colors', newColors)
    trigger('colors')
  }
  // Hết Phần xử lý màu sắc

  // Phần xử lý size
  // Mở popup
  const handleOpenPopupSize = () => {
    setTempSelectedSizes([...watchedSizes])
    setShowPopupSize(true)
  }

  // Đóng popup mà không lưu
  const handleClosePopupSize = () => {
    setShowPopupSize(false)
    setTempSelectedSizes([])
  }

  // Toggle chọn/bỏ chọn size trong popup
  const handleToggleSize = (size: string) => {
    const isSelected = tempSelectedSizes.some(s => s === size)

    if (isSelected) {
      // Bỏ chọn
      setTempSelectedSizes(tempSelectedSizes.filter(s => s !== size))
    } else {
      // Chọn
      setTempSelectedSizes([...tempSelectedSizes, size])
    }
  }

  // Chọn tất cả size
  const handleSelectAllSizes = () => {
    const allSizes = availableSizes.map(size => size)
    setTempSelectedSizes(allSizes)
  }

  // Bỏ chọn tất cả size
  const handleDeselectAllSizes = () => {
    setTempSelectedSizes([])
  }

  // Lưu màu đã chọn khi ấn nút "Xong"
  const handleConfirmSelectionSizes = () => {
    setValue('sizes', tempSelectedSizes)
    trigger('sizes') // Trigger validation
    setShowPopupSize(false)
    setTempSelectedSizes([])
  }

  // Xóa size sau khi đã chọn
  const handleRemoveSize = (indexToRemove: number) => {
    const newSizes = watchedSizes.filter((_, index) => index !== indexToRemove)
    setValue('sizes', newSizes)
    trigger('sizes')
  }
  // Hết Phần xử lý size

  const onSubmit = async (data: CreateProductFormData) => {
    const hasColorWithoutImages = data.colors.some(color => !color.images || color.images.length === 0)

    if (hasColorWithoutImages) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Mỗi màu phải có ít nhất 1 ảnh', severity: 'error' }
      })
      return
    }

    const formData = new FormData()
    // 1. Chuẩn bị dữ liệu và tập hợp các file cần upload
    const filesToUpload: File[] = []

    // Tạo một bản sao sạch của productInfo để gửi đi, đảm bảo nhất quán
    const productDataPayload = {
      ...data,
      thumbnail: '', // Tạm thời xóa, sẽ được thay thế bằng placeholder
      colors: [] as { name: string; code: string; images: string[] }[]
    }
    // Xử lý ảnh đại diện
    if (thumbnailFile) {
      filesToUpload.push(thumbnailFile)
      // Dùng placeholder để backend biết vị trí của thumbnail trong mảng files
      productDataPayload.thumbnail = '__THUMBNAIL_PLACEHOLDER__'
    }

    // Xử lý ảnh theo từng màu
    let isImageLargerThan15 = false
    data.colors.forEach(color => {
      const colorPayload = { name: color.name, code: color.code, images: [] as string[] }

      if (color.images.length > 15) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: {
            message: 'Số lượng ảnh không được vượt quá 15 ảnh. Vui lòng chọn lại!',
            severity: 'error'
          }
        })
        isImageLargerThan15 = true
        return
      }

      if (color.images && Array.isArray(color.images)) {
        (color.images).forEach(image => {
          if (image instanceof File) {
            filesToUpload.push(image)
            // Dùng placeholder để backend biết ảnh này thuộc về màu nào
            colorPayload.images.push('__IMAGE_PLACEHOLDER__')
          }
        })
      }
      productDataPayload.colors.push(colorPayload)
    })

    if (isImageLargerThan15) return

    // 2. Gắn dữ liệu vào FormData
    // Gắn tất cả các file ảnh vào MỘT trường duy nhất là 'files'
    filesToUpload.forEach(file => {
      formData.append('files', file)
    })

    // Gắn tất cả các thông tin còn lại vào MỘT trường 'productData' dưới dạng JSON
    formData.append('productData', JSON.stringify(productDataPayload))

    const response = await fetchCreateProductAPI(formData)
    if (response.code === 201) {
      // setProductInfo(response.data)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/products')
      }, 2000)
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>, inputRef: React.RefObject<HTMLInputElement | null>) => {
  //   event.preventDefault()
  //   inputRef.current?.click()
  // }

  return {
    allProductCategories,
    colorFileInputRefs,
    handleSubmit,
    onSubmit,
    role,
    handleRemoveColor,
    handleRemoveSize,
    thumbnailPreview,
    handleThumbnailChange,
    handleAddImagesToColor,
    handleRemoveImageFromColor,
    showPopupSize,
    showPopupColor,
    availableSizes,
    availableColors,
    handleOpenPopupColor,
    handleClosePopupColor,
    handleToggleColor,
    handleSelectAllColors,
    handleDeselectAllColors,
    handleConfirmSelectionColors,
    tempSelectedColors,
    handleOpenPopupSize,
    handleClosePopupSize,
    handleToggleSize,
    handleSelectAllSizes,
    handleDeselectAllSizes,
    handleConfirmSelectionSizes,
    tempSelectedSizes,
    register,
    errors,
    isSubmitting,
    setValue,
    watch,
    colors: watchedColors,
    sizes: watchedSizes,
    navigate
  }
}