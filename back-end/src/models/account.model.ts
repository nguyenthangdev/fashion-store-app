import mongoose from 'mongoose'

const accountSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false // Quan trọng: Ẩn mật khẩu khỏi các truy vấn find()
    },
//     refreshToken: {
//       type: String,
//       select: false
//     },
    phone: String,
    avatar: String,
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role' // Tham chiếu đến model Role (Giả sử tên model là 'Role')
    },
    status: {
      type: String,
      enum: ['active', 'inactive'], // Chỉ cho phép 2 giá trị này
      default: 'active'
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
)

const Account = mongoose.model('Account', accountSchema, 'accounts')

export default Account

