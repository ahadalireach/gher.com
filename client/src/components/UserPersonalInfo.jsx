/* eslint-disable react/prop-types */
import { FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";

const UserPersonalInfo = ({
  userData,
  handleShowProperties,
  propertiesShown,
}) => {
  return (
    <div className="bg-white sm:rounded-2xl p-6 mt-6 gap-3 shadow-lg w-full max-w-2xl mx-auto border border-gray-200 flex flex-col items-center justify-center">
      <img
        src={
          userData?.avatar ||
          "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
        }
        alt="User Avatar"
        className="h-28 w-28 sm:h-36 sm:w-36 rounded-full object-cover border-4 border-green-500 shadow-md"
      />
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
        {userData?.fullname}
      </h1>
      <a
        className="text-md text-gray-700 text-center"
        href={`mailto:${userData?.email}`}
      >
        {userData?.email}
      </a>
      <div className="flex flex-row gap-8 justify-center">
        {userData?.whatsappno && (
          <a
            href={`https://wa.me/${userData?.whatsappno}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-green-700 border-2 border-green-700 py-2 px-4 rounded-lg hover:bg-green-50 font-semibold transition-colors duration-300"
          >
            Whatsapp
          </a>
        )}
        {userData?.localno && (
          <a
            href={`tel:${userData?.localno}`}
            target="_blank"
            className="bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition-colors duration-300 font-semibold"
          >
            Call
          </a>
        )}
      </div>
      <div className="flex items-center gap-8 justify-center">
        {userData?.linkedin && (
          <a
            href={userData?.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-gray-300 rounded-lg hover:bg-green-100 transition-colors cursor-pointer text-gray-500 text-xl hover:text-green-700"
          >
            <FaLinkedin />
          </a>
        )}
        {userData?.facebook && (
          <a
            href={userData?.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-gray-300 rounded-lg hover:bg-green-100 transition-colors cursor-pointer text-gray-500 text-xl hover:text-green-700"
          >
            <FaFacebook />
          </a>
        )}
        {userData?.instagram && (
          <a
            href={userData?.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-gray-300 rounded-lg hover:bg-green-100 transition-colors cursor-pointer text-gray-500 text-xl hover:text-green-700"
          >
            <FaInstagram />
          </a>
        )}
      </div>
      <button
        onClick={handleShowProperties}
        className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-800 transition-colors duration-300 font-semibold"
      >
        {propertiesShown ? "Hide Properties List" : "Show Properties List"}
      </button>
    </div>
  );
};

export default UserPersonalInfo;
