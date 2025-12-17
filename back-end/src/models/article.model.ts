import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    article_category_id: {
      type: String,
      default: ''
    },
    descriptionShort: String,
    descriptionDetail: String,
    thumbnail: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE'
    },
    featured: String,
    slug: {
      type: String,
      slug: 'title', // <-> San-pham-1
      unique: true // slug duy nhất
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      account_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Account'
      }
    },
    deletedBy: {
       account_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Account'
      },
      deletedAt: Date
    },
    updatedBy: [
      {
        account_id: {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Account'
      },
        updatedAt: Date
      }
    ],
    recoveredAt: Date
  },
  {
    timestamps: true
  }
)

// INDEXES 
articleSchema.index({ title: 1, deleted: 1 })
articleSchema.index({ deleted: 1, status: 1, createdAt: -1 })


const Article = mongoose.model('Article', articleSchema, 'articles')

export default Article
