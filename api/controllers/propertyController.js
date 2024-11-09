import mongoose from "mongoose";
import Property from "../models/propertyModel.js";
import { errorHandler } from "../utils/error.js";

export const createProperty = async (req, res, next) => {
  if (req.user.username === "demouser") {
    return next(errorHandler(403, "Demo users cannot create properties."));
  }

  try {
    const property = await Property.create(req.body);
    return res.status(201).json(property);
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid property ID format!",
    });
  }

  try {
    const property = await Property.findById(id);
    if (!property) return next(errorHandler(401, "Property not found!"));

    if (req.user.username === "demouser") {
      return next(errorHandler(403, "Demo users cannot delete properties."));
    }

    if (req.user.id !== property.userRef.toString())
      return next(
        errorHandler(403, "You can only delete your own properties!")
      );

    await Property.findByIdAndDelete(id);

    res.status(200).json({ message: "Property deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID format!",
      });
    }

    const property = await Property.findById(id);
    if (!property) return next(errorHandler(401, "Property not found!"));

    if (req.user.username === "demouser") {
      return next(errorHandler(403, "Demo users cannot update properties."));
    }

    if (req.user.id !== property.userRef.toString())
      return next(errorHandler(403, "You can only update your own property!"));

    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};

export const viewProperty = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid property ID format!",
    });
  }

  try {
    const property = await Property.findById(id);
    if (!property) return next(errorHandler(401, "Property not found!"));

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

export const viewProperties = async (req, res, next) => {
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
      type = { $in: ["house", "shop", "flat", "farmhouse"] };
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
