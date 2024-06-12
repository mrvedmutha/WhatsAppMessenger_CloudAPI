const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  waId: { type: Number, unique: true },
  name: String,
});

module.exports = mongoose.model("User", userSchema);
