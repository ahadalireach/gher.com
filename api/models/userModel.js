import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: [true, "Full name is required!"] },
    username: {
      type: String,
      required: [true, "Username is required!"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Email must be valid"],
    },
    password: { type: String, required: [true, "Password is required!"] },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
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
