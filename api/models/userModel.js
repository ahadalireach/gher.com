import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
