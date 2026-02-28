/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { fetchClientBrandsAPI } from '~/apis/client/brand.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { BrandGroup } from '~/interfaces/brand.interface'

const useBrand = () => {
  const [brandGroups, setBrandGroups] = useState<BrandGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchClientBrandsAPI()
        if (res.code === 200) {
          setBrandGroups(res.brands)
        }
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi khi tải dữ liệu thương hiệu!', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dispatchAlert])

  return {
    brandGroups,
    isLoading
  }
}

export default useBrand