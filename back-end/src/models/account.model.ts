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
      select: false
    },
    phone: {
      type: String,
      required: true
    },
    avatar: String,
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      require: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE'
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

const AccountModel = mongoose.model('Account', accountSchema, 'accounts')

export default AccountModel

