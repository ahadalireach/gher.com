import express from "express";
import { verifyAdmin } from "../utils/verifyAdmin.js";
import {
  //   createAdminUser,
  signinAdmin,
  signoutAdmin,
  updateAdmin,
  viewAllUsers,
  viewUser,
  viewUserProperties,
  updateUserProperty,
  deleteUserProperty,
  updateUser,
  deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

// router.post("/", createAdminUser);
router.post("/signin", signinAdmin);
router.get("/signout", signoutAdmin);
router.post("/update/:id", verifyAdmin, updateAdmin);
router.get("/users", verifyAdmin, viewAllUsers);
router.get("/user-profile/:id", verifyAdmin, viewUser);
router.post("/user/:id", verifyAdmin, updateUser);
router.delete("/user/:id", verifyAdmin, deleteUser);
router.get("/user-properties/:id", verifyAdmin, viewUserProperties);
router.put("/property/:id", verifyAdmin, updateUserProperty);
router.delete("/property/:id", verifyAdmin, deleteUserProperty);

export default router;
