/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailProductAPI, fetchRelatedProductsAPI } from '~/apis/client/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useCart } from '~/contexts/client/CartContext'
import type { ProductInfoInterface } from '~/interfaces/product.interface'
import { useMemo } from 'react'

const useDetail = () => {
  const [productDetail, setProductDetail] = useState<ProductInfoInterface | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [reviewFilter, setReviewFilter] = useState<'all' | 'media' | number>('all')
  const [visibleCount, setVisibleCount] = useState<number>(10)

  const [quantity, setQuantity] = useState<number>(1)
  const [selectedColor, setSelectedColor] = useState<ProductInfoInterface['colors'][0] | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [mainImage, setMainImage] = useState<string | File>('')

  const params = useParams()
  const slugProduct = params.slugProduct as string
  const { dispatchAlert } = useAlertContext()
  const { addToCart } = useCart()
  const [relatedProducts, setRelatedProducts] = useState<ProductInfoInterface[]>([])

  // RESET VỀ 10 KHI ĐỔI BỘ LỌC (Rất quan trọng)
  useEffect(() => {
    setVisibleCount(10)
  }, [reviewFilter])

  useEffect(() => {
    if (!slugProduct) return

    setIsLoading(true)
    fetchDetailProductAPI(slugProduct)
      .then((response) => {
        const product = response.product
        product.colors = product.colors || []
        product.sizes = product.sizes || []
        // Đảm bảo mỗi màu đều có mảng images
        product.colors.forEach(color => color.images = color.images || [])
        setProductDetail(product)

        if (product.colors.length > 0) {
          const initialColor = product.colors[0]
          setSelectedColor(initialColor)
          if (initialColor.images.length > 0) {
            setMainImage(initialColor.images[0])
          } else {
            setMainImage(product.thumbnail)
          }
        } else {
          setMainImage(product.thumbnail)
        }
        if (product.sizes.length > 0) {
          setSelectedSize(product.sizes[0])
        }
      })
      .finally(() => setIsLoading(false))

  }, [slugProduct])

  useEffect(() => {
    if (!productDetail || !productDetail._id) return

    const getRelated = async () => {
      try {
        const res = await fetchRelatedProductsAPI(productDetail._id ?? '')
        setRelatedProducts(res.products)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Lỗi khi fetch sản phẩm liên quan', severity: 'error' }
        })
      }
    }
    getRelated()

  }, [productDetail, dispatchAlert])

  const handleColorSelect = (color: ProductInfoInterface['colors'][0]) => {
    setSelectedColor(color)
    if (color.images && color.images.length > 0) {
      setMainImage(color.images[0])
    }
  }

  const handleQuantityChange = (amount: number) => {
    if (!productDetail) return

    const newQuantity = quantity + amount
    if (newQuantity >= 1 && newQuantity <= productDetail.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!productDetail) return

    // Kiểm tra xem người dùng đã chọn màu/size chưa (nếu sản phẩm có)
    if (productDetail.colors.length > 0 && !selectedColor) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn màu sắc', severity: 'error' }
      })
      return
    }
    if (productDetail.sizes.length > 0 && !selectedSize) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn kích cỡ', severity: 'error' }
      })
      return
    }

    try {
      await addToCart(productDetail._id ?? '', quantity, selectedColor?.name, selectedSize)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Đã thêm vào giỏ hàng', severity: 'success' }
      })
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Lỗi khi thêm vào giỏ', severity: 'error' }
      })
    }
  }

  // useMemo để tính toán số lượng đánh giá theo từng sao và có media (ảnh) hay không, tránh phải tính lại mỗi khi render
  const ratingCounts = useMemo(() => {
    if (!productDetail?.comments) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, media: 0 }
    interface RatingCounts {
      [key: number]: number // Cho phép truy cập bằng bất kỳ key nào là number
      media: number
    }

    // Giống như 1 từ điển
    const counts: RatingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, media: 0 }

    productDetail.comments.forEach(comment => {
      if (comment.rating >= 1 && comment.rating <= 5) {
        counts[comment.rating]++
      }
      if (comment.images && comment.images.length > 0) {
        counts.media++
      }
    })

    return counts
  }, [productDetail?.comments])

  const filteredComments = useMemo(() => {
    if (!productDetail?.comments) return []

    if (reviewFilter === 'all') {
      return productDetail.comments
    }

    if (reviewFilter === 'media') {
      return productDetail.comments.filter(c => c.images && c.images.length > 0)
    }

    return productDetail.comments.filter(c => c.rating === reviewFilter)
  }, [productDetail?.comments, reviewFilter])

  // Lấy từ 0 đến visibleCount
  const displayedComments = useMemo(() => {
    return filteredComments.slice(0, visibleCount)
  }, [filteredComments, visibleCount])

  // Nút "xem thêm"
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10)
  }

  return {
    isLoading,
    setReviewFilter,
    mainImage,
    relatedProducts,
    handleColorSelect,
    handleQuantityChange,
    handleSubmit,
    ratingCounts,
    filteredComments,
    selectedColor,
    productDetail,
    setMainImage,
    setSelectedSize,
    reviewFilter,
    quantity,
    selectedSize,
    handleLoadMore,
    displayedComments,
    visibleCount
  }
}

export default useDetail