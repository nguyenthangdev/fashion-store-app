/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { fetchAccountsAPI, fetchChangeStatusAPI, fetchDeleteAccountAPI } from '~/apis/admin/account.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountInfoInterface } from '~/interfaces/account.interface'
import { useAuth } from '~/contexts/admin/AuthContext'

const useAccount = () => {
  const [accounts, setAccounts] = useState<AccountInfoInterface[]>([])
  const { dispatchAlert } = useAlertContext()
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { role } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchAccountsAPI()
        if (res.code === 200) {
          setAccounts(res?.accounts || [])
        } else {
          dispatchAlert({
            type: 'SHOW_ALERT',
            payload: { message: res.message, severity: 'error' }
          })
          setAccounts([])
        }
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Đã xảy ra lỗi khi tải dữ liệu tài khoản!', severity: 'error' }
        })
        setAccounts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dispatchAlert])

  const handleToggleStatus = async (account_id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const response = await fetchChangeStatusAPI(account_id, newStatus.toLowerCase())
    if (response.code === 200) {
      setAccounts(prevAccounts => prevAccounts.map(account =>
        account._id === account_id ? { ...account, status: newStatus } : account)
      )
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

  const handleOpen = (account_id: string) => {
    setSelectedId(account_id)
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedId(null)
    setOpen(false)
  }

  const handleDelete = async () => {
    if (!selectedId) return

    const response = await fetchDeleteAccountAPI(selectedId)
    if (response.code === 204) {
      setAccounts(prevAccounts => prevAccounts.filter(account => account._id != selectedId))
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

  const handlePreventEditStatus = () => {
    dispatchAlert({
      type: 'SHOW_ALERT',
      payload: { message: 'Không thể chỉnh sửa trạng thái hoạt động của quản trị viên cấp cao nhất!', severity: 'error' }
    })
  }

  return {
    accounts,
    open,
    isLoading,
    role,
    handleToggleStatus,
    handleOpen,
    handleClose,
    handleDelete,
    handlePreventEditStatus
  }
}

export default useAccount