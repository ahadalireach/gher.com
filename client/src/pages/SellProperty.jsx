import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PropertyForm } from "../components";

const SellProperty = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // ********* Handle Property Creation ********* //
  const handleSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/properties/create-property`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, userRef: currentUser._id }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      navigate(`/property/${data._id}`);
      toast.success("Property created successfully.");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred while submitting your property.");
    }
  };

  return <PropertyForm type="create" onSubmit={handleSubmit} />;
};

export default SellProperty;
