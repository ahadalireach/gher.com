import express from "express";
import {
  signinUser,
  signupUser,
  google,
  signoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.route("/signup").post(signupUser);
router.route("/signin").post(signinUser);
router.route("/google").post(google);
router.route("/signout").get(signoutUser);

export default router;
