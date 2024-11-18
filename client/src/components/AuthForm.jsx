/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { OAuth } from "../components";

const AuthForm = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    loginIdentifier: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmit(formData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const getPlaceholder = (field) => {
    switch (field) {
      case "fullname":
        return "Full Name";
      case "username":
        return "Username";
      case "email":
        return "Email";
      case "loginIdentifier":
        return type === "signup" ? "Email" : "Username or email";
      default:
        return "Password";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 max-w-md w-full bg-white shadow-lg rounded-lg border border-gray-200">
        <h1 className="text-3xl font-semibold text-green-700 my-6 text-center">
          {type === "signup" ? "Sign Up" : "Sign In"}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {type === "signup" && (
            <>
              <input
                type="text"
                placeholder={getPlaceholder("fullname")}
                className="border rounded-lg p-3 w-full border-gray-300 outline-none focus:border-green-500"
                id="fullname"
                value={formData.fullname}
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder={getPlaceholder("username")}
                className="border rounded-lg p-3 w-full border-gray-300 outline-none focus:border-green-500"
                id="username"
                value={formData.username}
                onChange={handleChange}
              />
            </>
          )}
          <input
            type={"text"}
            placeholder={getPlaceholder("loginIdentifier")}
            className="border rounded-lg p-3 w-full border-gray-300 outline-none focus:border-green-500"
            id={type === "signup" ? "email" : "loginIdentifier"}
            value={
              type === "signup" ? formData.email : formData.loginIdentifier
            }
            onChange={handleChange}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={getPlaceholder("password")}
              className="border rounded-lg p-3 w-full border-gray-300 outline-none focus:border-green-500 pr-10"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <button
            disabled={loading}
            className="bg-green-700 text-white p-3 rounded-lg uppercase hover:bg-green-800 disabled:opacity-70 transition font-semibold"
          >
            {loading ? "Loading..." : type === "signup" ? "Sign Up" : "Sign In"}
          </button>
          <OAuth />
        </form>
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2">
            <p className="text-gray-600">
              {type === "signup"
                ? "Have an account?"
                : "Don't have an account?"}
            </p>
            <Link
              to={type === "signup" ? "/sign-in" : "/sign-up"}
              className="group"
            >
              <span className="text-green-700 hover:text-green-600">
                {type === "signup" ? "Sign In" : "Sign Up"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
