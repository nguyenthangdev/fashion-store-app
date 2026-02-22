import { Editor } from '@tinymce/tinymce-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import SelectTree from '~/components/admin/tableTree/SelectTreeProduct'
import FieldErrorAlert from '~/components/form/FieldErrorAlert'
import { useCreate } from '~/hooks/admin/productCategory/useCreate'
import { API_KEY } from '~/utils/constants'

const CreateProductCategory = () => {
  const {
    allProductCategories,
    preview,
    handleChange,
    handleSubmit,
    role,
    register,
    errors,
    isSubmitting,
    setValue,
    watch,
    navigate,
    onSubmit
  } = useCreate()

  useEffect(() => {
    if (!role || !role.permissions.includes('products-category_create')) {
      const timer = setTimeout(() => {
        navigate('/admin/admin-welcome', { replace: true })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [role, navigate])

  if (!role || !role.permissions.includes('products-category_create')) {
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
        className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md"
      >
        <h1 className="text-[24px] font-[600] text-[#192335]">
          Thêm mới danh mục sản phẩm
        </h1>

        <div className="form-group">
          <label htmlFor="title">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className='py-[3px] text-[16px]'
          />
          <FieldErrorAlert errors={errors} fieldName='title'/>
        </div>

        <div className="form-group">
          <label htmlFor="parent_id">Danh mục cha</label>
          <select
            {...register('parent_id')}
            id="parent_id"
            className="outline-none border rounded-[5px] border-[#00171F] py-[3px] text-[16px]"
          >
            <option value=""> -- Chọn danh mục -- </option>
            {allProductCategories?.map(productCategory => (
              <SelectTree
                key={productCategory._id}
                productCategory={productCategory}
                level={1}
              />
            ))}
          </select>
          <FieldErrorAlert errors={errors} fieldName='parent_id'/>
        </div>

        <div className="form-group">
          <label htmlFor="desc">Mô tả</label>
          <Editor
            apiKey={API_KEY}
            init={{
              plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
            }}
            value={watch('description')}
            onEditorChange={(newValue) => setValue(
              'description',
              newValue,
              { shouldValidate: true, shouldDirty: true }
            )}
            id="desc"
          />
        </div>

        <div className="flex flex-col gap-[5px]">
          <label htmlFor="thumbnail">
            Ảnh <span className="text-red-500">*</span>
          </label>
          <input
            {...register('thumbnail')}
            // ref={uploadImageInputRef}
            type="file"
            id="thumbnail-upload"
            className='hidden'
            accept="image/*"
            onChange={handleChange}
          />
          {/* <button
            type="button"
            onClick={handleClick}
            className="bg-[#9D9995] font-[500] border rounded-[5px] w-[6%] py-[4px] text-[14px] text-white"
          >
            Chọn ảnh
          </button> */}
          <label
            htmlFor="thumbnail-upload"
            className={`bg-gray-400 font-semibold border rounded-md w-fit px-3 py-1 text-sm text-white ${
              errors.thumbnail ? 'border-red-500' : ''
            }`}
          >
            Chọn ảnh
          </label>
          {preview && (
            <img
              src={preview}
              alt="Thumbnail preview"
              className="border rounded-[5px] w-[150px] h-[150px] object-cover"
            />
          )}
          <FieldErrorAlert errors={errors} fieldName='thumbnail'/>
        </div>

        <div className="flex flex-col gap-2">
          <label>
            Trạng thái <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center justify-start gap-[10px] text-[16px]">
            <div className="flex gap-[5px]">
              <input
                {...register('status')}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="statusActive"
                value={'ACTIVE'}
              />
              <label htmlFor="statusActive">Hoạt động</label>
            </div>

            <div className="flex gap-[5px]">
              <input
                {...register('status')}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="statusInActive"
                value={'INACTIVE'}
              />
              <label htmlFor="statusInActive">Dừng hoạt động</label>
            </div>
          </div>
          <FieldErrorAlert errors={errors} fieldName='status'/>
        </div>

        <div className='flex items-center justify-start gap-[5px]'>
          <button
            type="submit"
            disabled={isSubmitting}
            className="nav-link border rounded-[5px] bg-[#0542AB] p-[5px] text-white w-[100px] text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo mới'}
          </button>
          <Link
            to={'/admin/products-category'}
            className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[80px] text-center'
          >
            Hủy
          </Link>
        </div>
      </form>
    </>
  )
}

export default CreateProductCategory