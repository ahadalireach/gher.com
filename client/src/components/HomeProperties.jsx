/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { PropertyItem } from ".";

const HomeProperties = ({ title, properties, url }) => {
  return (
    <div className="text-center max-w-6xl mx-auto p-3 flex flex-col gap-8 my-5">
      <div className="my-1">
        <h2 className="text-sm text-green-800 font-semibold mb-2 bg-green-200 rounded-lg inline-block py-2 px-4">
          {title}
        </h2>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {properties.map((property) => (
          <PropertyItem property={property} key={property._id} />
        ))}
      </div>
      <div className="text-center mt-4">
        <Link
          to={url}
          className="inline-block bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-green-800 transition-colors"
        >
          View All Offers
        </Link>
      </div>
    </div>
  );
};
export default HomeProperties;
