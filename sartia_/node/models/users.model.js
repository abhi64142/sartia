const { Schema } = require("mongoose");
var mongoose = require("mongoose");

var UsersSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    user_name: { type: String },
    password: { type: String, required: true },
    is_active: { type: Boolean, required: true, default: true },
    otp: { type: String, required: true },
    user_type: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UsersSchema);
