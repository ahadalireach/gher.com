import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import Cookies from "js-cookie";

import { Link, useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/slices/userSlice";
import { toast } from "react-toastify";

const Profile = () => {
  const [file, setFile] = useState(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({
    fullname: currentUser.fullname || "",
    username: currentUser.username || "",
    email: currentUser.email || "",
    avatar: currentUser.avatar || "",
    facebook: currentUser.facebook || "",
    linkedin: currentUser.linkedin || "",
    instagram: currentUser.instagram || "",
    localno: currentUser.localno || "",
    whatsappno: currentUser.whatsappno || "",
  });
  const [userProperties, setUserProperties] = useState([]);
  const [propertiesShown, setPropertiesShown] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
  const [hideWhatsapp, setHideWhatsapp] = useState(false);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser.localno === currentUser.whatsappno) setHideWhatsapp(true);
  }, []);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        toast.error("Error uploading image. Please try again.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL });
            toast.success("Image uploaded to cloud successfully!");
          })
          .catch((error) => {
            toast.error("Failed to get image URL. Please try again.");
          });
      }
    );
  };

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (e.target.id === "username") {
      setFormData({
        ...formData,
        [e.target.id]: value.replace(/\s+/g, "").toLowerCase(),
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: value,
      });
    }
  };

  const handleCheckboxChange = () => {
    setHideWhatsapp(!hideWhatsapp);
    if (!hideWhatsapp) {
      setFormData({
        ...formData,
        whatsappno: formData.localno,
      });
    } else {
      setFormData({
        ...formData,
        whatsappno: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      whatsappno: hideWhatsapp ? formData.localno : formData.whatsappno,
    };

    const countryCodePattern = /^\+\d+/;
    if (
      updatedFormData.localno &&
      !countryCodePattern.test(updatedFormData.localno)
    ) {
      toast.error("Please enter a valid country code for the local number.");
      return;
    }

    if (
      updatedFormData.whatsappno &&
      !countryCodePattern.test(updatedFormData.whatsappno)
    ) {
      toast.error("Please enter a valid country code for the WhatsApp number.");
      return;
    }

    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/update/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success("Profile updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/delete/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(deleteUserSuccess());
      toast.success("Account deleted successfully!");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleSignoutUser = async () => {
    dispatch(signoutStart());
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signout`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(signoutSuccess(data));
      toast.success("Signed out successfully!");
    } catch (error) {
      dispatch(signoutFailure(error.message));
      toast.error(error.message);
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
        `${import.meta.env.VITE_BACKEND_URL}/users/properties/${
          currentUser._id
        }`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();

      if (data.success === false) {
        setUserProperties([]);
        toast.error("Error showing properties.");
        return;
      }
      setUserProperties(data);
      setPropertiesShown(true);
    } catch (error) {
      setUserProperties([]);
      toast.error("Error fetching properties.");
    }
  };

  const handlePropertyDelete = async (propertyId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/property/delete/${propertyId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      setUserProperties((prev) =>
        prev.filter((property) => property._id !== propertyId)
      );
      toast.success("Property deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSellProperty = () => {
    if (!currentUser.isUpdated) {
      toast.error(
        "Please update your complete profile before selling your property"
      );
      return;
    }
    navigate("/sell-property");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-4xl text-center font-semibold text-green-800 my-6">
        Profile
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 space-y-6"
      >
        <div className="flex flex-col items-center">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="Profile"
            className="rounded-full h-32 w-32 object-cover cursor-pointer mb-4 border-4 border-gray-300"
          />
          {filePerc > 0 && filePerc < 100 && (
            <span className="text-gray-700 text-xs">Uploading {filePerc}%</span>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="fullname"
              className="block text-gray-500 text-sm font-medium mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullname}
              id="fullname"
              className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-gray-500 text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              id="username"
              className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-500 text-sm font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              id="email"
              className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
              onChange={handleChange}
            />
          </div>
          <div className="">
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="facebook"
                  className="block text-gray-500 text-sm font-medium mb-1"
                >
                  Local No
                </label>
                <input
                  type="text"
                  placeholder="Local Number"
                  value={formData.localno}
                  id="localno"
                  className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="whatsappno"
                  className="block text-gray-500 text-sm font-medium mb-1"
                >
                  Whatsapp No
                </label>
                <input
                  type="text"
                  placeholder="WhatsApp Number"
                  value={hideWhatsapp ? formData.localno : formData.whatsappno}
                  id="whatsappno"
                  className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
                  onChange={handleChange}
                  disabled={hideWhatsapp}
                />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="hideWhatsapp"
                checked={hideWhatsapp}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="hideWhatsapp" className="text-gray-600 text-sm">
                WhatsApp Number, Same as Local No
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label
                htmlFor="facebook"
                className="block text-gray-500 text-sm font-medium mb-1"
              >
                Facebook
              </label>
              <input
                type="text"
                placeholder="Facebook URL"
                id="facebook"
                className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
                value={formData.facebook}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="linkedin"
                className="block text-gray-500 text-sm font-medium mb-1"
              >
                Linkedin
              </label>
              <input
                type="text"
                placeholder="LinkedIn URL"
                id="linkedin"
                className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="instagram"
                className="block text-gray-500 text-sm font-medium mb-1"
              >
                Instagram
              </label>
              <input
                type="text"
                placeholder="Instagram URL"
                id="instagram"
                className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-700"
                value={formData.instagram}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
        <button
          onClick={handleSellProperty}
          type="button"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
        >
          Sell Property
        </button>

        <div className="flex justify-between mt-5">
          <span
            className="text-red-700 cursor-pointer hover:text-red-800"
            onClick={handleDeleteUser}
          >
            Delete account
          </span>
          <span
            className="text-red-700 cursor-pointer hover:text-red-800"
            onClick={handleSignoutUser}
          >
            Sign out
          </span>
        </div>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={handleShowProperties}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800 font-semibold"
        >
          {propertiesShown ? "Hide Properties List" : "Show My Properties List"}
        </button>
      </div>
      {propertiesShown && !error && userProperties.length === 0 ? (
        <h1 className="text-center mt-7 text-xl font-semibold">
          No Property Found!
        </h1>
      ) : (
        userProperties.length > 0 && (
          <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
            <h1 className="text-center text-3xl font-bold text-gray-500">
              Your Properties
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
                  <Link to={`/update-property/${property._id}`}>
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

export default Profile;
