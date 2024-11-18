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
    avatar: {
      type: String,
      default:
        "https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg",
    },
    linkedin: {
      type: String,
      default: null,
      unique: false,
    },
    facebook: {
      type: String,
      default: null,
      unique: false,
    },
    instagram: {
      type: String,
      default: null,
      unique: false,
    },
    localno: {
      type: String,
      default: null,
      unique: false,
    },
    whatsappno: {
      type: String,
      default: null,
      unique: false,
    },
    isAdmin: { type: Boolean, default: false },
    isUpdated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
