import express from "express";
import {
  registerUser,
  loginUser,
  googleSignin,
  logoutUser,
} from "../controllers/authController.js";
const router = express.Router();

router.route("/signup").post(registerUser);
router.route("/signin").post(loginUser);
router.route("/google").post(googleSignin);
router.route("/signout").get(logoutUser);

export default router;
