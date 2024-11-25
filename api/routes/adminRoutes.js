import express from "express";
import { verifyAdmin } from "../utils/verifyAdmin.js";
import {
  //   createAdminUser,
  adminSignin,
  adminSignout,
  updateAdminDetails,
  fetchAllUsers,
  fetchUserProperties,
  deleteUser,
  updateUserDetails,
  updatePropertyDetails,
  deleteUserProperty,
} from "../controllers/adminController.js";
const router = express.Router();

// router.post("/", createAdminUser);
router.post("/signin", adminSignin);
router.get("/signout", adminSignout);
router.put("/update-admin/:id", verifyAdmin, updateAdminDetails);
router.get("/view-users", verifyAdmin, fetchAllUsers);
router.post("/update-user/:id", verifyAdmin, updateUserDetails);
router.delete("/delete-user/:id", verifyAdmin, deleteUser);
router.get("/user-properties/:id", verifyAdmin, fetchUserProperties);
router.put("/update-property/:id", verifyAdmin, updatePropertyDetails);
router.delete("/delete-property/:id", verifyAdmin, deleteUserProperty);

export default router;
