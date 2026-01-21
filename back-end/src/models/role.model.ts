import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    titleId: {
      type: String,
      required: true
    },
    description: String,
    permissions: {
      type: [String],
      default: []
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date
      }
    ]
  },
  {
    timestamps: true
  }
)

const RoleModel = mongoose.model('Role', roleSchema, 'roles')

export default RoleModel
