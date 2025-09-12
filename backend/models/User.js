import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, unique: true, sparse: true, index: true },
  name: { type: String },
  passwordHash: { type: String }, // nullable if OAuth-only
  provider: { type: String, enum: ['local','google','github','anonymous'], default: 'anonymous' },
  role: { type: String, default: 'user' },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
