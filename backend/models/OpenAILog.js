import mongoose from "mongoose";
const { Schema } = mongoose;

const OpenAILogSchema = new Schema({
  request: Schema.Types.Mixed,
  response: Schema.Types.Mixed,
  model: String,
  tokensUsed: Number,
  costEstimate: Number,
  createdAt: { type: Date, default: Date.now, index: true }
});
// Optionally set TTL: { expireAfterSeconds: 60*60*24*30 } to keep only 30 days

export default mongoose.models.OpenAILog || mongoose.model('OpenAILog', OpenAILogSchema);
