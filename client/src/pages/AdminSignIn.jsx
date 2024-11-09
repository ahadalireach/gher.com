import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  adminSigninSuccess,
  adminSigninFailure,
} from "../redux/slices/adminSlice";

const AdminSignIn = () => {
  const [formData, setFormData] = useState({
    loginIdentifier: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.loginIdentifier || !formData.password) {
      toast.error("Both fields are required!");
      setLoading(false);
      return;
    }
    try {
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
        toast.error(data.message || "Admin Sign-in failed!");
        setLoading(false);
        return;
      }
      dispatch(adminSigninSuccess(data));
      toast.success("Admin Sign-in successful!");
      navigate("/admin-dashboard");
    } catch (error) {
      dispatch(adminSigninFailure(error.message));
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 max-w-md w-full bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl text-center font-semibold text-green-700 my-6">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder={"Username or Email"}
            className="border rounded-lg p-3 w-full border-gray-300 outline-none focus:border-green-700"
            name="loginIdentifier"
            value={formData.loginIdentifier}
            onChange={handleChange}
            disabled={loading}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={"Password"}
              className="border rounded-lg p-3 w-full border-gray-300 outline-none focus:border-green-700 pr-10"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
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
            type="submit"
            className={`bg-red-600 text-white p-3 rounded-lg uppercase hover:bg-red-800 transition font-semibold ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="flex items-center gap-2 mt-5">
          <p className="text-gray-600">Want to explore as user?</p>
          <Link to="/sign-up" className="group">
            <span className="text-green-700 hover:text-green-600">Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
