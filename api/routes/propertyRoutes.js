import express from "express";
import {
  createProperty,
  viewProperty,
} from "../controllers/propertyController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createProperty);
router.get("/view-property/:id", viewProperty);

export default router;
