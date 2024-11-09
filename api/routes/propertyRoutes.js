import express from "express";
import {
  createProperty,
  deleteProperty,
  updateProperty,
  viewProperty,
  viewProperties,
} from "../controllers/propertyController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createProperty);
router.delete("/delete/:id", verifyToken, deleteProperty);
router.post("/update/:id", verifyToken, updateProperty);
router.get("/view-property/:id", viewProperty);
router.get("/view-properties", viewProperties);

export default router;
