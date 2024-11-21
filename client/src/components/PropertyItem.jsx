/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBed, FaBath } from "react-icons/fa";

const PropertyItem = ({ property }) => {
  return (
    <div className="bg-white shadow-xl text-center border border-gray-200 hover:border-green-700 overflow-hidden w-full sm:w-[330px] md:w-[360px]">
      <img
        src={
          property.imageUrls[0] ||
          "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
        }
        alt="property cover"
        className="h-[270px] sm:h-[250px] w-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
      />
      <div className="p-4 flex flex-col gap-4 text-left">
        <Link to={`/property/${property._id}`}>
          <p className="truncate text-lg font-semibold text-gray-800 hover:text-green-700 transition-colors cursor-pointer">
            {property.title}
          </p>
        </Link>
        <div className="flex items-center gap-2 text-gray-600">
          <MdLocationOn className="h-5 w-5 text-green-700" />
          <p className="text-sm truncate">{property.address}</p>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">
          {property.description}
        </p>
        <p className="text-green-700 mt-2 font-bold text-lg">
          Rs:
          {property.offer
            ? property.discountPrice
              ? property.discountPrice.toLocaleString("en-US")
              : "N/A"
            : property.regularPrice
            ? property.regularPrice.toLocaleString("en-US")
            : "N/A"}
          {property.purpose === "rent" && " / month"}
        </p>
        <div className="text-gray-600 flex gap-4">
          <div className="flex items-center gap-1 text-xs">
            <FaBed className="text-green-700" />
            <span className="font-bold">
              {property.bedrooms} {property.bedrooms > 1 ? "beds" : "bed"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <FaBath className="text-green-700" />
            <span className="font-bold">
              {property.bathrooms} {property.bathrooms > 1 ? "baths" : "bath"}
            </span>
          </div>
        </div>
        <Link
          to={`/property/${property._id}`}
          className="flex items-center justify-center mt-4 bg-green-700 text-white p-3 rounded-lg text-sm font-semibold hover:bg-green-800 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyItem;
