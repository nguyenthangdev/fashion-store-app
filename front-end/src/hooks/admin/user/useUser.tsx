import { useEffect, useState } from 'react'
import { fetchChangeStatusAPI, fetchDeleteUserAPI, fetchUsersAPI } from '~/apis/admin/user.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { UserInfoInterface } from '~/interfaces/user.interface'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useNavigate } from 'react-router-dom'

const useUser = () => {
  const [users, setUsers] = useState<UserInfoInterface[]>([])
  const { dispatchAlert } = useAlertContext()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { role } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetchUsersAPI()
        setUsers(res.users)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Fetch roles error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleToggleStatus = async (id: string, currentStatus: string): Promise<void> => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const response = await fetchChangeStatusAPI(id, newStatus.toLowerCase())
    if (response.code === 200) {
      setUsers((prev) => prev.map((user) => user._id === id ? {
        ...user,
        status: newStatus
      }: user))
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

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
    const response = await fetchDeleteUserAPI(selectedId)
    if (response.code === 204) {
      setUsers((prev) => prev.filter((item) => item._id != selectedId))
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
    users,
    loading,
    open,
    role,
    handleToggleStatus,
    handleOpen,
    handleClose,
    handleDelete,
    navigate
  }
}

export default useUser