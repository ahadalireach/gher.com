import express from "express";
import {
  updateUserProfile,
  deleteUserProfile,
  fetchUserInfo,
  fetchUserOwnedProperties,
} from "../controllers/userController.js";
import { verifyUser } from "../utils/verifyUser.js";
const router = express.Router();

router.put("/update-user/:id", verifyUser, updateUserProfile);
router.delete("/delete-user/:id", verifyUser, deleteUserProfile);
router.get("/user-info/:id", fetchUserInfo);
router.get("/user-properties/:id", verifyUser, fetchUserOwnedProperties);

export default router;
