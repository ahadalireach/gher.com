import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  signinStart,
  signinSuccess,
  signinFailure,
} from "../redux/slices/userSlice";
import { OAuth } from "../components";

const SignIn = () => {
  const [formData, setFormData] = useState({
    loginIdentifier: "",
    password: "",
  });
  const { loading } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.loginIdentifier || !formData.password) {
      toast.error("Both fields are required!");
      return;
    }
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
        toast.error(data.message || "Sign-in failed!");
        return;
      }
      if (data.user && data.user.isDemoUser) {
        toast.info(
          "You are logged in as a demo user. Some features may be limited."
        );
      }
      dispatch(signinSuccess(data));
      toast.success("Sign-in successful!");
      navigate("/");
    } catch (error) {
      dispatch(signinFailure(error.message));
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 max-w-md w-full bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl text-center font-semibold text-green-700 my-6">
          Sign In
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder={"Username or Email"}
            className="border rounded-lg p-3 w-full border-gray-300 outline-none focus:border-green-700"
            id="loginIdentifier"
            value={formData.loginIdentifier}
            onChange={handleChange}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={"Password"}
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
            {loading ? "Loading..." : "Sign In"}
          </button>
          <OAuth />
        </form>
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2">
            <p className="text-gray-600">Don't have an account?</p>
            <Link to="/sign-up" className="group">
              <span className="text-green-700 hover:text-green-600">
                Sign Up
              </span>
            </Link>
          </div>

          <Link
            to="/admin-signin"
            className="text-red-700 hover:text-red-600 transition duration-200 group"
          >
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
