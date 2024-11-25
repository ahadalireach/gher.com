import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader, PropertyForm, SomethingWrong } from "../components";

const UpdateProperty = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [propertyFormData, setPropertyFormData] = useState({
    imageUrls: [],
    title: "",
    description: "",
    area: "",
    address: "",
    purpose: "rent",
    floors: 1,
    bedrooms: 1,
    bathrooms: 1,
    kitchens: 1,
    regularPrice: 50,
    discountPrice: 5,
    offer: false,
    parking: false,
    furnished: false,
    school: false,
    hospital: false,
    shoppingMalls: false,
    publicTransport: false,
    restaurants: false,
    playarea: false,
    internet: false,
    gym: false,
    pool: false,
    communityCenter: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id: propertyId } = useParams();
  const navigate = useNavigate();

  // ********* Fetch Property Data ********* //
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/properties/view-property/${propertyId}`
        );
        const data = await response.json();
        if (!response.ok) {
          toast.error(data.message);
          setError("PropertyNotFound");
          return;
        }
        setPropertyFormData(data);
      } catch (error) {
        setError("ServerError");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyId]);

  // ********* Update Property ********* //
  const handleSubmit = async (formData) => {
    const bodyData = currentUser
      ? { ...formData, userRef: currentUser._id }
      : { ...formData };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/${
          currentUser ? "properties/update-property" : "admin/update-property"
        }/${propertyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(bodyData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
        return;
      }
      navigate(`/property/${data._id}`);
      toast.success("Property updated successfully.");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  // ********* Loading and Error Handling ********* //
  if (loading) {
    return (
      <div className="flex justify-center items-center my-7 text-2xl text-gray-700">
        <Loader />
      </div>
    );
  }

  if (error === "ServerError") {
    return (
      <SomethingWrong
        title="Oops!"
        subtitle="Something went wrong."
        description="Sorry, failed to connect to the server. Please try again later."
      />
    );
  }

  if (error === "PropertyNotFound") {
    return (
      <SomethingWrong
        title="Oops!"
        subtitle="Property Not Found."
        description="Sorry, the property you're looking for does not exist. Please try again later."
      />
    );
  }

  return (
    <PropertyForm
      type="update"
      onSubmit={handleSubmit}
      initialFormData={propertyFormData}
    />
  );
};

export default UpdateProperty;
