import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components";

const UserSignUp = () => {
  const navigate = useNavigate();

  // ********* Handle User Signup ********* //
  const handleSignUp = async (userData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      navigate("/sign-in");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  return <AuthForm type="signup" onSubmit={handleSignUp} />;
};

export default UserSignUp;
