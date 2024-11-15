/* eslint-disable no-unused-vars */
import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components";

const UserSignUpPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
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
      toast.success("Sign-up successful.");
      navigate("/sign-in");
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  return <AuthForm type="signup" onSubmit={handleSubmit} />;
};

export default UserSignUpPage;
