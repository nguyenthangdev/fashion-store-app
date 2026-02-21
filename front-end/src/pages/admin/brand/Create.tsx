
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { useEffect } from 'react'
import useCreate from '~/hooks/admin/brand/useCreate'

const CreateBrand = () => {
  const {
    handleChangeTitle,
    preview,
    handleFileChange,
    handleSubmit,
    title,
    navigate,
    handleChangeStatus,
    status,
    role
  } = useCreate()

  useEffect(() => {
    if (!role || !role.permissions.includes('brands_create')) {
      const timer = setTimeout(() => {
        navigate('/admin/admin-welcome', { replace: true })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [role, navigate])

  if (!role || !role.permissions.includes('brands_create')) {
    return (
      <div className="bg-white p-6 rounded shadow-md mt-4">
        <p className="text-red-500 text-center text-lg font-medium">
          Bạn không có quyền truy cập trang này. Đang chuyển hướng...
        </p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tạo mới Thương hiệu</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md">
        <TextField
          label="Tiêu đề"
          value={title}
          onChange={handleChangeTitle}
          variant="outlined"
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel id="status-label">Trạng thái</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            value={status}
            label="Trạng thái"
            onChange={handleChangeStatus}
          >
            <MenuItem value={'ACTIVE'}>Hoạt động</MenuItem>
            <MenuItem value={'INACTIVE'}>Không hoạt động</MenuItem>
          </Select>
        </FormControl>
        <div>
          <Button variant="contained" component="label">
            Chọn Logo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          {preview &&
            <img
              src={preview}
              alt="Logo preview"
              className="w-32 h-32 object-contain mt-4 border"
            />
          }
        </div>
        <div className="flex gap-4">
          <Button type="submit" variant="contained" color="primary">Tạo mới</Button>
          <Button variant="outlined" onClick={() => navigate('/admin/brands')}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateBrand
