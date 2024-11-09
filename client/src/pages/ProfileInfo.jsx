import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";

const ProfileInfo = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [propertiesShown, setPropertiesShown] = useState(false);
  const [userProperties, setUserProperties] = useState([]);
  const [error, setError] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  const fetchUser = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/user-profile/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setUserData(data);
    } catch (error) {
      toast.error("Something went wrong, please try again later!");
      setError(error.message);
    }
  };

  const handleShowProperties = async () => {
    try {
      if (propertiesShown) {
        setPropertiesShown(false);
        setUserProperties([]);
        return;
      }
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/user-properties/${
          userData._id
        }`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      setUserProperties(data);
      setPropertiesShown(true);
    } catch (error) {
      setUserProperties([]);
      toast.error("Error fetching properties.");
      setError(error.message);
    }
  };

  const handlePropertyDelete = async (propertyId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/property/${propertyId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setUserProperties((prev) =>
        prev.filter((property) => property._id !== propertyId)
      );
      toast.success("Property deleted successfully!");
    } catch (error) {
      toast.error(error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      {userData ? (
        <div className="bg-white p-4 rounded-2xl shadow-lg w-full max-w-4xl border border-gray-200 flex flex-col items-center transition-transform transform duration-300">
          <img
            src={userData?.avatar || "/default-avatar.png"}
            alt="User Avatar"
            className="h-36 w-36 rounded-full object-cover border-4 border-green-500 shadow-md transition-transform duration-300"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4 tracking-wide">
            {userData?.fullname}
          </h1>
          <p className="text-md text-gray-700 mb-4">{userData?.email}</p>
          <div className="flex flex-col gap-4 mb-4 lg:flex-row lg:gap-6">
            <a
              href={`https://wa.me/${userData?.whatsappno}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-700 border-2 border-green-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-semibold"
            >
              Whatsapp
            </a>
            <a
              href={`tel:${userData?.localno}`}
              target="_blank"
              className="bg-green-700 text-white border-2 border-green-700 py-2 px-4 rounded-lg hover:bg-green-800 hover:border-green-800 transition-colors text-center duration-300 font-semibold"
            >
              Call
            </a>
          </div>

          <div className="flex items-start gap-6">
            {userData?.linkedin && (
              <a
                href={userData?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-gray-300 hover:bg-green-100 transition-colors cursor-pointer text-gray-500 text-xl hover:text-green-700"
              >
                <FaLinkedin />
              </a>
            )}
            {userData?.facebook && (
              <a
                href={userData?.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-gray-300 hover:bg-green-100 transition-colors cursor-pointer text-gray-500 text-xl hover:text-green-700"
              >
                <FaFacebook />
              </a>
            )}
            {userData?.instagram && (
              <a
                href={userData?.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-gray-300 hover:bg-green-100 transition-colors cursor-pointer text-gray-500 text-xl hover:text-green-700"
              >
                <FaInstagram />
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl text-center border border-gray-200">
          <h1 className="text-xl font-semibold text-gray-600 animate-pulse">
            Loading user data...
          </h1>
        </div>
      )}
      <div className="mt-6 text-center">
        <button
          onClick={handleShowProperties}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800 font-semibold"
        >
          {propertiesShown ? "Hide Properties List" : "Show Properties List"}
        </button>
      </div>
      {propertiesShown && !error && userProperties.length === 0 ? (
        <h1 className="text-center mt-7 text-xl font-semibold">
          No Property Found!
        </h1>
      ) : (
        userProperties.length > 0 && (
          <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
            <h1 className="text-center text-base font-bold text-gray-500">
              {userData?.fullname} Properties
            </h1>
            {userProperties.map((property) => (
              <div
                key={property._id}
                className="border border-gray-300 rounded-lg shadow-md p-1 sm:p-4 flex flex-row justify-between items-center gap-1 sm:gap-4 bg-white transition-transform transform hover:shadow-xl"
              >
                <Link
                  to={`/property/${property._id}`}
                  className="flex-shrink-0"
                >
                  <img
                    src={property.imageUrls[0]}
                    alt="property cover"
                    className="h-11 w-11 sm:h-16 sm:w-16 object-cover rounded-md border border-gray-200"
                  />
                </Link>
                <div className="flex flex-row justify-between w-full items-center gap-1 sm:gap-4">
                  <div className="flex-1">
                    <Link
                      to={`/property/${property._id}`}
                      className="text-gray-800 hover:text-green-700 font-semibold text-sm sm:text-lg transition-colors truncate"
                    >
                      {isSmallScreen
                        ? property.title.length > 12
                          ? `${property.title.substr(0, 12)}...`
                          : property.title
                        : property.title.length > 50
                        ? `${property.title.substr(0, 50)}...`
                        : property.title}
                    </Link>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <Link to={`/admin/user-property/update/${property._id}`}>
                    <button className="text-green-700 hover:bg-green-100 px-1 py-2 sm:p-2 rounded-md border border-green-700 text-sm transition-colors">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handlePropertyDelete(property._id)}
                    className="text-red-700 hover:bg-red-100 px-1 py-2 sm:p-2 rounded-md border border-red-700 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default ProfileInfo;
