import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { User } from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";

export const registerUser = async (req, res, next) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password) {
    return next(errorHandler(400, "All fields are required."));
  }

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

  if (password.length < 8) {
    return next(
      errorHandler(400, "Password must be at least 8 characters long.")
    );
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(errorHandler(400, "Username or email already exists."));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Account created successfully." });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { loginIdentifier, password } = req.body;

  if (!loginIdentifier || !password)
    return next(errorHandler(400, "Both fields are required."));

  try {
    const user = await User.findOne({
      $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
    });
    if (!user)
      return next(
        errorHandler(404, "User not found. Please check your credentials.")
      );

    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid)
      return next(errorHandler(401, "Invalid credentials."));

    if (user.isAdmin)
      return next(
        errorHandler(403, "Admins cannot log in through this route.")
      );

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const googleSignin = async (req, res, next) => {
  const { fullname, email, photo } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: _, ...userWithoutPassword } = user._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        })
        .status(200)
        .json(userWithoutPassword);
    }

    const generatedPassword = `${Math.random()
      .toString(36)
      .slice(-8)}${Math.random().toString(36).slice(-8)}`;
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    user = new User({
      fullname,
      username:
        fullname.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email,
      password: hashedPassword,
      avatar: photo,
    });

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "User signed out successfully." });
  } catch (error) {
    next(error);
  }
};
