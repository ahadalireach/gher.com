import mongoose from "mongoose";
import { Property } from "../models/propertyModel.js";
import { errorHandler } from "../utils/error.js";

export const createNewProperty = async (req, res, next) => {
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

    if (offer && (discountPrice <= 0 || discountPrice >= regularPrice * 0.95)) {
      return next(
        errorHandler(
          400,
          "Discount price must be greater than 0 and at least 5% less than regular price."
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

export const fetchAllProperties = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let purpose = req.query.purpose;

    if (purpose === undefined || purpose === "allPurposes") {
      purpose = { $in: ["sell", "rent"] };
    }

    let type = req.query.type;
    if (type === undefined || type === "allTypes") {
      type = { $in: ["house", "flat", "farmhouse"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const nearbyFilters = [
      "school",
      "hospital",
      "shoppingMalls",
      "publicTransport",
      "restaurants",
      "internet",
      "playarea",
      "gym",
      "pool",
      "communityCenter",
    ];

    const nearbyConditions = {};
    nearbyFilters.forEach((filter) => {
      if (req.query.nearby && req.query.nearby.split(",").includes(filter)) {
        nearbyConditions[filter] = true;
      }
    });

    const properties = await Property.find({
      title: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      purpose,
      type,
      ...nearbyConditions,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

export const fetchPropertyDetails = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(
      errorHandler(
        400,
        "Invalid property id, try again with valid property id."
      )
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

export const updatePropertyDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        errorHandler(
          400,
          "Property not found try again with valid property id."
        )
      );
    }

    const property = await Property.findById(id);
    if (!property) return next(errorHandler(401, "Property not found."));

    if (req.user.id !== property.userRef.toString())
      return next(errorHandler(403, "You can only update your own property."));

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

    console.log(req.body);

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

    if (offer && (discountPrice <= 0 || discountPrice >= regularPrice * 0.95)) {
      return next(
        errorHandler(
          400,
          "Discount price must be greater than 0 and at least 5% less than regular price."
        )
      );
    }

    if (!imageUrls || imageUrls.length === 0) {
      return next(errorHandler(400, "Please upload at least one image."));
    }

    if (imageUrls.length > 6) {
      return next(errorHandler(400, "You can upload a maximum of 6 images."));
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(
      errorHandler(
        400,
        "Invalid property id, try again with valid property id."
      )
    );
  }

  try {
    const property = await Property.findById(id);
    if (!property) return next(errorHandler(401, "Property not found."));

    if (req.user.id !== property.userRef.toString())
      return next(
        errorHandler(403, "You can only delete your own properties.")
      );

    await Property.findByIdAndDelete(id);
    res.status(200).json({ message: "Property deleted successfully." });
  } catch (error) {
    next(error);
  }
};
