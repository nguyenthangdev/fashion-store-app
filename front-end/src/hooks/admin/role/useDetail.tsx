/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailRoleAPI } from '~/apis/admin/role.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { RoleInfoInterface } from '~/interfaces/role.interface'

const useDetail = () => {
  const [roleDetail, setRoleDetail] = useState<RoleInfoInterface | null>(null)
  const params = useParams()
  const id = params.id
  const { role } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchDetailRoleAPI(id)
        setRoleDetail(res.role)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi khi tải dữ liệu nhóm quyền!', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dispatchAlert, id])

  return {
    roleDetail,
    role,
    id,
    navigate,
    isLoading
  }
}

export default useDetail