import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components";

const UserSignUpPage = () => {
  const navigate = useNavigate();

  // ********* Signup User ********* //
  const handleSubmit = async (formData) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
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
      toast.success(data.message);
      navigate("/sign-in");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  return <AuthForm type="signup" onSubmit={handleSubmit} />;
};

export default UserSignUpPage;
