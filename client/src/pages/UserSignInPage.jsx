/* eslint-disable no-unused-vars */
import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signinStart,
  signinSuccess,
  signinFailure,
} from "../redux/slices/userSlice";
import { AuthForm } from "../components";

const UserSignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (formData) => {
    try {
      dispatch(signinStart());
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(signinFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(signinSuccess(data));
      toast.success("Sign-in successful.");
      navigate("/");
    } catch (error) {
      dispatch(signinFailure(error.message));
      toast.error("An error occurred. Please try again.");
    }
  };

  return <AuthForm type="signin" onSubmit={handleSubmit} />;
};

export default UserSignInPage;
