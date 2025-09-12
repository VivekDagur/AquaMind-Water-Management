import mongoose from "mongoose";
const { Schema } = mongoose;

const ConversationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true, default: null },
  title: { type: String },
  model: { type: String, default: 'gpt-4o-mini' },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
ConversationSchema.index({ user: 1, updatedAt: -1 });

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
