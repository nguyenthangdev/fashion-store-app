// useChangePassword.ts
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchChangePasswordInfoUserAPI, fetchInfoUserAPI } from '~/apis/client/user.api'
import type { UserAPIResponse, UserInfoInterface } from '~/types/user.type'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const changePasswordSchema = z.object({
  currentPassword: z.string()
    .trim()
    .min(1, 'Vui lòng nhập mật khẩu hiện tại!'),

  password: z.string()
    .trim()
    .min(1, 'Vui lòng nhập mật khẩu!')
    .min(8, 'Mật khẩu phải chứa ít nhất 8 ký tự!')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa!')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường!')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số!')
    .regex(/[@$!%*?&]/, 'Mật khẩu phải có ít nhất 1 kí tự đặc biệt!'),

  confirmPassword: z.string()
    .min(1, 'Vui lòng xác nhận mật khẩu!')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp!',
  path: ['confirmPassword']
})

type changePasswordFormData = z.infer<typeof changePasswordSchema>

const useChangePassword = () => {
  const [myAccount, setMyAccount] = useState<UserInfoInterface | null>(null)

  // State hiển thị password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit, // Đây là hàm của hook-form
    formState: { errors, isSubmitting },
    reset // Dùng để reset form nếu cần
  } = useForm<changePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', password: '', confirmPassword: '' } // Thêm currentPassword vào default
  })

  useEffect(() => {
    fetchInfoUserAPI().then((response: UserAPIResponse) => {
      setMyAccount(response.accountUser)
    })
  }, [])

  // Hàm này chỉ chạy khi Validate thành công
  const onSubmit: SubmitHandler<changePasswordFormData> = async (data) => {
    if (!myAccount) return

    const response = await fetchChangePasswordInfoUserAPI(data.currentPassword, data.password, data.confirmPassword)

    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      reset() // Reset form sau khi thành công
      setTimeout(() => {
        navigate('/user/account/info')
      }, 2000)
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  return {
    showCurrentPassword,
    setShowCurrentPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    // Trả về các phương thức cần thiết cho UI
    register,
    errors,
    isSubmitting,
    handleFormSubmit: handleSubmit(onSubmit), // Bọc hàm onSubmit của ta vào handleSubmit của RHF
    myAccount
  }
}

export default useChangePassword