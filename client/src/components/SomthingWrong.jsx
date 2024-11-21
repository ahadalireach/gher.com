/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const SomethingWrong = ({ isHome, title, subtitle, description }) => {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        {title && (
          <h1 className="text-6xl font-bold text-green-700 mb-4">{title}</h1>
        )}
        {subtitle && (
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            {subtitle}
          </h2>
        )}
        {description && (
          <p className="text-lg text-gray-600 mb-8">{description}</p>
        )}

        {!isHome && (
          <Link
            to="/"
            className="text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 px-6 py-3 rounded-lg text-lg"
          >
            Go Back to Home
          </Link>
        )}
      </div>
    </main>
  );
};

export default SomethingWrong;
