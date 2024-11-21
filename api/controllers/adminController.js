import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { User } from "../models/userModel.js";
import { Property } from "../models/propertyModel.js";
import { errorHandler } from "../utils/error.js";

// export const createAdminUser = async (req, res) => {
//   try {
//     const { fullname, username, email, password } = req.body;

//     if (!fullname || !username || !email || !password) {
//       return next(errorHandler(400, "All fields are required."));
//     }

//     const existingAdmin = await User.findOne({ isAdmin: true });
//     if (existingAdmin) {
//       return next(errorHandler(400, "Admin user already exists."));
//     }

//     const adminUser = new User({
//       fullname,
//       username,
//       email,
//       password: bcryptjs.hashSync(password, 10),
//       isAdmin: true,
//     });

//     await adminUser.save();

//     res.status(201).json("Admin user created successfully");
//   } catch (error) {
//     console.error("Error creating admin user:", error.message);
//     res.status(500).json({ message: `Server error: ${error.message}` });
//   }
// };

export const signinAdmin = async (req, res, next) => {
  const { loginIdentifier, password } = req.body;

  if (!loginIdentifier || !password)
    return next(errorHandler(400, "Both fields are required."));

  try {
    const admin = await User.findOne({
      $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
      isAdmin: true,
    });
    if (!admin) return next(errorHandler(401, "Invalid credentials."));

    const isPasswordValid = bcryptjs.compareSync(password, admin.password);
    if (!isPasswordValid)
      return next(errorHandler(401, "Invalid credentials."));

    const token = jwt.sign(
      { id: admin._id, isAdmin: admin.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: _, ...adminWithoutPassword } = admin._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(adminWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const signoutAdmin = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "Admin signed out successfully." });
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const { fullname, username, email, avatar } = req.body;
    const { id } = req.params;

    const updates = {
      fullname: fullname || undefined,
      username: username || undefined,
      email: email || undefined,
      avatar: avatar || undefined,
    };

    const updatedAdmin = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    const { password: _, ...adminWithoutPassword } = updatedAdmin._doc;
    res.status(200).json(adminWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const viewAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false });
    //     const users = await User.find({ isAdmin: { $ne: "true" } });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
