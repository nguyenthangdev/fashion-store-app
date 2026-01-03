
import { IoEye, IoEyeOff } from 'react-icons/io5'
import Skeleton from '@mui/material/Skeleton'
import useChangePassword from '~/hooks/client/myAccount/useChangePassword'

const ChangePassword = () => {
  const {
    showCurrentPassword,
    setShowCurrentPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    register,
    errors,
    handleFormSubmit,
    myAccount,
    isSubmitting
  } = useChangePassword()

  return (
    <>
      {myAccount ? (
        <form
          onSubmit={handleFormSubmit}
          className='w-[70%] flex items-center justify-center gap-[15px] border rounded-[15px] p-[10px]'
          encType="multipart/form-data"
        >
          <div className='flex flex-col w-[40%] gap-[15px]'>
            <h1 className='text-[25px] font-[600] text-center'>Thay đổi mật khẩu tài khoản</h1>
            <div className='flex flex-col gap-[10px]'>
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu hiện tại"
                    className={`border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.currentPassword ? 'border-red-500' : ''}`}
                    {...register('currentPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showCurrentPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                  </button>
                </div>
                {errors.currentPassword && <span className="text-red-500 text-sm">{errors.currentPassword.message}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu mới"
                    className={`border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.password ? 'border-red-500' : ''}`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận lại mật khẩu"
                    className={`border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
              </div>

              <div className='flex items-center justify-center mt-2'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className={`cursor-pointer border rounded-[5px] p-[7px] text-white text-center w-[30%] text-[14px] ${isSubmitting ? 'bg-gray-400' : 'bg-[#525FE1]'}`}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Cập nhật'}
                </button>
              </div>

            </div>
          </div>
        </form>
      ) : (
        <div className='w-[70%] flex items-center justify-center gap-[15px] border rounded-[15px] p-[10px]'>
          <div className='flex flex-col w-[40%] gap-[15px]'>
            <Skeleton variant="text" width={410} height={38} sx={{ bgcolor: 'grey.400' }}/>
            <div className='flex flex-col gap-[10px]'>
              <Skeleton variant="rectangular" width={410} height={46} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={410} height={46} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={410} height={46} sx={{ bgcolor: 'grey.400' }}/>
              <div className='flex items-center justify-center'>
                <Skeleton variant="rectangular" width={82} height={37} sx={{ bgcolor: 'grey.400' }}/>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChangePassword