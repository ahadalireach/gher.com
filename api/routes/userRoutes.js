import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/user-info/:id", getUser);

export default router;
