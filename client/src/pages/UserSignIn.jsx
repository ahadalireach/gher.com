import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthForm } from "../components";
import { signinSuccess } from "../redux/slices/userSlice";

const UserSignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ********* Signin Request ********* //
  const handleSubmit = async (formData) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signin`,
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

      navigate("/profile");
      dispatch(signinSuccess(data));
      toast.success("Signin successfully.");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  return <AuthForm type="signin" onSubmit={handleSubmit} />;
};

export default UserSignInPage;
