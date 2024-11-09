import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    area: { type: String, required: true },
    regularPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    floors: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    kitchens: { type: Number, required: true },
    furnished: { type: Boolean, required: true },
    parking: { type: Boolean, required: true },
    type: { type: String, required: true },
    purpose: { type: String, required: true },
    offer: { type: Boolean, required: true },
    school: { type: Boolean, required: true },
    hospital: { type: Boolean, required: true },
    shoppingMalls: { type: Boolean, required: true },
    publicTransport: { type: Boolean, required: true },
    restaurants: { type: Boolean, required: true },
    internet: { type: Boolean, required: true },
    playarea: { type: Boolean, required: true },
    gym: { type: Boolean, required: true },
    pool: { type: Boolean, required: true },
    communityCenter: { type: Boolean, required: true },
    imageUrls: { type: Array, required: true },
    userRef: { type: String, required: true },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
export default Property;
