/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailUserAPI } from '~/apis/admin/user.api'
import type { UserInfoInterface } from '~/interfaces/user.interface'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const useDetail = () => {
  const [user, setUser] = useState<UserInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { role } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchDetailUserAPI(id)
        setUser(res.accountUser)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi khi tải dữ liệu người dùng!', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dispatchAlert, id])

  return {
    user,
    role,
    navigate,
    isLoading
  }
}

export default useDetail