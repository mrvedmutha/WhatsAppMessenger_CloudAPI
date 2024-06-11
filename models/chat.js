const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    from: {
      type: Number,
      default: 914445008192,
    },
    to: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true, // Adding required to ensure messages are stored correctly
    },
    contact: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
); // This will automatically add `created_at` and `updated_at` fields

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
