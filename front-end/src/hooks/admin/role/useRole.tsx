/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { fetchDeleteRoleAPI, fetchRoleAPI } from '~/apis/admin/role.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountInfoInterface } from '~/interfaces/account.interface'
import type { RoleInfoInterface } from '~/interfaces/role.interface'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useNavigate } from 'react-router-dom'

const useRole = () => {
  const [roles, setRoles] = useState<RoleInfoInterface[]>([])
  const [accounts, setAccounts] = useState<AccountInfoInterface[]>([])
  const { dispatchAlert } = useAlertContext()
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { role } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetchRoleAPI()
        setRoles(res.roles)
        setAccounts(res.accounts)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi khi tải dữ liệu nhóm quyền!', severity: 'error' }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dispatchAlert])

  const handleOpen = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedId(null)
    setOpen(false)
  }

  const handleDelete = async () => {
    if (!selectedId) return

    const response = await fetchDeleteRoleAPI(selectedId)
    if (response.code === 204) {
      setRoles((prev) => prev.filter((role) => role._id !== selectedId))
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOpen(false)
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  return {
    roles,
    accounts,
    open,
    loading,
    role,
    handleOpen,
    handleClose,
    handleDelete,
    navigate
  }
}

export default useRole