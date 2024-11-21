import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  adminSignoutSuccess,
  updateAdminSuccess,
} from "../redux/slices/adminSlice";
import { ProfileForm } from "../components";

const AdminProfile = () => {
  const { currentAdmin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [initialFormData] = useState({
    fullname: currentAdmin.fullname,
    username: currentAdmin.username,
    email: currentAdmin.email,
    avatar: currentAdmin.avatar,
  });

  // ********* Update Admin ********* //
  const handleSubmit = async (formData) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/update-admin/${
          currentAdmin._id
        }`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      dispatch(updateAdminSuccess(data));
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Fetch error:", error.message);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  // ********* Admin Signout ********* //
  const handleSignoutAdmin = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/signout`,
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
      toast.success(data.message);
      dispatch(adminSignoutSuccess(data));
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-4xl text-center font-semibold text-green-800 my-6">
        Admin Profile
      </h1>
      <ProfileForm
        isAdmin="true"
        initialFormData={initialFormData}
        onSubmit={handleSubmit}
        handleSignoutAdmin={handleSignoutAdmin}
      />
    </div>
  );
};

export default AdminProfile;
