/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ProfileForm } from "../components";
import { toast } from "react-toastify";
import { signoutSuccess } from "../redux/slices/userSlice";

const UserProfilePage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [initalFormData] = useState({
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ********* Update Profile ********* //
  const handleSubmit = async (formData) => {
    try {
    } catch (error) {}
  };

  // ********* Signout User ********* //
  const handleSignoutUser = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signout`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      navigate("/");
      dispatch(signoutSuccess(data));
      toast.success(data.message);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  // ********* Delete User ********* //
  const handleDeleteUser = async () => {
    try {
    } catch (error) {}
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-4xl text-center font-semibold text-green-800 my-6">
        Profile
      </h1>
      <ProfileForm
        onSubmit={handleSubmit}
        type="user"
        initalFormData={initalFormData}
        handleSignoutUser={handleSignoutUser}
        handleDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default UserProfilePage;
