import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthForm } from "../components";
import { signinSuccess } from "../redux/slices/userSlice";

const UserSignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ********* Handle User Sign-In ********* //
  const handleSignIn = async (credentials) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signin`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message);
        return;
      }

      dispatch(signinSuccess(result));
      toast.success("Sign-in successful.");
      navigate("/profile");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  return <AuthForm type="signin" onSubmit={handleSignIn} />;
};

export default UserSignIn;
