import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  SellerInfo,
  Loader,
  SomethingWrong,
  ImageSwiper,
  PropertyDetails,
} from "../components";
import { toast } from "react-toastify";

const PropertyInfo = () => {
  const [property, setProperty] = useState(null);
  const [showSellerInfo, setShowSellerInfo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { id: propertyId } = useParams();

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
        setProperty(data);
      } catch (error) {
        setError("ServerError");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleSellerInfoError = (hasError) => {
    setShowSellerInfo(!hasError);
  };

  const showContact = property?.userRef !== currentUser?._id;

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
    <main className="bg-gray-50">
      {property && (
        <div>
          <ImageSwiper property={property} />

          <div className="flex flex-col lg:flex-row gap-12 px-4 sm:px-14 lg:px-20">
            <div
              className={`flex flex-col ${
                showContact && showSellerInfo ? "lg:w-2/3" : "w-full"
              } max-w-5xl`}
            >
              <PropertyDetails
                property={property}
                showContact={showContact}
                showSellerInfo={showSellerInfo}
              />
            </div>
            {showContact && showSellerInfo && (
              <div className="w-full lg:w-1/3  mb-12 lg:ml-12">
                <SellerInfo
                  property={property}
                  onError={handleSellerInfoError}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default PropertyInfo;
