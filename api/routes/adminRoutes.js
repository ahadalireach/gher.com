import express from "express";
import { verifyAdmin } from "../utils/verifyAdmin.js";
import {
  //   createAdminUser,
  signinAdmin,
  signoutAdmin,
  updateAdmin,
  viewAllUsers,
} from "../controllers/adminController.js";

const router = express.Router();

// router.post("/", createAdminUser);
router.post("/signin", signinAdmin);
router.get("/signout", signoutAdmin);
router.put("/update-admin/:id", verifyAdmin, updateAdmin);
router.get("/view-users", verifyAdmin, viewAllUsers);

export default router;
