/* eslint-disable no-unused-vars */
import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  adminSignoutStart,
  adminSigninSuccess,
  adminSigninFailure,
} from "../redux/slices/adminSlice";
import { AuthForm } from "../components";

const AdminSignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (formData) => {
    try {
      dispatch(adminSignoutStart());
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/signin`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(adminSigninFailure(data.message));
        throw new Error(data.message || "Admin Sign-in failed.");
      }

      dispatch(adminSigninSuccess(data));
      toast.success("Admin Sign-in successful.");
      navigate("/admin-dashboard");
    } catch (error) {
      dispatch(adminSigninFailure(error.message));
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };

  return <AuthForm type="adminsignin" onSubmit={handleSubmit} />;
};

export default AdminSignInPage;
