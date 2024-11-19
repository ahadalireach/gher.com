import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(errorHandler(400, "Invalid user ID format."));
  }

  if (req.user.id !== id) {
    return next(errorHandler(401, "You can only update your own account."));
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

    if (/\s/.test(username) || /[-$]/.test(username) || /^\d/.test(username)) {
      return next(
        errorHandler(
          400,
          "Username cannot begin with a number, contain spaces, '-' or '$'."
        )
      );
    }

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return next(errorHandler(400, "User not found."));
    }

    const lowercaseUsername = username ? username.toLowerCase() : undefined;

    if (lowercaseUsername && lowercaseUsername !== existingUser.username) {
      const usernameExists = await User.findOne({
        username: lowercaseUsername,
      });
      if (usernameExists) {
        return next(errorHandler(400, "Username already exists."));
      }
    }

    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return next(errorHandler(400, "Email already exists."));
      }
    }

    const countryCodePattern = /^\+\d+/;

    if (
      (localno &&
        (!countryCodePattern.test(localno) ||
          localno.length < 6 ||
          localno.length > 15)) ||
      (whatsappno &&
        (!countryCodePattern.test(whatsappno) ||
          whatsappno.length < 6 ||
          whatsappno.length > 15))
    ) {
      return next(errorHandler(401, "Please enter a valid country code."));
    }

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

    const { password: _, ...userWithoutPassword } = updatedUser._doc;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json("Invalid user ID format.");
  }

  if (req.user.id !== id) {
    return next(errorHandler(401, "You can only delete your own account."));
  }

  try {
    await User.findByIdAndDelete(id);
    res.clearCookie("access_token");
    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(errorHandler(400, "Invalid user ID format."));
  }

  try {
    const user = await User.findById(id);
    if (!user) return next(errorHandler(404, "User not found."));

    const { password: _, ...userWithoutPassword } = user._doc;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};
