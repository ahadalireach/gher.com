/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  ConfirmationModal,
  UserPersonalInfo,
  UserPropertiesInfo,
  SomethingWrong,
  Loader,
} from "../components";

const UserInfo = () => {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [arePropertiesVisible, setArePropertiesVisible] = useState(false);
  const [userProperties, setUserProperties] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [propertyIdToDelete, setPropertyIdToDelete] = useState(null);

  // ************** Fetch User Info **************** //
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/user-info/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError("User Not Found");
        return;
      }

      setUserDetails(data);
    } catch (error) {
      setError("ServerError");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ************** Fetch User Properties ********* //
  const toggleUserPropertiesVisibility = async () => {
    try {
      if (arePropertiesVisible) {
        setArePropertiesVisible(false);
        setUserProperties([]);
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/user-properties/${
          userDetails._id
        }`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
        return;
      }
      setUserProperties(data);
      setArePropertiesVisible(true);
    } catch (error) {
      setUserProperties([]);
      console.error("Fetch error:", error);
    }
  };

  // ************** Delete User Property ********* //
  const deleteUserProperty = async (propertyId) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/delete-property/${propertyId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Failed to delete property.");
        return;
      }

      setUserProperties((prevProperties) =>
        prevProperties.filter((property) => property._id !== propertyId)
      );
      toast.success(data.message);
      setIsDeleteConfirmationVisible(false);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  useEffect(() => {
    fetchUserDetails();
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  // ************** Property Delete Confirmation ********* //
  const confirmDeleteProperty = (propertyId) => {
    setPropertyIdToDelete(propertyId);
    setIsDeleteConfirmationVisible(true);
  };

  const handleConfirmDelete = () => {
    if (propertyIdToDelete) {
      deleteUserProperty(propertyIdToDelete);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmationVisible(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-7 text-2xl text-gray-700">
        <Loader />
      </div>
    );
  }

  // ************** Render Error States ********* //
  if (error === "ServerError") {
    return (
      <SomethingWrong
        title="Oops!"
        subtitle="Something went wrong."
        description="Sorry, failed to connect to the server. Please try again later."
      />
    );
  }

  if (error === "User Not Found") {
    return (
      <SomethingWrong
        title="Oops!"
        subtitle="User  Not Found."
        description="Sorry, the user you're looking for does not exist. Please try again later."
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 max-w-4xl mx-auto">
      <UserPersonalInfo
        userData={userDetails}
        handleShowProperties={toggleUserPropertiesVisibility}
        propertiesShown={arePropertiesVisible}
      />
      {arePropertiesVisible && (
        <UserPropertiesInfo
          userData={userDetails}
          userProperties={userProperties}
          isSmallScreen={isSmallScreen}
          handlePropertyDelete={confirmDeleteProperty}
        />
      )}
      <ConfirmationModal
        isOpen={isDeleteConfirmationVisible}
        title="Are you sure you want to delete this property?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default UserInfo;
