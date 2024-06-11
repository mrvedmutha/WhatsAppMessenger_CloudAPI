const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  waId: Number,
  name: String,
});

module.exports = mongoose.model("User", userSchema);
