/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailAccountAPI } from '~/apis/admin/account.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { AccountInfoInterface } from '~/interfaces/account.interface'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const useDetail = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)
  const { role } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams()
  const id = params.id as string
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return

        setIsLoading(true)
        const response = await fetchDetailAccountAPI(id)
        setAccountInfo(response.account)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi khi tải dữ liệu tài khoản!', severity: 'error' }
        })
        setAccountInfo(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id, dispatchAlert])

  return {
    accountInfo,
    role,
    isLoading
  }
}

export default useDetail