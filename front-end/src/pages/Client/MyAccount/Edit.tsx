import useEdit from '~/hooks/client/myAccount/useEdit'

const EditMyAccountClient = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleClickUpload,
    handleChangeImage,
    accountUser,
    uploadImageInputRef,
    previewAvatar
  } = useEdit()

  return (
    <>
      {accountUser ? (
        <form
          onSubmit={handleSubmit}
          className='w-[70%] flex justify-around gap-[15px] border rounded-[15px] p-[15px]'
          encType="multipart/form-data"
        >
          <div className='flex flex-col gap-[15px] w-[40%]'>
            <h1 className='text-[25px] font-[600]'>Chỉnh sửa hồ sơ của tôi</h1>
            <div className='flex flex-col gap-[10px]'>
              <div className='form-group flex flex-col gap-1'>
                <label htmlFor='fullName' className="font-medium">Họ và tên: </label>
                <input
                  type='text'
                  id='fullName'
                  className={`py-[5px] px-2 border rounded ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('fullName')}
                />
                {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
              </div>
              <div className='form-group flex flex-col gap-1'>
                <label htmlFor='email' className="font-medium">Email:</label>
                <input
                  type='email'
                  id='email'
                  className={`py-[5px] px-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('email')}
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>
              <div className='form-group flex flex-col gap-1'>
                <label htmlFor='phone' className="font-medium">Số điện thoại:</label>
                <input
                  type='tel'
                  id='phone'
                  className={`py-[5px] px-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('phone')}
                />
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
              </div>
              <div className='form-group flex flex-col gap-1'>
                <label htmlFor='address' className="font-medium">Địa chỉ:</label>
                <input
                  type='text'
                  id='address'
                  className={`py-[5px] px-2 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('address')}
                />
                {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
              </div>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`border rounded-[5px] p-[7px] text-white text-center w-[30%] text-[14px] mt-2 ${isSubmitting ? 'bg-gray-400' : 'bg-[#525FE1]'}`}
              >
                {isSubmitting ? 'Đang lưu...' : 'Cập nhật'}
              </button>
            </div>
          </div>
          <div className='flex flex-col gap-[5px] text-center items-center'>
            <label
              htmlFor='avatar'
              className='text-[20px] font-[600]'
            >
              Ảnh đại diện:
            </label>
            <input
              onChange={handleChangeImage}
              ref={uploadImageInputRef}
              type="file"
              className="hidden"
              name="avatar"
              accept="image/*"
            />
            <button
              onClick={handleClickUpload}
              className="bg-[#9D9995] font-[500] border rounded-[5px] w-[32%] py-[3px] text-[14px]"
            >
              Chọn ảnh
            </button>
            <img
              className='border rounded-[100%] w-[250px] h-[250px] object-cover mt-2'
              src={previewAvatar || accountUser.avatar} // Fallback về ảnh gốc nếu chưa có preview
              alt="Avatar preview"
            />
          </div>
        </form>
      ): (
        <div className="w-[70%] p-10 text-center">Đang tải thông tin...</div>
      )}
    </>
  )
}

export default EditMyAccountClient