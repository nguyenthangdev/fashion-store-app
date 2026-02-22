/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSettingGeneralAPI } from '~/apis/admin/settingGeneral.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'

import type { SettingGeneralInfoInterface } from '~/interfaces/setting.interface'

const useSettingsGeneral = () => {
  const [general, setGeneral] = useState<SettingGeneralInfoInterface | null>(null)
  const { role } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchSettingGeneralAPI()
        setGeneral(res.settingGeneral[0])
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: {
            message: 'Không thể tải thông tin cài đặt chung. Vui lòng thử lại!',
            severity: 'error'
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dispatchAlert])

  return {
    general,
    role,
    navigate,
    isLoading
  }
}

export default useSettingsGeneral