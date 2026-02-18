export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
export const singleFileValidator = (file: { name: string, size: number, type: string }) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'Tệp không được để trống.'
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'Kích thước tệp vượt quá giới hạn cho phép. (10MB)'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'Loại tệp không hợp lệ. Chỉ chấp nhận jpg, jpeg và png'
  }
  return null
}