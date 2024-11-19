import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen p-6 bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-700 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          to="/"
          className="text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 px-6 py-3 rounded-lg text-lg"
        >
          Go Back to Home
        </Link>
      </div>
    </main>
  );
};
export default NotFound;
