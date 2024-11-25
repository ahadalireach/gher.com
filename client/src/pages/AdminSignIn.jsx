import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthForm } from "../components";
import { adminSigninSuccess } from "../redux/slices/adminSlice";

const AdminSignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ********* Handle Admin Sign-in ********* //
  const handleSubmit = async (formData) => {
    try {
      const response = await fetch(
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

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to sign in");
        return;
      }

      toast.success("Admin logged in successfully.");
      dispatch(adminSigninSuccess(data));
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  return <AuthForm type="admin" onSubmit={handleSubmit} />;
};

export default AdminSignIn;
