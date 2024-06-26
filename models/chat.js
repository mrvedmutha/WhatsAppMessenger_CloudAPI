const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    from: {
      type: Number,
    },
    to: {
      type: Number,
    },
    message: {
      type: String,
      required: true, // Adding required to ensure messages are stored correctly
    },
    contact: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    msg_is: String,
  },
  { timestamps: true }
); // This will automatically add `created_at` and `updated_at` fields

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
