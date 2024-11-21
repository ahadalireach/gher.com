import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminSigninSuccess } from "../redux/slices/adminSlice";
import { AuthForm } from "../components";

const AdminSignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ********* Admin Signin ********* //
  const handleSubmit = async (formData) => {
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
        toast.error(data.message);
        return;
      }

      toast.success("Admin logged in successful.");
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
