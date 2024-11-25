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

export const adminSignin = async (req, res, next) => {
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
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json(adminWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const adminSignout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "Admin signed out successfully." });
  } catch (error) {
    next(error);
  }
};

export const updateAdminDetails = async (req, res, next) => {
  const { id } = req.params;
  const { fullname, username, email, avatar } = req.body;
  try {
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

export const fetchAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false });
    //     const users = await User.find({ isAdmin: { $ne: "true" } });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUserDetails = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(
      errorHandler(400, "Invalid user id, try again with valid user id.")
    );
  }

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

  const updateData = {
    fullname,
    username,
    avatar,
    email,
    password,
    localno,
    whatsappno,
    linkedin,
    facebook,
    instagram,
  };

  if (password) {
    updateData.password = bcryptjs.hashSync(password, 10);
  }

  try {
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
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(
      errorHandler(400, "Invalid user id, try again with valid user id.")
    );
  }

  try {
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

export const fetchUserProperties = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(
      errorHandler(400, "Invalid user id, try again with valid user id.")
    );
  }
  try {
    const properties = await Property.find({ userRef: id });

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

export const deleteUserProperty = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(
      errorHandler(400, "Invalid user id, try again with valid user id.")
    );
  }

  try {
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) {
      return next(errorHandler(400, "Property not found."));
    }

    res.status(200).json({ message: "Property deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const updatePropertyDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        errorHandler(
          400,
          "Property not found try again with valid property id."
        )
      );
    }

    const property = await Property.findById(id);
    if (!property) return next(errorHandler(401, "Property not found."));

    const {
      title,
      description,
      area,
      address,
      regularPrice,
      discountPrice,
      bedrooms,
      bathrooms,
      kitchens,
      floors,
      imageUrls,
      offer,
    } = req.body;

    console.log(req.body);

    if (
      !title?.trim() ||
      !description?.trim() ||
      !area?.trim() ||
      !address?.trim()
    ) {
      return next(errorHandler(400, "Please fill in all required fields."));
    }

    if (
      [floors, bedrooms, bathrooms, kitchens].some(
        (value) => value <= 0 || isNaN(value)
      )
    ) {
      return next(
        errorHandler(
          400,
          "Please enter valid numeric values for property details."
        )
      );
    }
    if (regularPrice < 10000) {
      return next(
        errorHandler(400, `Regular price must be greater than 10000.`)
      );
    }

    if (offer && (discountPrice <= 0 || discountPrice >= regularPrice * 0.95)) {
      return next(
        errorHandler(
          400,
          "Discount price must be greater than 0 and at least 5% less than regular price."
        )
      );
    }

    if (!imageUrls || imageUrls.length === 0) {
      return next(errorHandler(400, "Please upload at least one image."));
    }

    if (imageUrls.length > 6) {
      return next(errorHandler(400, "You can upload a maximum of 6 images."));
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};
