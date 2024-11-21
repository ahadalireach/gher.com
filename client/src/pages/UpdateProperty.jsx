import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader, PropertyForm, SomethingWrong } from "../components";
import { useEffect, useState } from "react";

const UpdateProperty = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [initialFormData, setInitialFormData] = useState({
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
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/properties/view-property/${propertyId}`
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message);
          setError("PropertyNotFound");
          return;
        }
        setInitialFormData(data);
      } catch (error) {
        setError("ServerError");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // ********* Update Property ********* //
  const handleSubmit = async (formData) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/properties/update-property/${propertyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...formData, userRef: currentUser._id }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
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
        subtitle="Something went wrong."
        description="Sorry, the property you're looking for does not exist. Please try again later."
      />
    );
  }
  return (
    <PropertyForm
      type={"update"}
      onSubmit={handleSubmit}
      initialFormData={initialFormData}
    />
  );
};

export default UpdateProperty;
