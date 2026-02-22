import { useEffect } from 'react'
import FieldErrorAlert from '~/components/form/FieldErrorAlert'
import useCreate from '~/hooks/admin/account/useCreate'

const CreateAccount = () => {
  const {
    roles,
    preview,
    role,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleImageChange,
    onSubmit,
    navigate
  } = useCreate()

  useEffect(() => {
    if (!role || !role.permissions.includes('accounts_create')) {
      const timer = setTimeout(() => {
        navigate('/admin/admin-welcome', { replace: true })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [role, navigate])

  if (!role || !role.permissions.includes('accounts_create')) {
    return (
      <div className="bg-white p-6 rounded shadow-md mt-4">
        <p className="text-red-500 text-center text-lg font-medium">
          Bạn không có quyền truy cập trang này. Đang chuyển hướng...
        </p>
      </div>
    )
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md mt-[15px]"
      >
        <h1 className="text-[24px] font-[600] text-[#192335]">Thêm mới tài khoản</h1>

        <div className="form-group">
          <label htmlFor="fullName">Họ và tên <span className="text-red-500">*</span></label>
          <input
            {...register('fullName')}
            type="text"
            id="fullName"
            className={`py-[3px] text-[16px] ${errors.fullName ? 'border-red-500' : ''}`}
          />
          <FieldErrorAlert errors={errors} fieldName='fullName'/>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email <span className="text-red-500">*</span></label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className={`py-[3px] text-[16px] ${errors.email ? 'border-red-500' : ''}`}
          />
          <FieldErrorAlert errors={errors} fieldName='email'/>
        </div>

        <div className="form-group">
          <label htmlFor="password">Mật khẩu <span className="text-red-500">*</span></label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className={`py-[3px] text-[16px] ${errors.password ? 'border-red-500' : ''}`}
          />
          <FieldErrorAlert errors={errors} fieldName='password'/>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            className={`py-[3px] text-[16px] ${errors.phone ? 'border-red-500' : ''}`}
          />
          <FieldErrorAlert errors={errors} fieldName='phone'/>
        </div>

        <div className="form-group">
          <label htmlFor="avatar">Avatar</label>
          <input
            // ref={uploadImageInputRef}
            {...register('avatar')}
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="avatar-upload"
            className="bg-[#9D9995] font-[500] border rounded-[5px] w-[5%] py-[4px] text-[14px] text-center cursor-pointer"
          >
              Chọn ảnh
          </label>
          {preview && (
            <img
              src={preview}
              alt="Avatar preview"
              className="border rounded-[5px] w-[150px] h-[150px] mt-2"
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="role_id">Phân quyền <span className="text-red-500">*</span></label>
          <select
            {...register('role_id')}
            id="role_id"
            className={`outline-none border rounded-[5px] border-[#192335] text-[16px] py-[3px] ${errors.role_id ? 'border-red-500' : ''}`}
          >
            <option value="">-- Chọn --</option>
            {roles?.map(role => (
              <option key={role._id} value={role._id}>
                {role.title}
              </option>
            ))}
          </select>
          <FieldErrorAlert errors={errors} fieldName='role_id'/>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#192335]">
              Trạng thái <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center justify-start gap-[15px]">
            <div className="flex gap-[5px]">
              <input
                {...register('status')}
                type="radio"
                className="border rounded-[5px] border-[#192635]"
                id="statusActive"
                value="ACTIVE"
              />
              <label htmlFor="statusActive">Hoạt động</label>
            </div>
            <div className="flex gap-[5px]">
              <input
                {...register('status')}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="statusInActive"
                value="INACTIVE"
              />
              <label htmlFor="statusInActive">Dừng hoạt động</label>
            </div>
          </div>
          <FieldErrorAlert errors={errors} fieldName="status" />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="p-[5px] border rounded-[5px] bg-[#525FE1] text-white text-[14px] w-[6%] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo mới'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/accounts')}
            disabled={isSubmitting}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-[5px] px-6 py-[10px] transition-colors"
          >
              Hủy
          </button>
        </div>
      </form>
    </>
  )
}

export default CreateAccount