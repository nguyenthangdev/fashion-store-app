export const API_ROOT = import.meta.env.VITE_API_ROOT
export const API_KEY = import.meta.env.VITE_TINYMCE_API_KEY

export const ORDER_STATUSES_CHANGEMULTI = [
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'TRANSPORTING', label: 'Đang vận chuyển' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'CANCELED', label: 'Đã hủy' },
  { value: 'DELETEALL', label: 'Xóa tất cả' }
]

export const ORDERTRASH_STATUSES_CHANGEMULTI = [
  { value: 'RECOVER', label: 'Khôi phục' },
  { value: 'DELETEALL', label: 'Xóa vĩnh viễn' }
]

export const PRODUCTCATEGORY_STATUSES_CHANGEMULTI = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Ngừng hoạt động' },
  { value: 'DELETEALL', label: 'Xóa tất cả' }
]

export const PRODUCTCATEGORYTRASH_STATUSES_CHANGEMULTI = [
  { value: 'RECOVER', label: 'Khôi phục' },
  { value: 'DELETEALL', label: 'Xóa vĩnh viễn' }
]

export const PRODUCT_STATUSES_CHANGEMULTI = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Ngừng hoạt động' },
  { value: 'DELETEALL', label: 'Xóa tất cả' }
]

export const PRODUCTTRASH_STATUSES_CHANGEMULTI = [
  { value: 'RECOVER', label: 'Khôi phục' },
  { value: 'DELETEALL', label: 'Xóa vĩnh viễn' }
]

export const ARTICLECATEGORY_STATUSES_CHANGEMULTI = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Ngừng hoạt động' },
  { value: 'DELETEALL', label: 'Xóa tất cả' }
]

export const ARTICLE_STATUSES_CHANGEMULTI = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Ngừng hoạt động' },
  { value: 'DELETEALL', label: 'Xóa tất cả' }
]