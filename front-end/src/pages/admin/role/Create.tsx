import { Editor } from '@tinymce/tinymce-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import FieldErrorAlert from '~/components/form/FieldErrorAlert'
import useCreate from '~/hooks/admin/role/useCreate'
import { API_KEY } from '~/utils/constants'

const CreateRole = () => {
  const {
    role,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    navigate,
    onSubmit,
    watchedDescription
  } = useCreate()


  useEffect(() => {
    if (!role || !role.permissions.includes('roles_create')) {
      const timer = setTimeout(() => {
        navigate('/admin/admin-welcome', { replace: true })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [role, navigate])

  if (!role || !role.permissions.includes('roles_create')) {
    return (
      <div className="bg-white p-6 rounded shadow-md mt-4">
        <p className="text-red-500 text-center text-lg font-medium">
            Bạn không có quyền truy cập trang này. Đang chuyển hướng...
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-[15px] text-[17px] font-[500] bg-white p-[15px] shadow-md mt-[40px]'
    >
      <h1 className="text-[24px] font-[600] text-[#192335]">
        Thêm mới nhóm quyền
      </h1>

      <div className="form-group">
        <label>Tiêu đề <span className="text-red-500">*</span></label>
        <input
          {...register('title')}
          className='py-[6px] text-[16px] border rounded'
        />
        <FieldErrorAlert errors={errors} fieldName='title'/>
      </div>

      <div className="form-group">
        <label>Mã định danh <span className="text-red-500">*</span></label>
        <input
          {...register('titleId')}
          className='py-[6px] text-[16px] border rounded'
        />
        <FieldErrorAlert errors={errors} fieldName='titleId'/>
      </div>

      <div className="form-group">
        <label>Mô tả</label>
        <Editor
          apiKey={API_KEY}
          init={{
            height: 250,
            plugins:
              'anchor autolink charmap codesample emoticons image link lists media table wordcount',
            toolbar:
              'undo redo | bold italic underline | align | bullist numlist | removeformat'
          }}
          value={watchedDescription}
          onEditorChange={(value) => setValue(
            'description',
            value,
            { shouldValidate: true }
          )}
        />
      </div>

      <div className='flex items-center justify-start gap-[5px]'>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-fit px-4 py-2 border rounded bg-[#525FE1] text-white text-[14px]"
        >
          {isSubmitting ? 'Đang tạo...' : 'Tạo mới'}
        </button>
        <Link
          to={'/admin/roles'}
          className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[80px] text-center'
        >
          Hủy
        </Link>
      </div>

    </form>
  )
}

export default CreateRole
