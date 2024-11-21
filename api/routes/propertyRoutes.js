import express from "express";
import {
  createProperty,
  viewProperty,
  deleteProperty,
  updateProperty,
  viewProperties,
} from "../controllers/propertyController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create-property", verifyToken, createProperty);
router.get("/view-properties", viewProperties);
router.get("/view-property/:id", viewProperty);
router.post("/update-property/:id", verifyToken, updateProperty);
router.delete("/delete-property/:id", verifyToken, deleteProperty);

export default router;
