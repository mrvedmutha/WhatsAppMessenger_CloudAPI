const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true, // Adding required to ensure messages are stored correctly
  },
  msg_is: { type: String, enum: ["sent", "received"], required: true },
  timestamp: { type: Date, default: Date.now },
}); // This will automatically add `created_at` and `updated_at` fields

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
