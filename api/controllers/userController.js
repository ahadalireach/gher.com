import mongoose from "mongoose";
import Property from "../models/propertyModel.js";
import { User } from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user ID format!" });
  }

  if (req.user.id !== id) {
    return next(errorHandler(401, "You can only update your own account!"));
  }

  try {
    const {
      fullname,
      username,
      email,
      password,
      avatar,
      facebook,
      linkedin,
      instagram,
      whatsappno,
      localno,
    } = req.body;

    if (password) {
      req.body.password = bcryptjs.hashSync(password, 10);
    }

    const allFieldsProvided = [
      facebook,
      linkedin,
      instagram,
      whatsappno,
      localno,
    ].every(Boolean);
    const isUpdated = allFieldsProvided;

    const lowercaseUsername = username ? username.toLowerCase() : undefined;

    const updates = {
      fullname: fullname || undefined,
      username: lowercaseUsername || undefined,
      email: email || undefined,
      password: req.body.password || undefined,
      avatar: avatar || undefined,
      facebook: facebook || undefined,
      linkedin: linkedin || undefined,
      instagram: instagram || undefined,
      whatsappno: whatsappno || undefined,
      localno: localno || undefined,
      isUpdated,
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const { password: userPassword, ...rest } = updatedUser._doc;

    res.status(200).json({
      success: true,
      ...rest,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user ID format!" });
  }

  if (req.user.id !== id) {
    return next(errorHandler(401, "You can only delete your own account"));
  }

  try {
    await Property.deleteMany({ userRef: id });
    await User.findByIdAndDelete(id);
    res.clearCookie("access_token");
    res.status(200).json({
      message: "User and associated properties deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProperties = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user ID format!" });
  }

  if (req.user.id !== id) {
    return next(errorHandler(401, "You can only access your own properties!"));
  }

  try {
    const properties = await Property.find({ userRef: id });
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user ID format!" });
  }

  try {
    const user = await User.findById(id);
    if (!user) return next(errorHandler(404, "User not found"));

    const { password: pass, ...rest } = user._doc;
    res.status(200).json({ ...rest });
  } catch (error) {
    next(error);
  }
};
