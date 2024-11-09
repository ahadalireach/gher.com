import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { OAuth } from "../components";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;

    if (e.target.id === "username") {
      setFormData({
        ...formData,
        [e.target.id]: value.replace(/\s+/g, "").toLowerCase(),
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullname ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
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

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Sign-up successful!");
      navigate("/sign-in");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center my-10 bg-gray-50">
      <div className="p-6 max-w-md w-full bg-white shadow-lg rounded-lg border border-gray-200">
        <h1 className="text-3xl font-semibold text-green-700 my-6 text-center">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="border rounded-lg p-3 w-full border-gray-300 outline-none focus:border-green-500"
            id="fullname"
            value={formData.fullname}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Username"
            className="border rounded-lg p-3 w-full border-gray-300 outline-none focus:border-green-500"
            id="username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            className="border rounded-lg p-3 w-full border-gray-300 outline-none focus:border-green-500"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <OAuth />
        </form>
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2">
            <p className="text-gray-600">Have an account?</p>
            <Link to="/sign-in" className="group">
              <span className="text-green-700 hover:text-green-600">
                Sign In
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

export default SignUp;
