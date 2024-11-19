import mongoose from "mongoose";
import Property from "../models/propertyModel.js";
import { errorHandler } from "../utils/error.js";

export const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      area,
      address,
      regularPrice,
      discountPrice,
      bedrooms,
      bathrooms,
      kitchens,
      floors,
      imageUrls,
      offer,
    } = req.body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !area?.trim() ||
      !address?.trim()
    ) {
      return next(errorHandler(400, "Please fill in all required fields."));
    }

    if (
      [floors, bedrooms, bathrooms, kitchens].some(
        (value) => value <= 0 || isNaN(value)
      )
    ) {
      return next(
        errorHandler(
          400,
          "Please enter valid numeric values for property details."
        )
      );
    }

    if (regularPrice < 10000) {
      return next(
        errorHandler(400, `Regular price must be greater than 10000.`)
      );
    }
    if (offer && discountPrice >= regularPrice * 0.95) {
      return next(
        errorHandler(
          400,
          "Discount price must be at least 5% less than regular price."
        )
      );
    }

    if (!imageUrls || imageUrls.length === 0) {
      return next(errorHandler(400, "Please upload at least one image."));
    }

    if (imageUrls.length > 6) {
      return next(errorHandler(400, "You can upload a maximum of 6 images."));
    }

    const property = await Property.create(req.body);
    return res.status(201).json(property);
  } catch (error) {
    next(error);
  }
};

export const viewProperty = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(
      errorHandler(400, "Property not found try again with valid property id.")
    );
  }

  try {
    const property = await Property.findById(id);
    if (!property) return next(errorHandler(401, "Property not found."));

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};
