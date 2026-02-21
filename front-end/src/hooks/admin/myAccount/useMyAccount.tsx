/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMyAccountAPI } from '~/apis/admin/myAccount.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountInfoInterface } from '~/interfaces/account.interface'
import type { RoleInfoInterface } from '~/interfaces/role.interface'

export const useMyAccount = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)
  const [role, setRole] = useState<RoleInfoInterface | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchMyAccountAPI()
        setAccountInfo(res.myAccount)
        setRole(res.role)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi khi tải thông tin tài khoản', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dispatchAlert])

  return {
    accountInfo,
    setAccountInfo,
    role,
    setRole,
    isLoading,
    navigate
  }
}
