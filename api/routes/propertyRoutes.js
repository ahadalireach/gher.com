import express from "express";
import {
  createNewProperty,
  fetchAllProperties,
  fetchPropertyDetails,
  updatePropertyDetails,
  deleteProperty,
} from "../controllers/propertyController.js";
import { verifyUser } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create-property", verifyUser, createNewProperty);
router.get("/view-properties", fetchAllProperties);
router.get("/view-property/:id", fetchPropertyDetails);
router.put("/update-property/:id", verifyUser, updatePropertyDetails);
router.delete("/delete-property/:id", verifyUser, deleteProperty);

export default router;
