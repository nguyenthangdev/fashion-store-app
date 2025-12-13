import mongoose, { Document, Schema } from 'mongoose'

export interface ISession extends Document {
  accountId: mongoose.Types.ObjectId
  refreshTokenHash: string
  userAgent?: string
  ip?: string
  deviceName?: string
  createdAt: Date
  expiresAt: Date
}

const SessionSchema = new Schema<ISession>({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  refreshTokenHash: { type: String, required: true },
  userAgent: { type: String },
  ip: { type: String },
  deviceName: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
})

SessionSchema.index({ accountId: 1 })
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // optional if you want TTL

export default mongoose.model<ISession>('Session', SessionSchema, 'sessions')
