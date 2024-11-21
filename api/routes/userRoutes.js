import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUserProperties,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update-user/:id", verifyToken, updateUser);
router.delete("/delete-user/:id", verifyToken, deleteUser);
router.get("/user-info/:id", getUser);
router.get("/view-properties/:id", verifyToken, getUserProperties);

export default router;
