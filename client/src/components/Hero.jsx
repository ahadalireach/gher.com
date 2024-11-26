import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { banner } from "../assets";

const Hero = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-col flex-1 items-start justify-center text-left p-6 mt-14 sm:mt-0">
          <h6 className="text-sm font-extrabold text-gray-800 flex items-center justify-center sm:justify-start mb-4">
            <FaHome className="mr-2 text-green-700 font-semibold font-base" />
            Real Estate Agency
          </h6>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Find Your
            <br />
            <span className="text-green-700">Dream</span> Home
          </h1>
          <div className="flex items-center text-sm sm:text-lg text-gray-600 mb-8 sm:w-8/12">
            <div className="w-2 h-14 sm:h-16 bg-green-700 rounded-full mr-0 sm:mr-4" />
            <span className="text-gray-500 p-3">
              Make your property search easy with our seamless platform.
            </span>
          </div>

          <div className="flex justify-center sm:justify-start gap-4 mb-14 sm:mb-0 ">
            <Link
              to="/properties/"
              className="bg-green-700 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-800"
            >
              View Properties
            </Link>
          </div>
        </div>

        <div className="flex-1">
          <img
            src={banner}
            className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};
export default Hero;
