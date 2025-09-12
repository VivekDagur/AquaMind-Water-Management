import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema({
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', index: true },
  role: { type: String, enum: ['user','assistant','system','function'], required: true },
  content: { type: String },
  contentJSON: { type: Schema.Types.Mixed }, // structured parts if needed
  tokens: { type: Number, default: 0 },
  model: { type: String },
  createdAt: { type: Date, default: Date.now, index: true }
});

// text index for search over content
MessageSchema.index({ content: 'text' });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
