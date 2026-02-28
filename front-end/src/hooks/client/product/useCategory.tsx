/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailProductCategoryAPI } from '~/apis/client/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { ProductInfoInterface, ProductsWithCategoryDetailInterface } from '~/interfaces/product.interface'

const useCategory = () => {
  const [productCategory, setProductCategory] = useState<ProductInfoInterface[]>([])
  const [pageTitle, setPageTitle] = useState('')
  const params = useParams()
  const slugCategory = params.slugCategory as string
  const [isLoading, setIsLoading] = useState(true)
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res: ProductsWithCategoryDetailInterface = await fetchDetailProductCategoryAPI(slugCategory)
        setProductCategory(res.products)
        setPageTitle(res.pageTitle)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Lỗi khi fetch danh mục sản phẩm', severity: 'error' }
        })
        setPageTitle('Không tìm thấy danh mục')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dispatchAlert, slugCategory])

  return {
    productCategory,
    pageTitle,
    isLoading
  }
}

export default useCategory