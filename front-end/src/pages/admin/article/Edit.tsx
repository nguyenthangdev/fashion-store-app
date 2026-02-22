import { Editor } from '@tinymce/tinymce-react'
import { API_KEY } from '~/utils/constants'
import { useEdit } from '~/hooks/admin/article/useEdit'
import SelectTreeArticle from '~/components/admin/tableTree/SelectTreeArticle'
import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import FieldErrorAlert from '~/components/form/FieldErrorAlert'

const EditArticle = () => {
  const {
    isLoading,
    allArticleCategories,
    thumbnailPreview,
    handleThumbnailChange,
    handleSubmit,
    role,
    register,
    errors,
    isSubmitting,
    setValue,
    watch,
    navigate,
    onSubmit
  } = useEdit()

  useEffect(() => {
    if (!role || !role.permissions.includes('articles_edit')) {
      const timer = setTimeout(() => {
        navigate('/admin/admin-welcome', { replace: true })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [role, navigate])

  if (!role || !role.permissions.includes('articles_edit')) {
    return (
      <div className="bg-white p-6 rounded shadow-md mt-4">
        <p className="text-red-500 text-center text-lg font-medium">
          Bạn không có quyền truy cập trang này. Đang chuyển hướng...
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md">
        <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
        <div className="form-group">
          <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="form-group">
          <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="flex items-center justify-start gap-[10px]">
          <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="form-group">
          <Skeleton variant="rectangular" width={100} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={1000} height={400} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="form-group">
          <Skeleton variant="rectangular" width={100} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={1000} height={400} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <div className="flex flex-col gap-[5px]">
          <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={150} height={150} sx={{ bgcolor: 'grey.400' }}/>
        </div>
        <Skeleton variant="rectangular" width={100} height={50} sx={{ bgcolor: 'grey.400' }}/>
      </div>
    )
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md"
      >
        <h1 className="text-[24px] font-[600] text-[#192335]">Chỉnh sửa bài viết</h1>

        <div className="form-group">
          <label htmlFor="title">Tiêu đề <span className="text-red-500">*</span></label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className='py-[3px] text-[16px]'
          />
          <FieldErrorAlert errors={errors} fieldName='title'/>
        </div>

        <div className="form-group">
          <label htmlFor="article_category_id">Danh mục <span className="text-red-500">*</span></label>
          <select
            {...register('article_category_id')}
            id="article_category_id"
            className="outline-none border rounded-[5px] border-[#00171F] py-[3px] text-[16px]"
            defaultValue={watch('article_category_id')}
          >
            <option value=""> -- Chọn danh mục -- </option>
            {allArticleCategories?.map(articleCategory => (
              <SelectTreeArticle
                key={articleCategory._id}
                articleCategory={articleCategory}
                level={1}
                // allArticleCategories={allArticleCategories}
                // parent_id={watch('article_category_id')}
              />
            ))}
          </select>
          <FieldErrorAlert errors={errors} fieldName='article_category_id'/>
        </div>

        <div className="flex flex-col gap-2">
          <label>Nổi bật <span className="text-red-500">*</span></label>
          <div className="flex items-center justify-start gap-[10px] text-[16px]">
            <div className="flex gap-[5px]">
              <input
                {...register('featured')}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="featured1"
                value="1"
              />
              <label htmlFor="featured1">Nổi bật</label>
            </div>
            <div className="flex gap-[5px]">
              <input
                {...register('featured')}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="featured0"
                value="0"
              />
              <label htmlFor="featured0">Không nổi bật</label>
            </div>
          </div>
          <FieldErrorAlert errors={errors} fieldName='featured'/>
        </div>

        <div className="form-group">
          <label htmlFor="descriptionShort">Mô tả ngắn</label>
          <Editor
            apiKey={API_KEY}
            init={{
              plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
            }}
            value={watch('descriptionShort')}
            onEditorChange={(newValue) => setValue(
              'descriptionShort',
              newValue,
              { shouldValidate: true, shouldDirty: true }
            )}
            id="descriptionShort"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descriptionDetail">Mô tả chi tiết</label>
          <Editor
            apiKey={API_KEY}
            init={{
              plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
            }}
            value={watch('descriptionDetail')}
            onEditorChange={(newValue) => setValue(
              'descriptionDetail',
              newValue,
              { shouldValidate: true, shouldDirty: true }
            )}
            id="descriptionDetail"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Ảnh đại diện <span className="text-red-500">*</span></label>
          <input
            {...register('thumbnail')}
            // ref={uploadImageInputRef}
            type="file"
            id="thumbnail-upload"
            className='hidden'
            accept="image/*"
            onChange={handleThumbnailChange}
          />
          <label
            htmlFor="thumbnail-upload"
            // type="button"
            // onClick={handleClick}
            className="bg-[#9D9995] hover:bg-[#87857F] transition-colors border rounded-[5px] w-[100px] inline-block px-4 py-2 text-[14px] cursor-pointer text-center text-white"
          >
            Chọn ảnh
          </label>
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="border rounded-md w-40 h-40 object-cover"
            />
          )}
          <FieldErrorAlert errors={errors} fieldName='thumbnail'/>
        </div>

        <div className="flex flex-col gap-2">
          <label>Trạng thái <span className="text-red-500">*</span></label>
          <div className="flex items-center justify-start gap-[5px]">
            <div className="flex gap-[5px]">
              <input
                {...register('status')}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
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
          <FieldErrorAlert errors={errors} fieldName='status'/>
        </div>

        <div className='flex items-center justify-start text-center gap-[5px]'>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-[8%] border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px] disabled:opacity-50"
          >
            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
          <Link
            to="/admin/articles"
            className="w-[6%] border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px]"
          >
            Hủy
          </Link>
        </div>
      </form>
    </>
  )
}

export default EditArticle