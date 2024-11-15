import { User } from "../models/userModel.js";
import Property from "../models/propertyModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";

// export const createAdminUser = async (req, res) => {
//   try {
//     const { fullname, username, email, password } = req.body;

//     if (!fullname || !username || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingAdmin = await User.findOne({ isAdmin: true });
//     if (existingAdmin) {
//       return res.status(400).json({ message: "Admin user already exists" });
//     }

//     const adminUser = new User({
//       fullname,
//       username,
//       email,
//       password: bcryptjs.hashSync(password, 10),
//       isAdmin: true,
//     });

//     await adminUser.save();

//     res.status(201).json({
//       message: "Admin user created successfully",
//       adminUser: {
//         _id: adminUser._id,
//         fullname: adminUser.fullname,
//         username: adminUser.username,
//         email: adminUser.email,
//       },
//     });
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
    res.status(200).json("Admin signed out successfully.");
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (req, res, next) => {
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
    const { fullname, username, email, password, avatar } = req.body;

    if (password) {
      req.body.password = bcryptjs.hashSync(password, 10);
    }

    const updates = {
      fullname: fullname || undefined,
      username: username || undefined,
      email: email || undefined,
      password: req.body.password || undefined,
      avatar: avatar || undefined,
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

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

export const viewAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false });
    //     const users = await User.find({ isAdmin: { $ne: "true" } });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const viewUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format!",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const { password, ...userDetails } = user._doc;

    res.status(200).json({
      success: true,
      ...userDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      fullname,
      username,
      email,
      avatar,
      password,
      localno,
      whatsappno,
      linkedin,
      facebook,
      instagram,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format!",
      });
    }

    const updateData = {
      fullname,
      username,
      avatar,
      email,
      localno,
      whatsappno,
      linkedin,
      facebook,
      instagram,
    };

    if (password) {
      updateData.password = bcryptjs.hashSync(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format!",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    await Property.deleteMany({ userRef: id });

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const viewUserProperties = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format!",
      });
    }

    const properties = await Property.find({ userRef: id });

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

export const updateUserProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID format!",
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found!",
      });
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};

export const deleteUserProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID format!",
      });
    }

    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
