import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileForm } from "../components";

const UpdateUser = () => {
  const [userFormData, setUserFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
    facebook: "",
    linkedin: "",
    instagram: "",
    localno: "",
    whatsappno: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/user-info/${id}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          toast.error(data.message);
          return;
        }

        setUserFormData(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to connect to the server. Please try again later.");
      }
    };
    fetchUserData();
  }, [id, navigate]);

  // ************** Update User Profile ********* //
  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/update-user/${id}`,
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
        return;
      }
      toast.success("Profile updated successfully.");
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-4xl text-center font-semibold text-green-800 my-6">
        Update Profile of {userFormData?.username || "User "}
      </h1>
      <ProfileForm
        isAdmin={true}
        updateUser
        AsAdmin={true}
        onSubmit={handleFormSubmit}
        initialFormData={userFormData}
      />
    </div>
  );
};

export default UpdateUser;
