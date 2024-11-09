import express from "express";
import {
  updateUser,
  deleteUser,
  getUserProperties,
  getUser,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/properties/:id", verifyToken, getUserProperties);
router.get("/user-info/:id", getUser);

export default router;
