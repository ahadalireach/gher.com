import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { User } from "../models/userModel.js";
import { Property } from "../models/propertyModel.js";
import { errorHandler } from "../utils/error.js";

export const updateUserProfile = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(
      errorHandler(400, "Invalid user id, try again with valid user id.")
    );
  }

  if (req.user.id !== id) {
    return next(errorHandler(401, "You can only update your own account."));
  }

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

  if (!/^[a-zA-Z\s]+$/.test(fullname)) {
    return next(
      errorHandler(400, "Fullname can only contain alphabets and spaces.")
    );
  }

  if (
    /^\d/.test(username) ||
    /[^a-zA-Z0-9.]/.test(username) ||
    /\s/.test(username)
  ) {
    return next(
      errorHandler(
        400,
        "Username cannot begin with a number, contain spaces, or include invalid characters."
      )
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(errorHandler(400, "Invalid email format."));
  }

  try {
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
      return next(
        errorHandler(
          400,
          "Please enter a valid country code for contact numbers."
        )
      );
    }

    if (
      (facebook === "" ||
        linkedin === "" ||
        instagram === "" ||
        whatsappno === "" ||
        localno === "") &&
      (existingUser.facebook ||
        existingUser.linkedin ||
        existingUser.instagram ||
        existingUser.whatsappno ||
        existingUser.localno)
    ) {
      return next(
        errorHandler(
          400,
          "You cannot clear fields that already have values. Please provide valid data."
        )
      );
    }

    if (password) req.body.password = bcryptjs.hashSync(password, 10);

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
      facebook: facebook || existingUser.facebook,
      linkedin: linkedin || existingUser.linkedin,
      instagram: instagram || existingUser.instagram,
      whatsappno: whatsappno || existingUser.whatsappno,
      localno: localno || existingUser.localno,
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

export const deleteUserProfile = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json("Invalid user id, try again with valid user id.");
  }

  if (req.user.id !== id) {
    return next(errorHandler(401, "You can only delete your own account."));
  }

  try {
    await Property.deleteMany({ userRef: id });
    await User.findByIdAndDelete(id);
    res.clearCookie("access_token");
    res.status(200).json({
      message: "User and associated properties deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const fetchUserInfo = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(
      errorHandler(400, "Invalid user id, try again with valid user id.")
    );
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

export const fetchUserOwnedProperties = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json("Invalid user id, try again with valid user id.");
  }

  if (req.user.id !== id) {
    return next(errorHandler(401, "You can only access your own properties."));
  }

  try {
    const properties = await Property.find({ userRef: id });
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};
