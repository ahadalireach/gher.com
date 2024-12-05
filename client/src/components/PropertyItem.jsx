/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { MdLocationOn, MdLocalOffer } from "react-icons/md";
import { FaBed, FaBath } from "react-icons/fa";

const PropertyItem = ({ property }) => {
  const placeholderImage =
    "https://media.licdn.com/dms/image/v2/C5112AQGk0v07-__eww/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1572933362281?e=2147483647&v=beta&t=FDjGV-8_D-kwPDWM9qga5ssTsEdsqJyriz1GtQOQgc8";

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
      <div className="relative">
        {property.offer && (
          <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center">
            <MdLocalOffer className="mr-1" /> Offer
          </div>
        )}
        <img
          src={property.imageUrls?.[0] || placeholderImage}
          alt={property.title}
          className="w-full h-48 md:h-56 object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="p-4 space-y-3">
        <Link to={`/property/${property._id}`} className="group">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition">
            {property.title.length > 80
              ? property.title.slice(0, 80) + "..."
              : property.title}
          </h3>
        </Link>

        <div className="flex items-center text-gray-600 space-x-2">
          <MdLocationOn className="text-green-600" />
          <p className="text-sm truncate">{property.address}</p>
        </div>

        <div className="text-green-700 font-bold text-xl">
          Rs {property.regularPrice.toLocaleString()}
          {property.purpose === "rent" && (
            <span className="text-sm">/month</span>
          )}
        </div>

        <div className="flex justify-start gap-5 text-gray-600 text-sm">
          <div className="flex items-center space-x-2">
            <FaBed className="text-green-600" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaBath className="text-green-600" />
            <span>{property.bathrooms} Bath</span>
          </div>
        </div>

        <Link
          to={`/property/${property._id}`}
          className="mt-4 block text-center w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyItem;
