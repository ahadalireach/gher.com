import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ProfileForm, UserPropertyItem } from "../components";
import {
  updateUserSuccess,
  signoutSuccess,
  deleteUserSuccess,
} from "../redux/slices/userSlice";

const UserProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [initialProfileData] = useState({
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
  const [arePropertiesVisible, setArePropertiesVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ********* Update Profile ********* //
  const handleProfileUpdate = async (profileData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/update-user/${
          currentUser._id
        }`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData),
        }
      );
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        return;
      }

      toast.success("Profile updated successfully.");
      dispatch(updateUserSuccess(result));
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  // ********* Signout User ********* //
  const handleUserSignout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signout`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message);
        return;
      }
      navigate("/");
      dispatch(signoutSuccess(result));
      toast.success(result.message);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  // ********* Delete User ********* //
  const handleUserDeletion = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/delete-user/${
          currentUser._id
        }`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message);
        return;
      }

      navigate("/sign-in");
      dispatch(deleteUserSuccess());
      toast.success(result.message);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  // ********* User Properties ********* //
  const toggleUserProperties = async () => {
    try {
      if (arePropertiesVisible) {
        setArePropertiesVisible(false);
        setUserProperties([]);
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/user-properties/${
          currentUser._id
        }`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message);
        return;
      }
      setUserProperties(result);
      setArePropertiesVisible(true);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  // ********* Delete Property ********* //
  const handleDeleteProperty = async (propertyId) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/properties/delete-property/${propertyId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to delete property.");
        return;
      }

      setUserProperties((prev) =>
        prev.filter((property) => property._id !== propertyId)
      );
      toast.success(result.message);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl text-center font-semibold text-green-800 my-6">
        Profile
      </h1>
      <ProfileForm
        onSubmit={handleProfileUpdate}
        initialFormData={initialProfileData}
        handleSignoutUser={handleUserSignout}
        handleDeleteUser={handleUserDeletion}
      />
      <div className="my-4 text-center">
        <button
          onClick={toggleUserProperties}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800 font-semibold"
        >
          {arePropertiesVisible
            ? "Hide Properties List"
            : "Show My Properties List"}
        </button>
      </div>
      {arePropertiesVisible && userProperties.length === 0 ? (
        <h1 className="text-center mt-7 text-xl font-semibold text-gray-700 bg-yellow-100 p-4 mb-5 rounded-lg shadow-md border-2 border-yellow-300">
          No Property Found!
        </h1>
      ) : (
        userProperties.length > 0 && (
          <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
            <h2 className="text-center text-xl font-bold text-gray-500">
              Your Properties
            </h2>
            {userProperties.map((property) => (
              <UserPropertyItem
                key={property._id}
                property={property}
                isSmallScreen={isSmallScreen}
                handleDeleteProperty={handleDeleteProperty}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default UserProfile;
