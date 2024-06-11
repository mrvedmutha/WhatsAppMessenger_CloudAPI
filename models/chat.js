const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
); // This will automatically add `created_at` and `updated_at` fields

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
