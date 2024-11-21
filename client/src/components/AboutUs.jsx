/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { FaHome, FaMountain, FaHeart, FaHandshake } from "react-icons/fa";
import { aboutImage1, aboutImage2 } from "../assets";

const aboutData = [
  {
    id: 1,
    icon: <FaHome className="text-green-700 w-6 h-6" />,
    text: "Modern Home Designs",
  },
  {
    id: 2,
    icon: <FaMountain className="text-green-700 w-6 h-6" />,
    text: "Beautiful, Peaceful Locations",
  },
  {
    id: 3,
    icon: <FaHeart className="text-green-700 w-6 h-6" />,
    text: "Comfortable Living Spaces",
  },
  {
    id: 4,
    icon: <FaHandshake className="text-green-700 w-6 h-6" />,
    text: "Friendly and Trustworthy Service",
  },
];

const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 flex items-center justify-center lg:justify-start mb-12 lg:mb-0 relative">
            <img
              src={aboutImage1}
              alt="About Us Image 1"
              className="w-full h-auto"
            />
            <div className="absolute bottom-0 left-0">
              <img
                src={aboutImage2}
                alt="About Us Image 2"
                className="w-full h-full object-cover border-16 border-white rounded-xl shadow-lg"
              />
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col justify-center sm:ml-10">
            <div className="mb-8">
              <h6 className="text-sm text-green-800 font-semibold mb-2 bg-green-200 rounded-lg inline-block py-2 px-4">
                About Us
              </h6>
              <h1 className="text-4xl sm:text-50 sm:leading-50 font-extrabold text-gray-900 mb-4">
                Your Top Choice for Real Estate
                <span className="text-green-700">.</span>
              </h1>
              <p className="text-gray-500">
                Bringing honesty and community to real estate, helping you find
                the perfect property and build strong relationships.
              </p>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-500">
              {aboutData.map(({ id, icon, text }) => (
                <li className="flex items-center" key={id}>
                  <div className="bg-green-100 p-2 rounded-full mr-3 flex items-center justify-center">
                    {icon}
                  </div>
                  {text}
                </li>
              ))}
            </ul>

            <div className="bg-green-100 p-6 mt-8 border-l-4 border-green-700">
              <p className="text-gray-500">
                We’re here to make your real estate journey smooth and easy. Our
                goal is to build strong, lasting relationships with every client
                we serve.
              </p>
            </div>

            <div className="mt-8">
              <Link
                to="/properties"
                className="bg-green-700 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-800"
              >
                Explore Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutUs;
